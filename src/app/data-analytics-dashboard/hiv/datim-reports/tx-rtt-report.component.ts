import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as rison from 'rison-node';
import * as Moment from 'moment';

import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';
import { TxRttResourceService } from 'src/app/etl-api/tx-rtt-resource.service';
import { TxRttReportBaseComponent } from 'src/app/hiv-care-lib/tx-rtt-report/tx-rtt-report-base/tx-rtt-report-base.component';

@Component({
  selector: 'app-tx-rtt-report-base',
  templateUrl:
    './../../../hiv-care-lib/tx-rtt-report/tx-rtt-report-base/tx-rtt-report-base.component.html'
})
export class TxRttReportComponent
  extends TxRttReportBaseComponent
  implements OnInit {
  public enabledControls = 'locationControl,monthControl';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public txRttResourceService: TxRttResourceService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private location: Location
  ) {
    super(router, route, txRttResourceService);
  }

  public ngOnInit() {
    this.loadReportParamsFromUrl();
  }

  public generateReport() {
    if (this._month) {
      const { previousMonthLastDate, currentMonthEndDate } = this.getDates(
        this._month
      );
      this._sDate = previousMonthLastDate;
      this._eDate = currentMonthEndDate;
    }

    this.setSelectedLocation();
    this.storeParamsInUrl();

    if (Array.isArray(this.locationUuids) && this.locationUuids.length > 0) {
      this.params = {
        locationUuids: this.getSelectedLocations(this.locationUuids),
        sDate: this._sDate,
        eDate: this._eDate,
        month: this._month
      };
      super.generateReport();
      super.showDraftReportAlert(this._month);
    } else {
      this.errorMessage = 'Locations are required!';
    }
  }
  public getDates(currentEndDate) {
    // Convert the currentEndDate string to a Date object
    const currentDate = new Date(currentEndDate);

    // Get the current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate the previous month's last date
    const previousMonthLastDate = new Date(
      currentYear,
      currentMonth,
      0
    ).getDate();

    // Calculate the current month's end date
    const currentMonthEndDate = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

    // Format the dates as strings in the "YYYY-MM-DD" format
    const previousMonthLastDateString =
      currentYear +
      '-' +
      currentMonth.toString().padStart(2, '0') +
      '-' +
      previousMonthLastDate.toString().padStart(2, '0');
    const currentMonthEndDateString = currentEndDate;

    // Return the formatted dates
    return {
      previousMonthLastDate: previousMonthLastDateString,
      currentMonthEndDate: currentMonthEndDateString
    };
  }

  public storeParamsInUrl() {
    const state = {
      locationUuids: this.getSelectedLocations(this.locationUuids),
      sDate: this._sDate,
      eDate: this._eDate,
      month: this._month
    };
    const stateUrl = rison.encode(state);
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      state: stateUrl
    };

    this.location.replaceState(path.toString());
  }

  public loadReportParamsFromUrl() {
    const path = this.router.parseUrl(this.location.path());
    if (path.queryParams['state']) {
      const state = rison.decode(path.queryParams['state']);
      this.locationUuids = state.locations;
      this.sDate = state.sDate;
      this.eDate = state.eDate;
      this.month = state.month;
    }

    if (path.queryParams['state']) {
      this.generateReport();
    }
  }

  public setSelectedLocation() {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          this.locationUuids = data.locations;
        }
      });
  }

  private getSelectedLocations(locationUuids: Array<any>): string {
    return locationUuids.map((location) => location.value).join(',');
  }
}
