import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { PatientEncountersComponent } from './patient-encounters/patient-encounters.component';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientDashboardGuard } from './patient-dashboard.guard';
import { PatientVitalsComponent } from './patient-vitals/patient-vitals.component';
import { FormsComponent } from './forms/forms.component';

const patientDashboardRoutes: Routes = [

  { path: 'patient-search', component: PatientSearchComponent, canActivate: [AuthGuard] },
  {
    path: ':patient_uuid',
    component: PatientDashboardComponent,
    children: [
      { path: 'patient-info', component: PatientInfoComponent },
      { path: 'patient-encounters', component: PatientEncountersComponent },
      { path: 'patient-vitals', component: PatientVitalsComponent },
      { path: 'forms', component: FormsComponent },

      { path: 'hiv-summary', component: FormsComponent },
      { path: 'lab-data-summary', component: FormsComponent },
    ],
    canActivate: [
      AuthGuard,
      PatientDashboardGuard
    ],
    canDeactivate: [
      PatientDashboardGuard
    ]
  }
];
export const patientDashboardRouting: ModuleWithProviders = RouterModule.forChild(patientDashboardRoutes);
