import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as rison from 'rison-node';

import { Moh731ReportBaseComponent } from '../../../hiv-care-lib/moh-731-report/moh-731-report-base.component';
import { Moh731ResourceService } from '../../../etl-api/moh-731-resource.service';

@Component({
  selector: 'moh-731-report',
  templateUrl:
    '../../../hiv-care-lib/moh-731-report/moh-731-report-base.component.html'
})
export class Moh731ReportComponent
  extends Moh731ReportBaseComponent
  implements OnInit {
  public data = [];
  public sectionsDef = [];

  constructor(
    public moh731Resource: Moh731ResourceService,
    public route: ActivatedRoute,
    private location: Location,
    public router: Router
  ) {
    super(moh731Resource, route, router);

    this.showIsAggregateControl = true;
    this.showLocationsControl = true;
  }

  public ngOnInit() {
    this.loadReportParamsFromUrl();
  }

  public generateReport() {
    this.storeReportParamsInUrl();

    if (Array.isArray(this.locationUuids) && this.locationUuids.length > 0) {
      super.generateReport();
    } else {
      this.errorMessage = 'Locations are required!';
    }
  }

  public storeReportParamsInUrl() {
    const state = {
      startDate: this.startDate.toUTCString(),
      endDate: this.endDate.toUTCString(),
      isLegacy: this.isLegacyReport,
      view: this.currentView,
      isAggregated: this.isAggregated,
      locations: this.locationUuids
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
      this.startDate = new Date(state.startDate);
      this.endDate = new Date(state.endDate);
      this.isLegacyReport = state.isLegacy;
      this.currentView = state.view;
      this.isAggregated = state.isAggregated;
      this.locationUuids = state.locations;
    }

    if (path.queryParams['state']) {
      this.generateReport();
    }
  }
}
