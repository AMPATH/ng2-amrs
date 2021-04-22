import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { IptReportService } from 'src/app/etl-api/ipt-report.service';
import * as Moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'ipt-base-report',
  templateUrl: './ipt-report-base.component.html',
  styleUrls: ['./ipt-report-base.component.css']
})
export class IptBaseReportComponent implements OnInit {
  public isLoading = false;
  public enabledControls = 'monthControl';
  public reportName = 'Ipt Report';
  public locationUuids;
  public params: {
    locationUuids: string;
    endDate: any;
    displayTabularFilters: boolean;
  };
  public showInfoMessage: boolean;
  public statusError: boolean;
  public errorMessage = '';
  public columnDefs: any = [];
  public iptReportData: any = [];
  public displayTabluarFilters = false;
  public pinnedBottomRowData: Array<any> = [];
  month: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public iptReportService: IptReportService,
    public _location: Location
  ) {
    this.route.queryParams.subscribe((data) => {
      data.endDate === undefined
        ? (this.month = Moment().endOf('month').format('YYYY-MM-DD'))
        : (this.month = data.month);
    });
  }

  public ngOnInit() {}

  public onMonthChange(value): any {
    this.month = Moment(value).endOf('month').format('YYYY-MM-DD');
  }

  public generateReport() {
    this.isLoading = true;
    this.route.parent.parent.params.subscribe((params: any) => {
      this.storeParamsInUrl(params.location_uuid);
    });
    this.getIptReportSummaryData();
  }

  public storeParamsInUrl(param) {
    this.params = {
      locationUuids: param,
      endDate: Moment(this.month).endOf('month').format('YYYY-MM-DD'),
      displayTabularFilters: this.displayTabluarFilters
    };
    // store params in url
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public onIndicatorSelected(value: {
    field: string;
    headerName: string;
    location: string;
  }) {
    this.router.navigate(['ipt-report-patientlist'], {
      relativeTo: this.route,
      queryParams: {
        indicators: value.field,
        indicatorHeader: value.headerName,
        locationUuids: value.location,
        endDate: this.month
      }
    });
  }

  public getIptReportSummaryData() {
    this.iptReportService.getIptReportData(this.params).subscribe((data) => {
      if (data.error) {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      } else {
        this.columnDefs = data.sectionDefinitions;
        this.iptReportData = data.result;
        this.calculateTotalSummary();
        this.isLoading = false;
      }
    });
  }

  public calculateTotalSummary() {
    const totalsRow = [];
    if (this.iptReportData.length > 0) {
      const totalObj = {
        location: 'Totals'
      };
      _.each(this.iptReportData, (row) => {
        Object.keys(row).map((key, index) => {
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

  public goBack() {
    const currentUrl = this._location.path();
    const previousUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
    this.router.navigate([previousUrl]);
  }
}
