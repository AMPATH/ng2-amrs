import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MnchResourceService } from 'src/app/etl-api/mnch-resource.service';
import * as Moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'mnch-base-report',
  templateUrl: './mnch-base-report.component.html',
  styleUrls: ['./mnch-base-report.component.css']
})
export class MnchBaseReportComponent implements OnInit {
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public mnchReportSummaryData: any = [];
  public columnDefs: any = [];
  public reportName = 'MNCH Report';
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
    public mnchReport: MnchResourceService
  ) {
    this.route.queryParams.subscribe((data) => {
      data.month === undefined
        ? (this._month = Moment()
            .subtract(1, 'M')
            .endOf('month')
            .format('YYYY-MM-DD'))
        : (this._month = data.month);

      // this.showDraftReportAlert(this._month);
    });
  }

  ngOnInit() {}
  public onMonthChange(value): any {
    this._month = Moment(value).endOf('month').format('YYYY-MM-DD');
  }

  public generateReport() {
    this.route.parent.parent.params.subscribe((params: any) => {
      this.storeParamsInUrl(params.location_uuid);
    });
    this.mnchReportSummaryData = [];
    this.getMnchMonthlyReport(this.params);
  }
  public storeParamsInUrl(param) {
    this.params = {
      locationUuids: param,
      _month: Moment(this._month).endOf('month').format('YYYY-MM-DD'),
      month: Moment(this._month).endOf('month').format('YYYY-MM-DD'),
      reportName: this.reportName,
      _date: Moment(this._month).format('DD-MM-YYYY')
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }
  public getMnchMonthlyReport(params: any) {
    this.isLoading = true;
    this.mnchReport.getMnchMonthlyReport(params).subscribe((data) => {
      if (data.error) {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      } else {
        this.showInfoMessage = false;
        this.columnDefs = data.sectionDefinitions;
        this.mnchReportSummaryData = data.result;
        this.calculateTotalSummary();
        this.isLoading = false;
        this.showDraftReportAlert(this._month);
      }
    });
  }
  public calculateTotalSummary() {
    const totalsRow = [];
    if (this.mnchReportSummaryData.length > 0) {
      const totalObj = {
        location: 'Totals'
      };
      _.each(this.mnchReportSummaryData, (row) => {
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
  public onIndicatorSelected(value) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        indicators: value.field,
        indicatorHeader: value.headerName,
        month: Moment(this._month).endOf('month').format('YYYY-MM-DD'),
        locationUuids: value.location,
        currentView: this.currentView
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
