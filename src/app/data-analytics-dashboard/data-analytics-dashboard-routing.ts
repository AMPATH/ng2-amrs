import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataAnalyticsDashboardComponent } from './data-analytics.component';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';
import { AdminDashboardClinicFlowComponent } from './hiv/clinic-flow/admin-dashboard-clinic-flow';
import {
  HivCareComparativeAnalyticsComponent
} from './hiv-data-visualization/hiv-overview-visualization';
import {
  VisualizationPatientListComponent
} from '../hiv-care-lib/hiv-visualization/visualization-patient-list.component';
const dataAnalyticsRoutes: Routes = [

  { path: 'data-analytics',
    redirectTo: 'data-analytics/admin-dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin-dashboard',
    component: DataAnalyticsDashboardComponent,
    children: [
      { path: '', component: DataAnalyticsDashboardComponent },
     /* {
        path: 'hiv-comparative-chart-analytics',
        children: [
          {
            path: '',
            component: HivCareComparativeAnalyticsComponent
          }

        ]

      },*/
      {
        path: 'hiv',
        children: [
          { path: '', component: DataAnalyticsDashboardComponent },
          {
            path: 'clinic-flow', component: AdminDashboardClinicFlowComponent
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

          }
        ]
      }
    ],
    canActivate: [
      DataAnalyticsDashboardGuard
    ]
  }
];
export const dataAnalyticsDashboardRouting: ModuleWithProviders = RouterModule
  .forChild(dataAnalyticsRoutes);
