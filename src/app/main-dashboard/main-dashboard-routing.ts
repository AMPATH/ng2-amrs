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
import { ClinicDashboardModule } from '../clinic-dashboard/clinic-dashboard.module';
import { PatientDashboardModule } from '../patient-dashboard/patient-dashboard.module';
import { DataAnalyticsModule } from '../data-analytics-dashboard/data-analytics.module';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: MainDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'clinic-dashboard',
        loadChildren: () => ClinicDashboardModule
      },
      {
        path: 'patient-dashboard', loadChildren: () => PatientDashboardModule
      },
      {
        path: 'data-analytics', loadChildren: () => DataAnalyticsModule
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
         loadChildren: () =>
           System.import('../patient-list-cohort/patient-list-cohort.module')
             .then(mod => mod.PatientListCohortModule)
       }
    ]
  }

];

export const dashboardRouting: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);
