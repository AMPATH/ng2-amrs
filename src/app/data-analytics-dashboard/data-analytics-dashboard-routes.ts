import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'hiv', loadChildren: './hiv/hiv-program.module#DataAnalyticsHivProgramModule'
      }
    ]
  }
];

export const dataAnalyticsDashboardRouting: ModuleWithProviders =
  RouterModule.forChild(routes);
