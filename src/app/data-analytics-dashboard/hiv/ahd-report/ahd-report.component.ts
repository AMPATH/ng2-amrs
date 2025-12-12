import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as rison from 'rison-node';
import * as Moment from 'moment';

import { AhdReportBaseComponent } from 'src/app/hiv-care-lib/ahd-monthly-report/ahd-report-base/ahd-report-base.component';
import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';
import { AhdResourceService } from 'src/app/etl-api/ahd-resource.service';

@Component({
  selector: 'ahd-report',
  templateUrl:
    '../../../hiv-care-lib/ahd-monthly-report/ahd-report-base/ahd-report-base.component.html'
})
export class AhdReportComponent
  extends AhdReportBaseComponent
  implements OnInit {
  public enabledControls = 'locationControl,monthControl';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public ahdReport: AhdResourceService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private location: Location
  ) {
    super(router, route, ahdReport);
  }

  public ngOnInit() {
    this.loadReportParamsFromUrl();
  }

  public generateReport() {
    this.setSelectedLocation();
    this.setIsAggregated();
    this.storeParamsInUrl();

    if (Array.isArray(this.locationUuids) && this.locationUuids.length > 0) {
      this.params = {
        locationUuids: this.getSelectedLocations(this.locationUuids),
        month: this._month,
        isAggregated: this.getIsAggregated()
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
      month: this._month,
      isAggregated: this.getIsAggregated()
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
      this.month = state.month;
      this.isAggregated = state.isAggregated;
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

  public setIsAggregated() {
    this.dataAnalyticsDashboardService
      .getIsAggregated()
      .pipe()
      .subscribe((data) => {
        if (data) {
          this.isAggregated = data.isAggregated;
        }
      });
  }

  private getIsAggregated() {
    return this.isAggregated;
  }
}
