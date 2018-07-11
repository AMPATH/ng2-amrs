
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HivSummaryIndicatorComponent }
from './hiv-summary-indicators/hiv-summary-indicator.component';
import { HivSummaryIndicatorsPatientListComponent
} from '../../hiv-care-lib/hiv-summary-indicators/patient-list.component';
import { HivCareComparativeComponent
} from './hiv-visualization/hiv-care-overview.component';
import {
  VisualizationPatientListComponent
} from '../../hiv-care-lib/hiv-visualization/visualization-patient-list.component';
import { AdminDashboardClinicFlowComponent
} from './clinic-flow/admin-dashboard-clinic-flow';
import { HivCareComparativeAnalyticsComponent }
from './hiv-data-visualization/hiv-overview-visualization';
import { HivSummaryIndicatorsComponent
} from './hiv-summary-indicators/hiv-summary-indicators';
import { DataAnalyticsDashboardComponent } from '../data-analytics.component';
import { DataAnalyticsDashboardGuard } from '../data-analytics-guard';
import {
  HivSummaryMonthlyIndicatorsComponent
} from './hiv-summary-monthly-indicators/hiv-summary-monthly-indicators';
import {
  HivMonthlySummaryIndicatorsPatientListComponent
} from '../../hiv-care-lib/hiv-monthly-summary-indicators/patient-list.component';
import { PatientsProgramEnrollmentComponent } from
'../../patients-program-enrollment/patients-program-enrollment.component';
import { ProgramEnrollmentPatientListComponent }
from './../../patients-program-enrollment/program-enrollent-patient-list.component';
import { DataEntryStatisticsComponent }
from './../../data-entry-statistics/data-entry-statistics.component';
import { DataEntryStatisticsPatientListComponent } from
'./../../data-entry-statistics/data-entry-statistics-patient-list.component';
import {
  Moh731ReportComponent
} from './moh-731/moh-731-report.component';

import { Moh731PatientListComponent } from
'./../../hiv-care-lib/moh-731-report/moh-731-patientlist.component';

import { CdmSummaryIndicatorsComponent } from
'./../cdm/cdm-summary-indicators/cdm-summary-indicators.component';
import { CdmSummaryMonthlyIndicatorsComponent }
 from './../cdm/cdm-summary-monthly-indicators/cdm-summary-monthly-indicators.component';
import { CdmsummaryIndicatorsPatientListComponent } from
 './../cdm/cdm-summary-indicators-patient-list/cdm-summary-indicators-patient-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', component: DataAnalyticsDashboardComponent,
        canActivate: [
          DataAnalyticsDashboardGuard
        ],
        canDeactivate: [
          DataAnalyticsDashboardGuard
        ],
        children: [
          {
            path: '', redirectTo: 'hiv-comparative-chart-analytics', pathMatch: 'full'
          },
          {
            path: 'clinic-flow', component: AdminDashboardClinicFlowComponent
          },
          { path: 'program-enrollment',
            children: [
              {
                path: '',
                component: PatientsProgramEnrollmentComponent
              },
              {
                path: 'patient-list',
                component: ProgramEnrollmentPatientListComponent
              }
            ]
          },
          {
            path: 'hiv-comparative-chart-analytics',
            children: [
              {
                path: '',
                component: HivCareComparativeAnalyticsComponent
              },
              {
                path: 'patient-list/:report/:indicator/:period',
                component: VisualizationPatientListComponent
              }
            ]
          },
          {
            path: 'hiv-summary-indicator-report',
            children: [
              {
                path: '',
                component: HivSummaryIndicatorsComponent
              },
              {
                path: 'patient-list/:indicator/:period/:gender/:age/:locationUuids',
                component: HivSummaryIndicatorsPatientListComponent,
              }
            ]
          },
          {
            path: 'moh-731-report',
            children: [
              {
                path: '',
                component: Moh731ReportComponent
              },
              {
                path: 'patient-list',
                component: Moh731PatientListComponent
              }
            ]
          },
          {
            path: 'hiv-summary-monthly-indicator-report',
            children: [
              {
                path: '',
                component: HivSummaryMonthlyIndicatorsComponent
              },
              {
                path: 'patient-list/:indicator/:period/:gender/:age/:locationUuids',
                component: HivMonthlySummaryIndicatorsPatientListComponent,
              }
            ]
          },
          {
            path: 'data-entry-statistics',
            children: [
              {
                path: '',
                component: DataEntryStatisticsComponent
              },
              {
                path: 'patient-list',
                component: DataEntryStatisticsPatientListComponent

              }
            ]
          },
          {
            path: 'cdm-summary-indicator-report',
            children: [
              {
                path: '',
                component:  CdmSummaryIndicatorsComponent
              },
              {
                path: 'patient-list/:indicator/:period/:gender/:age/:locationUuids',
                component: CdmsummaryIndicatorsPatientListComponent,
              }
            ]
          },
          {
            path: 'cdm-summary-monthly-indicator-report',
            children: [
              {
                path: '',
                component: CdmSummaryMonthlyIndicatorsComponent
              },
              {
                path: 'patient-list',
                component: CdmsummaryIndicatorsPatientListComponent,
              }
            ]
          }
          ,
        ]
      }
    ]
  }
];

export const dataAnalyticsDashboardHivRouting: ModuleWithProviders =
  RouterModule.forChild(routes);
