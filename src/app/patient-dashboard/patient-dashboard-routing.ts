import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientInfoComponent } from './patient-info/patient-info.component';
import { PatientEncountersComponent } from './patient-encounters/patient-encounters.component';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientDashboardGuard } from './patient-dashboard.guard'
const patientDashboardRoutes: Routes = [
  { path: '', redirectTo: 'patient-search', pathMatch: 'full' },
  { path: 'patient-search', component: PatientSearchComponent },
  {
    path: ':patient_uuid', component: PatientDashboardComponent,
    children: [
      { path: 'patient-info', component: PatientInfoComponent },
      { path: 'patient-encounters', component: PatientEncountersComponent }
    ],
    canActivate: [
      PatientDashboardGuard
    ],
    canDeactivate: [
      PatientDashboardGuard
    ]
  }
];
export const patientDashboardRouting: ModuleWithProviders = RouterModule.forChild(patientDashboardRoutes);
