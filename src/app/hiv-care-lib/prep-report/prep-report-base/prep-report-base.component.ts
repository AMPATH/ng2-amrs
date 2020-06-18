import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { PrepResourceService } from 'src/app/etl-api/prep-resource.service';
@Component({
  selector: 'prep-report-base',
  templateUrl: './prep-report-base.component.html',
  styleUrls: ['./prep-report-base.component.css']
})
export class PrepReportBaseComponent implements OnInit {
  @Output()
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public prepReportSummaryData: any = [];
  public columnDefs: any = [];
  public reportName = 'PrEP Report';
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
  _month: string;

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

  constructor(public router: Router,
    public route: ActivatedRoute, public prepReport: PrepResourceService) {
    this.route.queryParams.subscribe(
      (data) => {
        data.month === undefined ? this._month = Moment().format('YYYY-MM-DD') : this._month = data.month;
      }
    );
  }

  ngOnInit() {
  }

  public onMonthChange(value): any {
    this._month = Moment(value).endOf('month').format('YYYY-MM-DD');
  }

  public generateReport() {
    this.route.parent.parent.params.subscribe((params: any) => {
      this.storeParamsInUrl(params.location_uuid);
    });
    this.prepReportSummaryData = [];
    this.getPrepMonthlyReport(this.params);
  }

  public storeParamsInUrl(param) {
    this.params = {
      'locationUuids': param,
      '_month': Moment(this._month).endOf('month').format('YYYY-MM-DD'),
      'month': Moment(this._month).endOf('month').format('YYYY-MM-DD'),
      'reportName': this.reportName,
      '_date': Moment(this._month).format('DD-MM-YYYY')
    };
    // store params in url
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public getPrepMonthlyReport(params: any) {

    this.isLoading = true;
    this.prepReport.getPrepMonthlyReport(params).subscribe(data => {
      if (data.error) {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      } else {
        this.showInfoMessage = false;
        this.columnDefs = data.sectionDefinitions;
        this.prepReportSummaryData = this.formatIndicators(data.result);
        this.calculateTotalSummary();
        this.isLoading = false;
      }
    });
  }
  public formatIndicators(indicators) {
    const colDefsContainer = [];
    const obj = {};

    for (let i = 0; i < indicators.length; i++) {
        const o = indicators[i];
        for (const key in o) {
            if (typeof o[key] !== 'function') {
                obj[key] = o[key];
            }
        }
    }
    colDefsContainer.push(obj);
    return colDefsContainer;
  }
  public calculateTotalSummary() {
    const totalsRow = [];
    if (this.prepReportSummaryData.length > 0) {
      const totalObj = {
        location: 'Totals'
      };
      _.each(this.prepReportSummaryData, row => {
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
}
