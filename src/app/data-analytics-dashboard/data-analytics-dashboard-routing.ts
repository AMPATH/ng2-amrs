import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataAnalyticsDashboardComponent } from './data-analytics.component';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';
import { AdminDashboardClinicFlowComponent } from './hiv/clinic-flow/admin-dashboard-clinic-flow';
const dataAnalyticsRoutes: Routes = [

  { path: 'data-analytics',
    redirectTo: 'data-analytics/admin-dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin-dashboard',
    children: [
      { path: '', component: DataAnalyticsDashboardComponent },
      {
        path: 'clinical-visualization',
        component: DataAnalyticsDashboardComponent
      },
      {
        path: 'hiv',
        children: [
          { path: '', component: DataAnalyticsDashboardComponent },
          {
            path: 'clinic-flow', component: AdminDashboardClinicFlowComponent
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
