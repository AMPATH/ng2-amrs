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
  public reportName = 'PLHIV_NCD_V2 Report';
  public currentView = 'monthly';
  public currentViewBelow = 'pdf';
  public month: string;
  public year: number;
  public quarter: string;
  public eDate: string;
  public sDate: string;

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;
  public reportHead: any;
  public enabledControls = 'monthControl';
  public pinnedBottomRowData: any = [];
  public _month: string;
  public _year: string;
  public _quarter: string;
  public _sDate: string;
  public _eDate: string;
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

  ngOnInit() {}

  public onMonthChange(value): any {
    this._month = Moment(value).endOf('month').format('YYYY-MM-DD');
  }

  onYearSelected(year: string) {
    this._year = year;
  }

  onQuarterSelected(quarter: string) {
    this._quarter = quarter;
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
      _month: Moment(this._month).endOf('month').format('YYYY-MM-DD'),
      month: Moment(this._month).endOf('month').format('YYYY-MM-DD'),
      year: this._year,
      quarter: this._quarter,
      reportName: this.reportName,
      _date: Moment(this._month).format('DD-MM-YYYY')
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
        // indicatorGender: value.gender,
        // sDate: this._sDate,
        eDate: this._eDate,
        month: this._month,
        locationUuids: $event.location,
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
