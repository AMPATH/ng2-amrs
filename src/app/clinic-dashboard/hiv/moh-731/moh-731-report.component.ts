import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Moh731ReportBaseComponent } from '../../../hiv-care-lib/moh-731-report/moh-731-report-base.component';
import { Moh731ResourceService } from '../../../etl-api/moh-731-resource.service';

@Component({
  selector: 'moh-731-report',
  templateUrl:
    '../../../hiv-care-lib/moh-731-report/moh-731-report-base.component.html'
})
export class Moh731ReportComponent
  extends Moh731ReportBaseComponent
  implements OnInit
{
  public data = [];
  public sectionsDef = [];

  constructor(
    public moh731Resource: Moh731ResourceService,
    public route: ActivatedRoute,
    private location: Location,
    public router: Router
  ) {
    super(moh731Resource, route, router);
  }

  public ngOnInit() {
    this.route.parent.parent.url.subscribe((url) => {
      const data = {};
      data['value'] = url[0].path;
      this.locationUuids = [];
      this.locationUuids.push(data as any);
    });
    this.loadReportParamsFromUrl();
  }

  public generateReport() {
    this.storeReportParamsInUrl();
    super.generateReport();
  }

  public loadReportParamsFromUrl() {
    const path = this.router.parseUrl(this.location.path());
    const pathHasHistoricalValues =
      path.queryParams['startDate'] && path.queryParams['endDate'];

    if (path.queryParams['startDate']) {
      this.startDate = new Date(path.queryParams['startDate']);
    }

    if (path.queryParams['endDate']) {
      this.endDate = new Date(path.queryParams['endDate']);
    }

    if (path.queryParams['view']) {
      this.currentView = path.queryParams['view'];
    }

    if (path.queryParams['isLegacy']) {
      this.isLegacyReport =
        path.queryParams['isLegacy'] === 'true' ? true : false;
    }

    if (pathHasHistoricalValues) {
      this.generateReport();
    }
  }

  public storeReportParamsInUrl() {
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      startDate: this.startDate.toUTCString(),
      endDate: this.endDate.toUTCString(),
      isLegacy: this.isLegacyReport ? 'true' : 'false',
      view: this.currentView
    };

    this.location.replaceState(path.toString());
  }
}
