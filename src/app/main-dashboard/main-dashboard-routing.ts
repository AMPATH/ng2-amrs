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
// import { ClinicDashboardModule } from '../clinic-dashboard/clinic-dashboard.module';
import { PatientDashboardModule } from '../patient-dashboard/patient-dashboard.module';
import { DataAnalyticsModule } from '../data-analytics-dashboard/data-analytics.module';
import { PatientListCohortModule } from '../patient-list-cohort/patient-list-cohort.module';
import { ProviderDashboardComponent } from '../provider-dashboard/provider-dashboard.component';
// export function clinicDashboardModule() {
//   return ClinicDashboardModule;
// }
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
        path: 'data-analytics', loadChildren: dataAnalyticsModule
      },
       {
        path: 'provider-dashboard', component: ProviderDashboardComponent
      },
      {
        path: 'user-default-properties',
        component: UserDefaultPropertiesComponent
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
