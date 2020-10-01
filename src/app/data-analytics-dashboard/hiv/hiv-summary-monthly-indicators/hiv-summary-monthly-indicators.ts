import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';
import { HivMonthlySummaryIndicatorBaseComponent } from '../../../hiv-care-lib/hiv-monthly-summary-indicators/hiv-monthly-summary-report-base';
import { HivMonthlySummaryIndicatorsResourceService } from '../../../etl-api/hiv-monthly-summary-indicators-resource.service';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';

@Component({
  selector: 'hiv-summary-monthly-indicator-report',
  templateUrl:
    '../../../hiv-care-lib/hiv-monthly-summary-indicators/hiv-summary-report-base.html'
})
export class HivSummaryMonthlyIndicatorsComponent
  extends HivMonthlySummaryIndicatorBaseComponent
  implements OnInit {
  public data = [];
  public sectionsDef = [];

  constructor(
    public hivIndicatorsResourceService: HivMonthlySummaryIndicatorsResourceService,
    public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    protected appFeatureAnalytics: AppFeatureAnalytics,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    super(
      hivIndicatorsResourceService,
      dataAnalyticsDashboardService,
      appFeatureAnalytics
    );
  }

  public ngOnInit() {
    this.route.parent.parent.parent.params.subscribe((params: any) => {
      this.locationUuids = [];
      if (params.location_uuid) {
        this.locationUuids.push(params.location_uuid);
      }
    });
    this.loadReportParamsFromUrl();
    this.getLocationsSelected();
  }

  public generateReport() {
    this.getLocationsSelected();
    this.storeReportParamsInUrl();
    super.generateReport();
  }
  public getLocationsSelected() {
    this.dataAnalyticsDashboardService
      .getSelectedMonthlyIndicatorLocations()
      .subscribe((data) => {
        if (data) {
          this.locationUuids = data.locations;
        }
      });
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
    if (path.queryParams['indicators']) {
      this.indicators = path.queryParams['indicators'];
      this.formatIndicatorsToSelectArray(this.indicators);
    }
    if (path.queryParams['gender']) {
      this.gender = path.queryParams['gender'] as any;
      this.formatGenderToSelectArray(this.gender);
    }
    if (path.queryParams['startAge']) {
      this.startAge = path.queryParams['startAge'] as any;
    }
    if (path.queryParams['endAge']) {
      this.endAge = path.queryParams['endAge'] as any;
    }
    if (path.queryParams['view']) {
      this.currentView = path.queryParams['view'];
    }
    if (pathHasHistoricalValues) {
      this.generateReport();
    }
  }

  public storeReportParamsInUrl() {
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      endDate: this.endDate.toUTCString(),
      startDate: this.startDate.toUTCString(),
      indicators: this.indicators,
      gender: this.gender === undefined ? '' : this.gender,
      startAge: this.startAge as any,
      endAge: this.endAge as any,
      view: this.currentView
    };

    this.location.replaceState(path.toString());
  }

  public formatIndicatorsToSelectArray(indicatorParam: string) {
    const arr = indicatorParam.split(',');
    _.each(arr, (indicator) => {
      const text = this.translateIndicator(indicator);
      const id = indicator;

      const data = {
        value: id,
        label: text
      };
      this.selectedIndicators.push(data);
    });
  }

  public translateIndicator(indicator: string) {
    return indicator
      .toLowerCase()
      .split('_')
      .map((word) => {
        return word.charAt(0) + word.slice(1);
      })
      .join(' ');
  }

  public formatGenderToSelectArray(genderParam: string) {
    const arr = genderParam.split(',');
    _.each(arr, (indicator) => {
      const text = indicator;
      const id = indicator;

      const data = {
        value: id, // indicator
        label: text
      };
      this.selectedGender.push(data);
    });
  }
}
