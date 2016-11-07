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
import { LabDataSummaryComponent } from './lab-data-summary/lab-data-summary.component';
import { LabOrdersComponent } from './lab-orders/lab-orders.component';
import { HivSummaryComponent } from './hiv-summary/hiv-summary.component';
import { ProgramsComponent } from './programs/programs.component';
import { ClinicalNotesComponent } from './clinical-notes/clinical-notes.component';

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
      { path: 'hiv-summary', component: HivSummaryComponent },
      { path: 'lab-data-summary', component: LabDataSummaryComponent },
      { path: 'lab-orders', component: LabOrdersComponent },
      { path: 'programs', component: ProgramsComponent },
      { path: 'clinical-notes', component: ClinicalNotesComponent }


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
