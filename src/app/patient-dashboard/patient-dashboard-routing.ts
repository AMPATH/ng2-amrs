import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { VisitComponent } from './visit/visit.component';
import { FormentryComponent } from './formentry/formentry.component';
import { PatientMonthlyStatusComponent } from
  './patient-status-change/patient-monthly-status.component';
import { FromentryGuard } from './formentry/formentry.guard';
import { FormCreationDataResolverService } from './formentry/form-creation-data-resolver.service';
import { HivPatientClinicalSummaryComponent }
  from './patient-clinical-summaries/hiv-patient-clinical-summary.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const patientDashboardRoutes: Routes = [

  { path: 'patient-search', component: PatientSearchComponent },
  {
    path: ':patient_uuid',
    component: PatientDashboardComponent,
    children: [
      { path: 'general/landing-page', component: LandingPageComponent },
      { path: ':program', redirectTo: ':program/landing-page', pathMatch: 'full' },
      { path: ':program/patient-info', component: PatientInfoComponent },
      { path: 'oncology/landing-page', component: PatientInfoComponent },
      { path: ':program/patient-encounters', component: PatientEncountersComponent },
      { path: ':program/patient-vitals', component: PatientVitalsComponent },
      { path: ':program/forms', component: FormsComponent },
      {
        path: ':program/formentry/:formUuid',
        component: FormentryComponent,
        canDeactivate: [FromentryGuard],
        resolve: {
          compiledSchemaWithEncounter: FormCreationDataResolverService
        }
      },
      { path: ':program/hiv-summary', component: HivSummaryComponent },
      { path: ':program/patient-monthly-status-history', component: PatientMonthlyStatusComponent },
      { path: 'hiv/landing-page', component: HivSummaryComponent },
      { path: ':program/lab-data-summary', component: LabDataSummaryComponent },
      { path: ':program/lab-orders', component: LabOrdersComponent },
      { path: 'general/landing-page', component: ProgramsComponent },
      { path: ':program/programs', component: ProgramsComponent },
      { path: ':program/clinical-notes', component: ClinicalNotesComponent },
      { path: ':program/visit', component: VisitComponent }
    ],
    canActivate: [
      PatientDashboardGuard
    ],
    canDeactivate: [
      PatientDashboardGuard
    ]
  }
];
export const patientDashboardRouting: ModuleWithProviders = RouterModule
  .forChild(patientDashboardRoutes);
