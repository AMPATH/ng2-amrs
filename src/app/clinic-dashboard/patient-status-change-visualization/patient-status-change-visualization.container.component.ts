import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  PatientStatusVisualizationResourceService
} from
  '../../etl-api/patient-status-change-visualization-resource.service';
import {
  ClinicDashboardCacheService
} from '../services/clinic-dashboard-cache.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  PatientStatusChangeVisualizationComponent
} from './patient-status-change-visualization.component';

@Component({
  selector: 'patient-status-change-visualization-container',
  templateUrl: './patient-status-change-visualization.container.component.html',
  styleUrls: ['./patient-status-change-visualization.container.component.css']
})

export class PatientStatusChangeVisualizationContainerComponent implements OnInit, OnDestroy {
  public results = {
    startIndex: 0,
    size: 13,
    result: []
  };
  @ViewChild('monthly')
  private monthlyPatientStatusComponent: PatientStatusChangeVisualizationComponent;
  @ViewChild('transition')
  private transitionalPatientStatusComponent: PatientStatusChangeVisualizationComponent;
  @ViewChild('cumulative')
  private cumulativePatientStatusComponent: PatientStatusChangeVisualizationComponent;
  private filterModel: any;
  private filterParams: any;
  private currentView: string = 'cumulative';
  private startDate = new Date();
  private endDate = new Date();
  private dataSub: Subscription = new Subscription();
  private error = false;
  private loading = false;
  private options: any = {
    date_range: true
  };

  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
              private patientStatusResourceService: PatientStatusVisualizationResourceService,
              private location: Location,
              private router: Router) {
    this.filterModel = this.filterModel ? this.filterModel : {};
    this.startDate = this.getStartDate();
  }

  ngOnInit() {
    let path = this.router.parseUrl(this.location.path());
    if (path.queryParams['view']) {
      this.currentView = path.queryParams['view'];
    }
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }

  public handleTabChange(e) {
    let path = this.router.parseUrl(this.location.path());
    if (e.index === 0) {
      this.currentView = 'cumulative';
      this.cumulativePatientStatusComponent.redrawChart();
    }
    if (e.index === 1) {
      this.currentView = 'monthly';
      this.monthlyPatientStatusComponent.redrawChart();
    }
    if (e.index === 2) {
      this.currentView = 'transition';
      this.transitionalPatientStatusComponent.redrawChart();
    }
    path.queryParams['view'] = this.currentView;
    this.location.replaceState(path.toString());
  }


  public filtersChanged(event) {

    let params = {};
    params['startDate'] = event.startDate.format('YYYY-MM-DD');
    params['endDate'] = event.endDate.format('YYYY-MM-DD');
    this.filterParams = params;
    this.loadData();
  }

  private getStartDate() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let c = new Date(year - 1, month, day);
    return c;
  }

  private loadData() {
    this.error = false;
    this.loading = true;
    this.dataSub = this.clinicDashboardCacheService.getCurrentClinic().flatMap((location) => {
      let params = Object.assign(this.filterParams, {locationUuids: location});
      this.loading = true;
      return this.patientStatusResourceService.getAggregates(params);
    }).subscribe((results) => {
      this.loading = false;
      this.results = results;
    }, (error) => {
      this.error = true;
      this.loading = false;
    });
  };
}
