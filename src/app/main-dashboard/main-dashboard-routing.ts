import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainDashboardComponent } from './main-dashboard.component';
import {
  UserDefaultPropertiesComponent
} from '../user-default-properties/user-default-properties.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UsefulLinksComponent } from '../useful-links/useful-links.component';
import {
  LabOrderSearchContainerComponent
} from '../lab-order-search/lab-order-search-container.component';
import { PatientDashboardModule } from '../patient-dashboard/patient-dashboard.module';
import { DataAnalyticsModule } from '../data-analytics-dashboard/data-analytics.module';
import { PatientListCohortModule } from '../patient-list-cohort/patient-list-cohort.module';
import { RetrospectiveContainerComponent
} from '../retrospective-data-entry/components/container/retrospective-container.component';
export function patientDashboardModule() {
  return PatientDashboardModule;
}
export function dataAnalyticsModule() {
  return DataAnalyticsModule;
}
export function patientListCohortModule() {
  return PatientListCohortModule;
}
export const dashboardRoutes: Routes = [
  {
    path: '',
    component: MainDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'patient-dashboard/patient-search' },
      {
        path: 'clinic-dashboard',
        loadChildren: '../clinic-dashboard#ClinicDashboardModule'
      },
      {
        path: 'patient-dashboard', loadChildren: '../patient-dashboard#PatientDashboardModule'
      },
      {
        path: 'provider-dashboard',  loadChildren: '../provider-dashboard#ProviderDashboardModule'
      },
      {
        path: 'data-analytics', loadChildren: dataAnalyticsModule
      },
      {
        path: 'user-default-properties',
        component: UserDefaultPropertiesComponent
      },
      {
        path: 'retrospective-data',
        component: RetrospectiveContainerComponent
      },
      {
        path: 'lab-order-search',
        component: LabOrderSearchContainerComponent
      },
      {
        path: 'useful-links',
        component: UsefulLinksComponent
      },
      {
        path: 'patient-list-cohort',
        loadChildren: patientListCohortModule
      }
    ]
  }

];

export const dashboardRouting: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);
