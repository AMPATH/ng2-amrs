import { PmtctCalhivRriReportService } from './../../etl-api/pmtct-calhiv-rri-report.service';
import { take } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';

@Component({
  selector: 'pmtct-calhiv-rri-report',
  templateUrl: './pmtct-calhiv-rri-report.component.html',
  styleUrls: ['./pmtct-calhiv-rri-report.component.css']
})
export class PmtctCalhivRriReportComponent implements OnInit {
  @Input() locations = '';
  public summaryTitle = 'RRI Monthly Summary Report';
  public params = {
    startDate: '',
    endDate: '',
    locationUuids: '',
    displayTabluarFilters: true,
    reportName: this.summaryTitle,
    _date: Moment().format('MMM YYYY')
  };

  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  public errorObj = {
    message: '',
    isError: false
  };
  public rriSummary: any = [];
  public rriOutcomeSummary: any;
  public sectionDefs: any;
  public outcomeSectionDefs: any;
  public currentView = 'pdf';

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _pmtctCalhivRriReportService: PmtctCalhivRriReportService
  ) {}

  public ngOnInit() {}

  public selectedFilter($event) {
    this.setParams($event);
    this.getRriSummary(this.params);
  }

  public setParams(filterParams: any) {
    this.params = {
      startDate: filterParams.startDate,
      endDate: filterParams.endDate,
      locationUuids: filterParams.locationUuids,
      displayTabluarFilters: true,
      reportName: this.summaryTitle,
      _date: Moment(filterParams.startDate).format('MMMM YYYY')
    };
  }

  public loading() {
    this.busyIndicator = {
      busy: true,
      message: 'Fetching report...please wait'
    };
  }

  public endLoading() {
    this.busyIndicator = {
      busy: false,
      message: ''
    };
  }

  public getRriSummary(params: any) {
    this.loading();
    this._pmtctCalhivRriReportService.getRriIndicatorsReport(params).subscribe(
      (result: any) => {
        if (result) {
          this.rriSummary = result.result;
          this.sectionDefs = result.sectionDefinitions;
          this.endLoading();
        }
      },
      (err) => {
        this.endLoading();
        this.errorObj = {
          isError: true,
          message: err.error.message ? err.error.message : ''
        };
      }
    );
  }

  public onTabChanged($event) {}

  public setCellSelectionRri($event, $event2) {
    this.viewPatientList($event);
  }

  public viewPatientList(data) {
    this._route.parent.params.subscribe((result: any) => {
      if (result) {
        data.location = result.location_uuid;
      }
    });

    const params: any = {
      locationUuids: data.location,
      indicators: data.field,
      startDate: this.params.startDate,
      endDate: this.params.endDate,
      reportName: this.summaryTitle
    };

    this._router.navigate(['./patient-list'], {
      relativeTo: this._route,
      queryParams: params
    });
  }
}
