import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as rison from 'rison-node';
import * as Moment from 'moment';

import { DataAnalyticsDashboardService } from '../../../services/data-analytics-dashboard.services';
import { TxNewResourceService } from 'src/app/etl-api/tx-new-resource.service';
import { TxNewReportBaseComponent } from 'src/app/hiv-care-lib/tx-new-report/tx-new-report-base/tx-new-report-base.component';

@Component({
  selector: 'app-tx-new-report-base',
  templateUrl:
    './../../../../hiv-care-lib/tx-new-report/tx-new-report-base/tx-new-report-base.component.html'
})
export class TxNewReportComponent
  extends TxNewReportBaseComponent
  implements OnInit {
  public enabledControls = 'locationControl,monthControl';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public txNewResourceService: TxNewResourceService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private location: Location
  ) {
    super(router, route, txNewResourceService);
  }

  public ngOnInit() {
    this.loadReportParamsFromUrl();
  }

  public generateReport() {
    this.setSelectedLocation();
    this.storeParamsInUrl();

    if (Array.isArray(this.locationUuids) && this.locationUuids.length > 0) {
      this.params = {
        locationUuids: this.getSelectedLocations(this.locationUuids),
        month: this._month
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
