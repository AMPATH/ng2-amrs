import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as rison from 'rison-node';
import * as Moment from 'moment';

import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';
import { TxMlResourceService } from 'src/app/etl-api/tx-ml-resource.service';
import { TxMlReportBaseComponent } from 'src/app/hiv-care-lib/tx-ml-report/tx-ml-report-base/tx-ml-report-base.component';

@Component({
  selector: 'app-tx-ml-report-base',
  templateUrl:
    './../../../hiv-care-lib/tx-ml-report/tx-ml-report-base/tx-ml-report-base.component.html'
})
export class TxMlReportComponent
  extends TxMlReportBaseComponent
  implements OnInit {
  public enabledControls = 'quarterlyControl,locationControl';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public txMlResourceService: TxMlResourceService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private location: Location
  ) {
    super(router, route, txMlResourceService);
  }

  public ngOnInit() {
    this.loadReportParamsFromUrl();
  }

  public generateReport() {
    if (this._year) {
      const { lowerDate, upperDate } = this.getQuarterDates(
        this._year,
        this._quarter
      );
      this._sDate = lowerDate;
      this._eDate = upperDate;
    }

    this.setSelectedLocation();
    this.storeParamsInUrl();

    if (Array.isArray(this.locationUuids) && this.locationUuids.length > 0) {
      this.params = {
        locationUuids: this.getSelectedLocations(this.locationUuids),
        sDate: this._sDate,
        eDate: this._eDate
      };
      super.generateReport();
      super.showDraftReportAlert(this._month);
    } else {
      this.errorMessage = 'Locations are required!';
    }
  }

  public storeParamsInUrl() {
    const state = {
      locationUuids: this.getSelectedLocations(this.locationUuids),
      sDate: this._sDate,
      eDate: this._eDate
    };
    const stateUrl = rison.encode(state);
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      state: stateUrl
    };

    this.location.replaceState(path.toString());
  }

  public getQuarterDates(year, quarter) {
    const quarterNumber = parseInt(quarter.substring(1), 10) - 1;
    const quarters = [
      { start: `${parseInt(year, 10) - 1}-12-31`, end: `${year}-03-31` },
      { start: `${year}-03-31`, end: `${year}-06-30` },
      { start: `${year}-06-30`, end: `${year}-09-30` },
      { start: `${year}-09-30`, end: `${year}-12-31` }
    ];

    return {
      lowerDate: quarters[quarterNumber].start,
      upperDate: quarters[quarterNumber].end
    };
  }

  public loadReportParamsFromUrl() {
    const path = this.router.parseUrl(this.location.path());
    if (path.queryParams['state']) {
      const state = rison.decode(path.queryParams['state']);
      this.sDate = state.sDAte;
      this.eDate = state.eDate;
      this.locationUuids = state.locations;
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
