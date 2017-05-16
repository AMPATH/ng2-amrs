
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  HivSummaryIndicatorBaseComponent
} from '../../../hiv-care-lib/hiv-summary-indicators/hiv-summary-report-base.component';
import {
  HivSummaryIndicatorsResourceService
} from '../../../etl-api/hiv-summary-indicators-resource.service';

@Component({
  selector: 'hiv-summary-indicator-report',
  templateUrl: '../../../hiv-care-lib/hiv-summary-indicators/hiv-summary-report-base.component.html'
})

export class HivSummaryIndicatorComponent extends HivSummaryIndicatorBaseComponent
              implements OnInit {
  public data = [];
  public sectionsDef = [];

  constructor(public hivSummaryIndicatorsResourceService: HivSummaryIndicatorsResourceService,
              private route: ActivatedRoute, private location: Location,
              private router: Router) {
    super(hivSummaryIndicatorsResourceService);

  }

  ngOnInit() {

    this.route.parent.parent.url.subscribe((url) => {
      this.locationUuids = [];
      this.locationUuids.push(url[0].path);
    });
    this.loadReportParamsFromUrl();
  }

  public generateReport() {
    this.storeReportParamsInUrl();
    super.generateReport();
  }

  public loadReportParamsFromUrl() {
    let path = this.router.parseUrl(this.location.path());
    let pathHasHistoricalValues = path.queryParams['startDate'] &&
      path.queryParams['endDate'] ;

    if (path.queryParams['startDate']) {
      this.startDate = new Date(path.queryParams['startDate']);
    }

    if (path.queryParams['endDate']) {
      this.endDate = new Date(path.queryParams['endDate']);
    }
    if (path.queryParams['indicators']) {
      this.indicators = path.queryParams['indicators'];
    }
    if (path.queryParams['gender']) {
      this.gender = (path.queryParams['gender'] as any);
    }
    if (path.queryParams['startAge']) {
      this.startAge = (path.queryParams['startAge'] as any);
    }
    if (path.queryParams['endAge']) {
      this.endAge = (path.queryParams['endAge'] as any);
    }
    if (path.queryParams['view']) {
      this.currentView = path.queryParams['view'];
    }
    if (pathHasHistoricalValues) {
      this.generateReport();
    }
  }

  public storeReportParamsInUrl() {
    let path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      'endDate': this.endDate.toUTCString(),
      'startDate': this.startDate.toUTCString(),
      'indicators': this.indicators,
      'gender': (this.gender as any),
      'startAge': (this.startAge as any),
      'endAge': (this.endAge as any),
      'view': this.currentView
    };

    this.location.replaceState(path.toString());
  }

}
