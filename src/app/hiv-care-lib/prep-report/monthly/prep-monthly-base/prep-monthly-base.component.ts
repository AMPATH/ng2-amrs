import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { PrepMonthlyResourceService } from 'src/app/etl-api/prep-monthly-resource.service';

@Component({
  selector: 'prep-monthly-report-base',
  templateUrl: './prep-monthly-base.component.html',
  styleUrls: ['./prep-monthly-base.component.css']
})
export class PrepMonthlyReportBaseComponent implements OnInit {
  @Output()
  public params: any;

  public indicators: string;
  public selectedIndicators = [];
  public prepReportSummaryData: any = [];
  public columnDefs: any = [];
  public reportName = 'PrEP Monthly Report';
  public currentView = 'monthly';
  public currentViewBelow = 'pdf';
  public month: string;

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;
  public reportHead: any;
  public pinnedBottomRowData: any = [];
  public enabledControls = 'monthControl';
  public _month: string;
  public isReleased = true;

  public _locationUuids: any = [];

  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    const locationUuids = [];
    _.each(v, (location: any) => {
      if (location.value) {
        locationUuids.push(location);
      }
    });
    this._locationUuids = locationUuids;
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public prepReport: PrepMonthlyResourceService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      if (params) {
        params.month === undefined
          ? (this._month = Moment()
              .subtract(1, 'M')
              .endOf('month')
              .format('YYYY-MM-DD'))
          : (this._month = params.month);
      }
      this.showDraftReportAlert(this._month);
    });
  }

  ngOnInit() {}

  public generateReport() {}

  public onMonthChange(value): any {
    this._month = Moment(value).endOf('month').format('YYYY-MM-DD');
  }

  public storeParamsInUrl(params: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params
    });
  }

  public getPrepMonthlyAggReport(params: any) {
    this.columnDefs = [];
    this.prepReportSummaryData = [];

    this.storeParamsInUrl(params);
    this.isLoading = true;
    this.prepReport.getPrepMonthlyAggReport(params).subscribe((data) => {
      if (data.error) {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      } else {
        this.showInfoMessage = false;
        this.columnDefs = data.sectionDefinitions;
        this.prepReportSummaryData = data.result;
        console.log('prepData', this.prepReportSummaryData);
        this.isLoading = false;
        this.showDraftReportAlert(this._month);
      }
    });
  }

  public indicatorSelected($event: any) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        indicators: $event.indicator,
        indicatorHeader: $event.indicatorHeader,
        month: $event.month,
        locationUuids: $event.locationUuids
      }
    });
  }

  public setParams() {
    this.params = {
      locationUuids: this._locationUuids,
      month: Moment(this._month).format('YYYY-MM-DD')
    };
  }

  public showDraftReportAlert(date) {
    if (date != null && date >= Moment().endOf('month').format('YYYY-MM-DD')) {
      this.isReleased = false;
    } else {
      this.isReleased = true;
    }
  }
}
