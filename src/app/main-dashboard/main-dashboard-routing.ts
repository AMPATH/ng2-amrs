import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainDashboardComponent } from './main-dashboard.component';
import {
  UserDefaultPropertiesComponent
} from '../user-default-properties/user-default-properties.component';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: MainDashboardComponent,
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
        path: 'user-default-properties',
        component: UserDefaultPropertiesComponent
      }
    ]
  }
];

export const dashboardRouting: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);
