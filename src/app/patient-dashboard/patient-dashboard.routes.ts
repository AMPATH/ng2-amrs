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
import { FormCreationDataResolverService
} from './common/formentry/form-creation-data-resolver.service';
import { LocatorMapComponent } from './common/locator-map/locator-map.component';
import { VisitEncountersComponent } from './common/visit-encounters/visit-encounters.component';
import { GeneralLandingPageComponent } from './general-landing-page/landing-page.component';
import { HivLandingPageComponent } from './hiv/landing-page/landing-page.component';
import { OncologyLandingPageComponent
} from './oncology/landing-page/landing-page.component';
import { CdmLandingPageComponent } from './cdm/landing-page/landing-page.component';
import { PatientSearchContainerComponent
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
        { path: 'general/landing-page', component: GeneralLandingPageComponent },
        { path: ':program', redirectTo: ':program/landing-page', pathMatch: 'full' },
        {
          path: '781d85b0-1359-11df-a1f1-0026b9348838/landing-page',  // HIV Program Landing Page
          component: HivSummaryComponent
        },
        { // Oncology Program Landing Page
          path: '725b5193-3452-43fc-aca3-6a80432d9bfa/landing-page',
          component: PatientInfoComponent
        },
        {
          path: '781d897a-1359-11df-a1f1-0026b9348838/landing-page', // PMTCT Program Landing Page
          component: PatientInfoComponent
        },
        {
          path: '781d8768-1359-11df-a1f1-0026b9348838/landing-page', // OVC Program Landing Page
          component: PatientInfoComponent
        },
        {
          path: '781d8a88-1359-11df-a1f1-0026b9348838/landing-page', // BSG Landing Page
          component: PatientInfoComponent
        },
        {
          path: 'fc15ac01-5381-4854-bf5e-917c907aa77f/landing-page', // CDM Landing Page
          component: PatientInfoComponent
        },
        { path: ':program/patient-info', component: PatientInfoComponent },
        { path: 'oncology/landing-page', component: PatientInfoComponent },
        { path: ':program/patient-encounters', component: VisitEncountersComponent },
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
        { path: ':program/patient-monthly-status-history',
          component: PatientMonthlyStatusComponent },
        { path: 'hiv/landing-page', component: HivSummaryComponent },
        { path: ':program/lab-data-summary', component: LabDataSummaryComponent },
        { path: ':program/lab-orders', component: LabOrdersComponent },
        { path: 'general/landing-page', component: ProgramsComponent },
        { path: ':program/programs', component: ProgramsComponent },
        { path: ':program/clinical-notes', component: ClinicalNotesComponent },
        { path: ':program/visit', component: VisitComponent },
        { path: ':program/locator-map', component: LocatorMapComponent }
      ]
    }
  ]
  },
  {path: 'patient-search', component: PatientSearchContainerComponent},
];
