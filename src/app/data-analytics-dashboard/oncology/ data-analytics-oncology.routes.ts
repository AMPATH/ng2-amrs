import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OncologyReportsComponent } from './oncology-reports/oncology-reports.component';
import { DataAnalyticsDashboardGuard } from '../data-analytics-guard';
import { DataAnalyticsDashboardComponent } from '../data-analytics.component';
import {
  OncologyMonthlyIndicatorSummaryComponent
} from './oncology-reports/oncology-monthly-indicators/oncology-monthly-indicators.component';
import {
  OncologysummaryIndicatorsPatientListComponent
} from './oncology-reports/oncology-indicators-patient-list/oncology-indicators-patient-list.component';

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
            path: 'oncology-reports',
            children: [
              {
                path: '',
                component: OncologyReportsComponent
              },
              {
                path: 'breast-cancer-screening-numbers',
                component: OncologyMonthlyIndicatorSummaryComponent,
              },
              {
                path: 'cervical-cancer-screening-numbers',
                component: OncologyMonthlyIndicatorSummaryComponent,
              },
              {

                path: ':screening-program/patient-list',
                component: OncologysummaryIndicatorsPatientListComponent,

              },
            ]
          }
        ]
      }
    ]
  }
];

export const DataAnalyticsDashboardOncologyRouting: ModuleWithProviders =
  RouterModule.forChild(routes);
