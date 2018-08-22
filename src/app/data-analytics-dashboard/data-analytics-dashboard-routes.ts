import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'hiv', loadChildren: './hiv/hiv-program.module#DataAnalyticsHivProgramModule'
      },
      {
        path: 'oncology',
        loadChildren:
        './oncology/data-analytics-oncology-program.module#DataAnalyticsOncologyProgramModule'
      },
      {
        path: 'referral',
        loadChildren: './referral/referral-program.module#AnalyticsPatientReferralProgramModule'
      }
    ]
  }
];

export const dataAnalyticsDashboardRouting: ModuleWithProviders =
  RouterModule.forChild(routes);
