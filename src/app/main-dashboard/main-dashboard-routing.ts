import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainDashboardComponent } from './main-dashboard.component';
import { ClinicDashboardComponent } from '../clinic-dashboard/clinic-dashboard.component';
import { PatientDashboardComponent } from '../patient-dashboard/patient-dashboard.component';

const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'patient-dashboard', pathMatch: 'full' },
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
      }
    ]
  }
];
export const dashboardRouting: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);
