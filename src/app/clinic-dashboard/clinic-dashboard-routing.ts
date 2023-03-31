import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';

const clinicDashboardRoutes: Routes = [
  {
    path: '',
    component: ClinicDashboardComponent,
    canActivate: [ClinicDashboardGuard]
  },
  {
    path: ':location_uuid',
    component: ClinicDashboardComponent,
    children: [
      {
        path: 'cdm',
        loadChildren: () =>
          System.import('./cdm/cdm-program.module').then((mod) => mod.CdmModule)
      },
      {
        path: 'general',
        loadChildren: () =>
          System.import('./general/general.module').then(
            (mod) => mod.GeneralModule
          )
      },
      {
        path: 'hiv',
        loadChildren: () =>
          System.import('./hiv/hiv-program.module').then(
            (mod) => mod.HivProgramModule
          )
      },
      {
        path: 'referral',
        loadChildren: () =>
          System.import('./referral/patient-referral-program.module').then(
            (mod) => mod.PatientReferralProgramModule
          )
      },
      {
        path: 'hemato-oncology',
        loadChildren: () =>
          System.import('./hemato-oncology/oncology-program.module').then(
            (mod) => mod.OncologyProgramModule
          )
      },
      {
        path: 'mnch',
        loadChildren: () =>
          System.import('./mnch/mnch-program.module').then(
            (mod) => mod.MNCHModule
          )
      },
      {
        path: 'prevention',
        loadChildren: () =>
          System.import('./prevention/prevention-program.module').then(
            (mod) => mod.PreventionProgramModule
          )
      },
    
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'prefix'
      }
    ],
    canActivate: [ClinicDashboardGuard]
  }
];
export const clinicDashboardRouting: ModuleWithProviders = RouterModule.forChild(
  clinicDashboardRoutes
);
