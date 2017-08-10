import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Moh731ReportBaseComponent }
  from '../../../hiv-care-lib/moh-731-report/moh-731-report-base.component';
import { Moh731ResourceService } from '../../../etl-api/moh-731-resource.service';
import { HivCareComparativeOverviewBaseComponent
} from '../../../hiv-care-lib/hiv-visualization/hiv-care-overview-base.component';
import { ClinicalSummaryVisualizationResourceService
} from '../../../etl-api/clinical-summary-visualization-resource.service';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';

@Component({
  selector: 'hiv-comparative-chart',
  templateUrl: '../../../hiv-care-lib/hiv-visualization/hiv-care-overview-base.component.html'
})

export class HivCareComparativeComponent extends HivCareComparativeOverviewBaseComponent
        implements OnInit {
  public data = [];
  public sectionsDef = [];

  constructor(public visualizationResourceService: ClinicalSummaryVisualizationResourceService,
              private route: ActivatedRoute, private location: Location,
              private router: Router) {
    super(visualizationResourceService);

  }

  ngOnInit() {
    this.route.parent.parent.parent.params.subscribe((params: any) => {
      this.locationUuids = [];
      if (params.location_uuid)
        this.locationUuids.push(params.location_uuid);
        this.generateReport();
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
    let path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      'startDate': this.startDate.toUTCString(),
      'endDate': this.endDate.toUTCString(),
    };

    this.location.replaceState(path.toString());
  }

}
