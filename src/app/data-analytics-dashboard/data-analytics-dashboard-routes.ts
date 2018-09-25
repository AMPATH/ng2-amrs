import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';
import { DataAnalyticsHivModule } from './hiv/data-analytics-hiv.module';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'hiv', loadChildren: () => DataAnalyticsHivModule
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
