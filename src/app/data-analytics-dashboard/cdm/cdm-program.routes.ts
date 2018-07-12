import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataAnalyticsDashboardComponent } from '../data-analytics.component';
import { DataAnalyticsDashboardGuard } from '../data-analytics-guard';
import { CdmSummaryIndicatorsComponent } from
'./cdm-summary-indicators/cdm-summary-indicators.component';
import { CdmSummaryMonthlyIndicatorsComponent }
 from './cdm-summary-monthly-indicators/cdm-summary-monthly-indicators.component';
import { CdmsummaryIndicatorsPatientListComponent } from
 './cdm-summary-indicators-patient-list/cdm-summary-indicators-patient-list.component';
const routes: Routes = [
  {
    path: '', component: CdmSummaryIndicatorsComponent,
    children: [
      {
        path: '', component: CdmSummaryIndicatorsComponent,
        canActivate: [
          DataAnalyticsDashboardGuard
        ],
        canDeactivate: [
          DataAnalyticsDashboardGuard
        ],
        children: [
          {
            path: 'cdm-summary-monthly-indicator-report',
            children: [
              {
                path: '',
                component: CdmSummaryMonthlyIndicatorsComponent
              },
              {
                path: 'patient-list/:indicator/:period/:gender/:age/:locationUuids',
                component: CdmsummaryIndicatorsPatientListComponent,
              }
            ]
          }
        ]
      }
    ]
  }
];

export const dataAnalyticsDashboardCdmRouting: ModuleWithProviders =
  RouterModule.forChild(routes);
