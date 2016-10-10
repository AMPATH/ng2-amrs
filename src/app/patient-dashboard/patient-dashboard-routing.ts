import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { PatientEncountersComponent } from './patient-encounters/patient-encounters.component';
const patientDashboardRoutes: Routes = [
  { path: '', redirectTo: 'patient-info', pathMatch: 'full' },
  { path: 'patient-info', component: PatientInfoComponent },
  { path: 'patient-encounters', component: PatientEncountersComponent }
];
export const patientDashboardRouting: ModuleWithProviders = RouterModule.forChild(patientDashboardRoutes);
