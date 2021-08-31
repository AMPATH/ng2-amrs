import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OncologyReportsComponent } from './oncology-reports/oncology-reports.component';
import { OncologySummaryIndicatorsComponent } from './oncology-reports/oncology-summary-indicators/oncology-summary-indicators.component';
import { OncologySummaryIndicatorsPatientListComponent } from './oncology-reports/oncology-indicators-patient-list/oncology-indicators-patient-list.component';
import { AdminDashboardClinicFlowComponent } from '../hiv/clinic-flow/admin-dashboard-clinic-flow';
import { DataEntryStatisticsComponent } from '../../data-entry-statistics/data-entry-statistics.component';
import { DataEntryStatisticsPatientListComponent } from '../../data-entry-statistics/data-entry-statistics-patient-list.component';
import { PatientsProgramEnrollmentComponent } from '../../patients-program-enrollment/patients-program-enrollment.component';
import { ProgramEnrollmentPatientListComponent } from '../../patients-program-enrollment/program-enrollent-patient-list.component';
import { ChangeDepartmentComponent } from '../change-department/change-department.component';
import { MOH412OncologyDataAnalyticsComponent } from './oncology-reports/moh-412-report/moh-412-data-analytics.component';
import { MOH412OncologyDataAnalyticsPatientListComponent } from './oncology-reports/moh-412-report/moh-412-data-analytics-patient-list.component';
const routes: Routes = [
  {
    path: 'oncology-reports',
    children: [
      {
        path: '',
        component: OncologyReportsComponent
      },
      {
        path: 'breast-cancer-screening-numbers',
        component: OncologySummaryIndicatorsComponent
      },
      {
        path: 'cervical-cancer-screening-numbers',
        component: OncologySummaryIndicatorsComponent
      },
      {
        path: 'moh-412-report',
        component: MOH412OncologyDataAnalyticsComponent
      },
      {
        path: 'moh-412-report/patient-list',
        component: MOH412OncologyDataAnalyticsPatientListComponent
      },
      {
        path: ':screening-program/patient-list',
        component: OncologySummaryIndicatorsPatientListComponent
      },
      {
        path: 'combined-breast-cervical-cancer-screening-numbers',
        component: OncologySummaryIndicatorsComponent
      },
      {
        path: 'lung-cancer-treatment-numbers',
        component: OncologySummaryIndicatorsComponent
      },
      {
        path: 'lung-cancer-screening-numbers',
        component: OncologySummaryIndicatorsComponent
      }
    ]
  },
  {
    path: 'clinic-flow',
    component: AdminDashboardClinicFlowComponent
  },
  {
    path: 'program-enrollment',
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
    path: 'select-department',
    component: ChangeDepartmentComponent
  }
];

export const DataAnalyticsDashboardOncologyRouting: ModuleWithProviders = RouterModule.forChild(
  routes
);
