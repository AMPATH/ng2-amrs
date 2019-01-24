
import {take} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { HivCareComparativeOverviewBaseComponent
} from '../../../hiv-care-lib/hiv-visualization/hiv-care-overview-base.component';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../../etl-api/clinical-summary-visualization-resource.service';
import {
  DataAnalyticsDashboardService
} from '../../services/data-analytics-dashboard.services';
@Component({
  selector: 'hiv-comparative-chart-analytics',
  templateUrl: '../../../hiv-care-lib/hiv-visualization/hiv-care-overview-base.component.html'
})

export class HivCareComparativeAnalyticsComponent extends HivCareComparativeOverviewBaseComponent
implements OnInit {
  public data = [];
  public sectionsDef = [];

  constructor(public visualizationResourceService: ClinicalSummaryVisualizationResourceService,
              private route: ActivatedRoute, private location: Location,
              private router: Router,
              public dataAnalyticsDashboardService: DataAnalyticsDashboardService) {
    super(visualizationResourceService, dataAnalyticsDashboardService);

  }

  public ngOnInit() {
    this.locationUuids = [];
    this.loadReportParamsFromUrl();
  }

  public generateReport() {
    this.getLocationsSelected();
    this.storeReportParamsInUrl();
    super.generateReport();
  }

  public loadReportParamsFromUrl() {
    const path = this.router.parseUrl(this.location.path());
    const pathHasHistoricalValues = path.queryParams['startDate'] &&
      path.queryParams['endDate'];

    if (path.queryParams['startDate']) {
      this.startDate = new Date(path.queryParams['startDate']);
    }

    if (path.queryParams['endDate']) {
      this.endDate = new Date(path.queryParams['endDate']);
    }

    if (pathHasHistoricalValues) {
      this.generateReport();
    }
  }
  public storeReportParamsInUrl() {
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      'startDate': this.startDate.toUTCString(),
      'endDate': this.endDate.toUTCString(),
    };

    this.location.replaceState(path.toString());
  }
  public getLocationsSelected() {
    this.dataAnalyticsDashboardService.getSelectedLocations().pipe(take(1)).subscribe(
        (data)  => {
          if (data) {
            this.locationUuids = data.locations;
          }

        });
  }

}
