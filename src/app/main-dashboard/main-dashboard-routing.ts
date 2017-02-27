import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainDashboardComponent } from './main-dashboard.component';
import {
  UserDefaultPropertiesComponent
} from '../user-default-properties/user-default-properties.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UsefulLinksComponent } from '../useful-links/useful-links.component';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: MainDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'clinic-dashboard',
        loadChildren: () =>
          System.import('../clinic-dashboard/clinic-dashboard.module')
            .then(mod => mod.ClinicDashboardModule)
      },
      {
        path: 'patient-dashboard', loadChildren: () =>
          System.import('../patient-dashboard/patient-dashboard.module')
            .then(mod => mod.PatientDashboardModule)
      },
      {
        path: 'data-analytics', loadChildren: () =>
          System.import('../data-analytics-dashboard/data-analytics.module')
            .then(mod => mod.DataAnalyticsModule)
      },
      {
        path: 'user-default-properties',
        component: UserDefaultPropertiesComponent
      },
      {
        path: 'useful-links',
        component: UsefulLinksComponent
      }
    ]
  }
];

export const dashboardRouting: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);
