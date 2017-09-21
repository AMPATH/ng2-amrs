import { PatientInfoComponent } from './common/patient-info/patient-info.component';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientDashboardGuard } from './patient-dashboard.guard';
import { PatientVitalsComponent } from './common/patient-vitals/patient-vitals.component';
import { FormsComponent } from './common/forms/forms.component';
import { LabDataSummaryComponent } from './common/lab-data-summary/lab-data-summary.component';
import { LabOrdersComponent } from './common/lab-orders/lab-orders.component';
import { HivSummaryComponent } from './hiv/hiv-summary/hiv-summary.component';
import { ProgramsComponent } from './programs/programs.component';
import { ClinicalNotesComponent } from './common/clinical-notes/clinical-notes.component';
import { VisitComponent } from './common/visit/visit.component';
import { FormentryComponent } from './common/formentry/formentry.component';
import { PatientMonthlyStatusComponent } from
  './hiv/patient-status-change/patient-monthly-status.component';
import { FromentryGuard } from './common/formentry/formentry.guard';
import {
  FormCreationDataResolverService
} from './common/formentry/form-creation-data-resolver.service';
import { LocatorMapComponent } from './common/locator-map/locator-map.component';
import { VisitEncountersComponent } from './common/visit-encounters/visit-encounters.component';
import { GeneralLandingPageComponent } from './general-landing-page/landing-page.component';
import { HivLandingPageComponent } from './hiv/landing-page/landing-page.component';
import {
  OncologyLandingPageComponent
} from './oncology/landing-page/landing-page.component';
import { CdmLandingPageComponent } from './cdm/landing-page/landing-page.component';
import {
  PatientSearchContainerComponent
} from '../patient-search/patient-search-container.component';

export const routes = [
  {
    path: '', children: [
      {
        path: 'patient/:patient_uuid',
        component: PatientDashboardComponent,
        canActivate: [
          PatientDashboardGuard
        ],
        canDeactivate: [
          PatientDashboardGuard
        ],
        children: [
          { path: 'general/:program/landing-page', component: GeneralLandingPageComponent },
          {
            path: ':programClass/:program',
            redirectTo: ':programClass/:program/landing-page', pathMatch: 'full'
          },
          {
            path: 'hiv/:program/landing-page',
            // HIV related programs Landing Page
            component: HivSummaryComponent
          },
          { // Oncology related Program Landing Page
            path: 'oncology/:program/landing-page',
            component: PatientInfoComponent
          },
          {
            path: 'cdm/:program/landing-page', // CDM Landing Page
            component: PatientInfoComponent
          },
          { path: ':programClass/:program/patient-info',
          component: PatientInfoComponent },
          { path: ':programClass/:program/patient-encounters',
          component: VisitEncountersComponent },
          { path: ':programClass/:program/patient-vitals',
          component: PatientVitalsComponent },
          { path: ':programClass/:program/forms',
          component: FormsComponent },
          {
            path: ':programClass/:program/formentry/:formUuid',
            component: FormentryComponent,
            canDeactivate: [FromentryGuard],
            resolve: {
              compiledSchemaWithEncounter: FormCreationDataResolverService
            }
          },
          { path: ':programClass/:program/hiv-summary', component: HivSummaryComponent },
          {
            path: ':programClass/:program/patient-monthly-status-history',
            component: PatientMonthlyStatusComponent
          },
          { path: ':programClass/:program/lab-data-summary', component: LabDataSummaryComponent },
          { path: ':programClass/:program/lab-orders', component: LabOrdersComponent },
          { path: ':programClass/:program/programs', component: ProgramsComponent },
          { path: ':programClass/:program/clinical-notes', component: ClinicalNotesComponent },
          { path: ':programClass/:program/visit', component: VisitComponent },
          { path: ':programClass/:program/locator-map', component: LocatorMapComponent }
        ]
      }
    ]
  },
  { path: 'patient-search', component: PatientSearchContainerComponent },
];
