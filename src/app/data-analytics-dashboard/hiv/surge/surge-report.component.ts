import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as rison from 'rison-node';
import * as Moment from 'moment';

import { SurgeReportBaseComponent } from 'src/app/hiv-care-lib/surge-report/surge-report-base.component';
import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';



@Component({
  selector: 'surge-report',
  templateUrl: '../../../hiv-care-lib/surge-report/surge-report-base.component.html',
})
export class SurgeReportComponent extends SurgeReportBaseComponent implements OnInit {

  public enabledControls = 'weekControl,locationControl';

  constructor(
    public router: Router, public route: ActivatedRoute, public surgeReport: SurgeResourceService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService, private location: Location) {
    super(router, route, surgeReport);
  }

  ngOnInit() {
    this.loadParametersFromUrl();
  }

  public generateReport() {
    this.storeParamsInUrl();
    super.generateReport();
  }

  public storeParamsInUrl() {
    this.setSelectedLocation();
    let state = {};
    this.displayTabluarFilters = true;
    switch (this.currentView) {
      case 'daily':
          state = {
          '_date': Moment(this.startDate).format('YYYY-MM-DD'),
          'locationUuids': this.getSelectedLocations(this.locationUuids),
          'displayTabluarFilters': this.displayTabluarFilters,
          'currentView': this.currentView,
          'reportName': this.reportName
          };
        break;
      case 'weekly':
         state = {
          'year_week': this.yearWeek,
          'locationUuids': this.getSelectedLocations(this.locationUuids),
          'displayTabluarFilters': this.displayTabluarFilters,
          'currentView': this.currentView,
          'reportName': this.reportName
        };
        break;
    }

    const stateUrl = rison.encode(state);
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      'state': stateUrl
    };

    this.params = state;
    this.location.replaceState(path.toString());
  }

  public loadParametersFromUrl() {
    const path = this.router.parseUrl(this.location.path());

    if (path.queryParams['state']) {
      const state = rison.decode(path.queryParams['state']);
      switch (state.currentView) {
        case 'daily':
          this.currentView = 'daily';
          this.startDate = Moment(state._date).format('MM-DD-YYYY');
          this.generateReport();
          break;
        case 'weekly':
          this.currentView = 'weekly';
          this.enabledControls = 'weekControl,locationControl';
          this.yearWeek = state.year_week;
          this.generateReport();
          break;
      }
    }

  }

  public setSelectedLocation() {
    this.dataAnalyticsDashboardService.getSelectedLocations().pipe(take(1)).subscribe(
      (data) => {
        if (data) {
          this.locationUuids = data.locations;
        }
      });
  }

  private getSelectedLocations(locationUuids: Array<any>): string {
    return locationUuids.map(location => location.value).join(',');
  }

  public onTabChanged(val) {
    if (this.currentView === 'daily') {
      this.currentView = 'weekly';
      this.enabledControls = 'weekControl,locationControl';
      this.surgeReportSummaryData = [];
      this.displayTabluarFilters = false;
    } else {
      this.enabledControls = 'dayControl,locationControl';
      this.currentView = 'daily';
      this.surgeReportSummaryData = [];
      this.displayTabluarFilters = false;
    }
  }
}
