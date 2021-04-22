import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as rison from 'rison-node';
import * as Moment from 'moment';

import { IptReportService } from '../../../etl-api/ipt-report.service';
import { IptBaseReportComponent } from '../../../hiv-care-lib/ipt-report/ipt-report-base.component';
import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';

@Component({
  selector: 'ipt-base-report',
  templateUrl:
    './../../../hiv-care-lib/ipt-report/ipt-report-base.component.html'
})
export class IPTReportComponent
  extends IptBaseReportComponent
  implements OnInit {
  public enabledControls = 'monthControl,locationControl';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public iptReportService: IptReportService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private location: Location
  ) {
    super(route, router, iptReportService, location);
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
        endDate: Moment(this.month).endOf('month').format('YYYY-MM-DD'),
        displayTabularFilters: false
      };
      super.generateReport();
    } else {
      this.errorMessage = 'Locations are required!';
    }
  }
  public storeParamsInUrl() {
    const state = {
      locationUuids: this.getSelectedLocations(this.locationUuids),
      month: Moment(this.month).endOf('month').format('YYYY-MM-DD')
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
      this.month = state.month;
      this.locationUuids = state.locations;
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
