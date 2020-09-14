import { mergeMap } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { PatientStatusVisualizationResourceService } from '../../../etl-api/patient-status-change-visualization-resource.service';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PatientStatusChangeVisualizationComponent } from './patient-status-change-visualization.component';
import * as _ from 'lodash';
@Component({
  selector: 'patient-status-change-visualization-container',
  templateUrl: './patient-status-change-visualization.container.component.html',
  styleUrls: ['./patient-status-change-visualization.container.component.css']
})
export class PatientStatusChangeVisualizationContainerComponent
  implements OnInit, OnDestroy {
  public error: any;
  public results = {
    startIndex: 0,
    size: 13,
    result: [],
    indicatorDefinitions: []
  };
  public currentView = 'cumulativeAnalysis';
  public cumulativeAnalysisResults = this.results;
  public cumulativeAnalysis: any = {};
  public monthlyAnalysisResults = this.results;
  public monthlyAnalysis: any = {};
  public subs: Subscription[] = [];
  public cohortAnalysisResults = this.results;
  public cohortAnalysis: any = {};

  @ViewChild('cumulativeAnalysis')
  private cumulativeAnalysisComponent: PatientStatusChangeVisualizationComponent;
  @ViewChild('monthlyAnalysis')
  private monthlyAnalysisComponent: PatientStatusChangeVisualizationComponent;
  @ViewChild('cohortAnalysis')
  private cohortAnalysisComponent: PatientStatusChangeVisualizationComponent;

  constructor(
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private patientStatusResourceService: PatientStatusVisualizationResourceService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit() {
    this.route.params.forEach((params) => {
      if (params['view']) {
        switch (params['view']) {
          case 'cumulative':
            this.currentView = 'cumulativeAnalysis';
            break;
          case 'monthly':
            this.currentView = 'monthlyAnalysis';
            break;
          case 'cohort':
            this.currentView = 'cohortAnalysis';
            break;
          default:
            this.currentView = 'cumulativeAnalysis';
        }
      }
      this.clinicDashboardCacheService.setCurrentClinic(
        params['location_uuid']
      );
    });
  }

  public ngOnDestroy(): void {
    this.subs.forEach((element) => {
      element.unsubscribe();
    });
  }

  public handleTabChange(e) {
    const path = this.router.parseUrl(this.location.path());
    if (e.index === 0) {
      this.currentView = 'cumulativeAnalysis';
      this.router.navigate(['../cumulative'], {
        relativeTo: this.route,
        queryParams: {
          startDate: this.cumulativeAnalysis.startDate,
          endDate: this.cumulativeAnalysis.endDate,
          analysis: path.queryParams['analysis'] || 'active_return'
        }
      });
      this.cumulativeAnalysisComponent.renderChart();
    }
    if (e.index === 1) {
      this.currentView = 'monthlyAnalysis';
      this.router.navigate(['../monthly'], {
        relativeTo: this.route,
        queryParams: {
          startDate: this.monthlyAnalysis.startDate,
          endDate: this.monthlyAnalysis.endDate,
          analysis: path.queryParams['analysis'] || 'active_return'
        }
      });
      this.monthlyAnalysisComponent.renderChart();
    }
    if (e.index === 2) {
      this.currentView = 'cohortAnalysis';
      this.router.navigate(['../cohort'], {
        relativeTo: this.route,
        queryParams: {
          startDate: this.cohortAnalysis.startDate,
          endDate: this.cohortAnalysis.endDate,
          analysis: path.queryParams['analysis'] || 'active_return'
        }
      });
      this.cohortAnalysisComponent.renderChart();
    }
  }

  public loadCumulativeAnalysis(event) {
    const analysisType = 'cumulativeAnalysis';
    const sub = this.clinicDashboardCacheService
      .getCurrentClinic()
      .pipe(
        mergeMap((location: any) => {
          if (location && event.startDate) {
            const params: any = {};
            params['startDate'] = event.startDate.format('YYYY-MM-DD');
            params['endDate'] = event.endDate.format('YYYY-MM-DD');
            params['locationUuids'] = location;
            params['analysis'] = analysisType;
            this.triggerBusyIndicators(analysisType, true, false);
            this.cumulativeAnalysis = params;
            return this.patientStatusResourceService.getAggregates(params);
          }
        })
      )
      .subscribe(
        (result) => {
          this.triggerBusyIndicators(analysisType, false, false);
          this.cumulativeAnalysisResults = result;
        },
        (error) => {
          this.triggerBusyIndicators(analysisType, false, true);
        }
      );
    this.subs.push(sub);
  }

  public loadMonthlyAnalysis(event) {
    const analysisType = 'monthlyAnalysis';
    const sub = this.clinicDashboardCacheService
      .getCurrentClinic()
      .pipe(
        mergeMap((location: any) => {
          if (location && event.startDate) {
            const params: any = {};
            params['startDate'] = event.startDate.format('YYYY-MM-DD');
            params['endDate'] = event.endDate.format('YYYY-MM-DD');
            params['locationUuids'] = location;
            params['analysis'] = analysisType;
            this.monthlyAnalysis = params;
            this.triggerBusyIndicators(analysisType, true, false);
            return this.patientStatusResourceService.getAggregates(params);
          }
        })
      )
      .subscribe(
        (result) => {
          this.triggerBusyIndicators(analysisType, false, false);
          this.monthlyAnalysisResults = result;
        },
        (error) => {
          this.triggerBusyIndicators(analysisType, false, true);
        }
      );
    this.subs.push(sub);
  }

  public loadCohortAnalysis(event) {
    const analysisType = 'cohortAnalysis';
    const sub = this.clinicDashboardCacheService
      .getCurrentClinic()
      .pipe(
        mergeMap((location: any) => {
          if (location && event.startDate) {
            const params: any = {};
            params['startDate'] = event.startDate
              .endOf('month')
              .format('YYYY-MM-DD');
            params['endDate'] = event.endDate
              .endOf('month')
              .format('YYYY-MM-DD');
            params['locationUuids'] = location;
            params['analysis'] = analysisType;
            this.cohortAnalysis = params;
            this.triggerBusyIndicators(analysisType, true, false);
            return this.patientStatusResourceService.getAggregates(params);
          }
        })
      )
      .subscribe(
        (result) => {
          this.triggerBusyIndicators(analysisType, false, false);
          this.cohortAnalysisResults = result;
        },
        (error) => {
          this.triggerBusyIndicators(analysisType, false, true);
        }
      );
    this.subs.push(sub);
  }

  private triggerBusyIndicators(
    view,
    showBusyIndicator,
    hasError: boolean
  ): void {
    switch (view) {
      case 'cumulativeAnalysis':
        this.cumulativeAnalysisComponent.triggerBusyIndicators(
          1,
          showBusyIndicator,
          hasError
        );
        break;
      case 'monthlyAnalysis':
        this.monthlyAnalysisComponent.triggerBusyIndicators(
          2,
          showBusyIndicator,
          hasError
        );
        break;
      case 'cohortAnalysis':
        this.cohortAnalysisComponent.triggerBusyIndicators(
          1,
          showBusyIndicator,
          hasError
        );
        break;
      default:
        console.error('unknown view', view);
    }
  }
}
