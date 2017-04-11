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
import { FromentryGuard } from './formentry/formentry.guard';
import { FormCreationDataResolverService } from './formentry/form-creation-data-resolver.service';
import {
  HivPatientClinicalSummaryComponent
}
  from './patient-clinical-summaries/hiv-patient-clinical-summary.component';

const patientDashboardRoutes: Routes = [

  {
    path: 'patient-search',
    component: PatientSearchComponent,
    data: {title: 'Patient Search'}
  },
  {
    path: ':patient_uuid',
    component: PatientDashboardComponent,
    data: {title: 'Patient Dashboard'},
    children: [
      {
        path: ':program',
        redirectTo: ':program/landing-page',
        pathMatch: 'full'
      },
      // { path: '', redirectTo: 'general/landing-page'},
      {
        path: ':program/patient-info',
        component: PatientInfoComponent,
        data: {title: 'Patient Info'}
      },
      {
        path: 'oncology/landing-page',
        component: PatientInfoComponent,
        data: {title: 'Oncology Landing'}
      },
      {
        path: ':program/patient-encounters',
        component: PatientEncountersComponent,
        data: {title: 'Patient Encounter List'}
      },
      {
        path: ':program/patient-vitals',
        component: PatientVitalsComponent,
        data: {title: 'Patient Vitals'}
      },
      {
        path: ':program/forms',
        component: FormsComponent,
        data: {title: 'Form List'}
      },
      {
        path: ':program/formentry/:formUuid',
        component: FormentryComponent,
        data: {title: 'Form Entry'},
        canDeactivate: [FromentryGuard],
        resolve: {
          compiledSchemaWithEncounter: FormCreationDataResolverService
        }
      },
      {
        path: ':program/hiv-summary',
        component: HivSummaryComponent,
        data: {title: 'HIV Summary'}
      },
      {
        path: 'hiv/landing-page',
        component: HivSummaryComponent,
        data: {title: 'HIV Landing Page'}
      },
      {
        path: ':program/hiv-clinical-summary',
        component: HivPatientClinicalSummaryComponent,
        data: {title: 'HIV Patient Clinical Summary'}
      },
      {
        path: ':program/lab-data-summary',
        component: LabDataSummaryComponent,
        data: {title: 'Lab Data Summary'}
      },
      {
        path: ':program/lab-orders',
        component: LabOrdersComponent,
        data: {title: 'Patient Lab Orders'}
      },
      {
        path: 'general/landing-page',
        component: ProgramsComponent,
        data: {title: 'General Landing Page'}
      },
      {
        path: ':program/programs',
        component: ProgramsComponent,
        data: {title: 'Patient Programs'}
      },
      {
        path: ':program/clinical-notes',
        component: ClinicalNotesComponent,
        data: {title: 'Patient Clinical Notes'}
      },
      {
        path: ':program/visit',
        component: VisitComponent,
        data: {title: 'Patient Visit'}
      }
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
