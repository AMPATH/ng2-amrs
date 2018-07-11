import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';
import { DataAnalyticsCdmProgramModule } from './cdm/data-analytics-cdm-program.module';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'hiv',
        loadChildren: './hiv/hiv-program.module#DataAnalyticsHivProgramModule'
      },
      {
        path: 'cdm',
        loadChildren: './cdm/data-analytics-cdm-program.module#DataAnalyticsCdmProgramModule'
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
