import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as rison from 'rison-node';
import * as Moment from 'moment';

import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';
import { PrepResourceService } from 'src/app/etl-api/prep-resource.service';
import { PrepReportBaseComponent } from './../../../hiv-care-lib/prep-report/prep-report-base/prep-report-base.component';
import { PlhivNcdReportBaseComponent } from 'src/app/hiv-care-lib/plhiv-ncd-report/plhiv-ncd-report-base/plhiv-ncd-report-base.component';
import { PlhivNcdReportService } from 'src/app/etl-api/plhiv-ncd-report.service';

@Component({
  selector: 'app-plhiv-ncd-report',
  templateUrl:
    './../../../hiv-care-lib/plhiv-ncd-report/plhiv-ncd-report-base/plhiv-ncd-report-base.component.html'
})
export class PlhivNcdReportComponent
  extends PlhivNcdReportBaseComponent
  implements OnInit {
  public enabledControls = 'monthControl,locationControl';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public plhivNcdResourceService: PlhivNcdReportService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private location: Location
  ) {
    super(router, route, plhivNcdResourceService);
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
        month: Moment(this._month).endOf('month').format('YYYY-MM-DD')
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
      month: Moment(this._month).endOf('month').format('YYYY-MM-DD')
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
