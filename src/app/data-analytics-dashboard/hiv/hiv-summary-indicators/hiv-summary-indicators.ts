
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import {
  HivSummaryIndicatorBaseComponent
} from '../../../hiv-care-lib/hiv-summary-indicators/hiv-summary-report-base.component';
import { HivSummaryIndicatorsResourceService
} from '../../../etl-api/hiv-summary-indicators-resource.service';
import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';

@Component({
  selector: 'hiv-summary-indicator-report',
  templateUrl: '../../../hiv-care-lib/hiv-summary-indicators/hiv-summary-report-base.component.html'
})

export class HivSummaryIndicatorsComponent extends HivSummaryIndicatorBaseComponent
implements OnInit {
  public data = [];
  public sectionsDef = [];

  constructor(public hivSummaryIndicatorsResourceService: HivSummaryIndicatorsResourceService,
              public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
              private route: ActivatedRoute, private location: Location,
              private router: Router) {
    super(hivSummaryIndicatorsResourceService, dataAnalyticsDashboardService);

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
    this.dataAnalyticsDashboardService.getSelectedLocations().subscribe(
      (data)  => {
        if (data) {
          this.locationUuids = data.locations;
        }

      });
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
    if (path.queryParams['indicators']) {
      this.indicators = path.queryParams['indicators'];
      this.formatIndicatorsToSelectArray(this.indicators);
    }
    if (path.queryParams['gender']) {
      this.gender = (path.queryParams['gender'] as any);
      this.formatGenderToSelectArray(path.queryParams['gender']);
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
      'gender': (this.gender ? this.gender : 'F,M' as any),
      'startAge': (this.startAge as any),
      'endAge': (this.endAge as any),
      'view': this.currentView
    };

    this.location.replaceState(path.toString());
  }

  public formatIndicatorsToSelectArray(indicatorParam: string) {
    let arr = indicatorParam.split(',');
    _.each(arr, (indicator) => {
      let text = this.translateIndicator(indicator);
      let id = indicator;

      let data = {
        id: id,
        text: text
      };
      this.selectedIndicators.push(data);
    });
  }

  public translateIndicator(indicator: string) {
    return indicator.toLowerCase().split('_').map((word) => {
      return (word.charAt(0) + word.slice(1));
    }).join(' ');
  }

  public formatGenderToSelectArray(genderParam: string) {
    if (genderParam.length > 1) {
      let arr = genderParam.split(',');
      _.each(arr, (gender) => {
        let id = gender;
        let text = gender === 'M' ? 'Male' : 'Female';
        let data = {
          id: id,
          text: text
        };
        this.selectedGender.push(data);
      });
    } else {
      let data = {
        id: genderParam,
        text: genderParam === 'M' ? 'Male' : 'Female'
      };
      this.selectedGender.push(data);
    }
  }
}
