import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { PlhivNcdV2ResourceService } from 'src/app/etl-api/plhiv-ncd-v2-resource.service';

@Component({
  selector: 'app-plhiv-ncd-v2-report-base',
  templateUrl: './plhiv-ncd-v2-report-base.component.html',
  styleUrls: ['./plhiv-ncd-v2-report-base.component.css']
})
export class PlhivNcdV2ReportBaseComponent implements OnInit {
  @Output()
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public plhivNcdV2ReportSummaryData: any = [];
  public columnDefs: any = [];
  public reportName = 'PLHIV_NCD_Report';
  public currentView = 'monthly';
  public currentViewBelow = 'pdf';
  public month: string;

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;
  public reportHead: any;
  public enabledControls = 'monthControl';
  public enabledControls2 = 'datesControl';
  public pinnedBottomRowData: any = [];
  public _month: string;
  public isReleased = true;
  public v: any = [0, 1];
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

  public _startDate: Date = Moment().subtract(1, 'M').endOf('month').toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
  }

  public _endDate: Date = Moment().subtract(1, 'M').endOf('month').toDate();
  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(v: Date) {
    this._endDate = v;
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public plhivNcdV2ResourceService: PlhivNcdV2ResourceService
  ) {
    this.route.queryParams.subscribe((data) => {
      data.month === undefined
        ? (this._month = Moment()
            .subtract(1, 'M')
            .endOf('month')
            .format('YYYY-MM-DD'))
        : (this._month = data.month);

      this.showDraftReportAlert(this._month);
    });
  }

  public handleChange($event: any) {
    this.plhivNcdV2ReportSummaryData = [];
    this.columnDefs = [];
    if ($event.index === 0) {
      this.currentView = 'monthly';
    } else {
      this.currentView = 'range';
    }
    this._month = Moment().subtract(1, 'M').endOf('month').format('YYYY-MM-DD');
    this._startDate = Moment().subtract(1, 'M').endOf('month').toDate();
    this._endDate = Moment().subtract(1, 'M').endOf('month').toDate();
  }

  ngOnInit() {}

  public onMonthChange(value): any {
    this._month = Moment(value).endOf('month').format('YYYY-MM-DD');
    this._endDate = new Date(Moment(value).endOf('month').format('YYYY-MM-DD'));
    this._startDate = new Date(
      Moment(value).endOf('month').format('YYYY-MM-DD')
    );
  }

  public generateReport(): any {
    this.route.parent.parent.params.subscribe((params: any) => {
      this.storeParamsInUrl(params.location_uuid);
    });
    this.plhivNcdV2ReportSummaryData = [];
    this.getPLHIVNCDv2MonthlyReport(this.params);
  }

  public storeParamsInUrl(param) {
    this.params = {
      locationUuids: param,
      month: Moment(this._month).endOf('month').format('YYYY-MM-DD'),
      startDate: Moment(this._startDate).format('YYYY-MM-DD'),
      endDate: Moment(this._month).endOf('month').format('YYYY-MM-DD'),
      reportName: this.reportName,
      currentView: this.currentView
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public getPLHIVNCDv2MonthlyReport(params: any) {
    this.isLoading = true;
    this.plhivNcdV2ResourceService
      .getPLHIVNCDv2MonthlyReport(params)
      .subscribe((data) => {
        if (data.error) {
          this.showInfoMessage = true;
          this.errorMessage = `There has been an error while loading the report, please retry again`;
          this.isLoading = false;
        } else {
          this.showInfoMessage = false;
          this.columnDefs = data.sectionDefinitions;
          this.plhivNcdV2ReportSummaryData = data.result;
          this.calculateTotalSummary();
          this.isLoading = false;
          this.showDraftReportAlert(this._month);
        }
      });
  }

  public calculateTotalSummary() {
    const totalsRow = [];
    if (this.plhivNcdV2ReportSummaryData.length > 0) {
      const totalObj = {
        location: 'Totals'
      };
      _.each(this.plhivNcdV2ReportSummaryData, (row) => {
        Object.keys(row).map((key) => {
          if (Number.isInteger(row[key]) === true) {
            if (totalObj[key]) {
              totalObj[key] = row[key] + totalObj[key];
            } else {
              totalObj[key] = row[key];
            }
          } else {
            if (Number.isNaN(totalObj[key])) {
              totalObj[key] = 0;
            }
            if (totalObj[key] === null) {
              totalObj[key] = 0;
            }
            totalObj[key] = 0 + totalObj[key];
          }
        });
      });
      totalObj.location = 'Totals';
      totalsRow.push(totalObj);
      this.pinnedBottomRowData = totalsRow;
    }
  }
  public onIndicatorSelected($event) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        indicators: $event.indicator,
        indicatorHeader: $event.headerName,
        month: this._month,
        startDate: Moment(this._startDate).format('YYYY-MM-DD'),
        endDate: Moment(this._month).endOf('month').format('YYYY-MM-DD'),
        reportName: this.reportName,
        currentView: this.currentView,
        locationUuids: $event.location
      }
    });
  }

  public showDraftReportAlert(date) {
    if (date != null && date >= Moment().endOf('month').format('YYYY-MM-DD')) {
      this.isReleased = false;
    } else {
      this.isReleased = true;
    }
  }
}
