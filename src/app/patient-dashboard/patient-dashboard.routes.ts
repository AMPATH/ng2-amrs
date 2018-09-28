import { PatientInfoComponent } from './common/patient-info/patient-info.component';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientDashboardGuard } from './patient-dashboard.guard';
import { PatientVitalsComponent } from './common/patient-vitals/patient-vitals.component';
import { FormsComponent } from './common/forms/forms.component';
import { LabDataSummaryComponent } from './common/lab-data-summary/lab-data-summary.component';
import { LabOrdersComponent } from './common/lab-orders/lab-orders.component';
import { HivSummaryComponent } from './hiv/hiv-summary/hiv-summary.component';
import { CdmSummaryComponent } from './cdm/cdm-summary/cdm-summary.component';
import { ClinicalNotesComponent } from './common/clinical-notes/clinical-notes.component';
import { FormentryComponent } from './common/formentry/formentry.component';
import { PatientMonthlyStatusComponent } from './hiv/patient-status-change/patient-monthly-status.component';
import { FromentryGuard } from './common/formentry/formentry.guard';
import {
  FormCreationDataResolverService
} from './common/formentry/form-creation-data-resolver.service';
import { LocatorMapComponent } from './common/locator-map/locator-map.component';
import { VisitEncountersComponent } from './common/visit-encounters/visit-encounters.component';
import { GeneralLandingPageComponent } from './general-landing-page/landing-page.component';
import {
  PatientSearchContainerComponent
} from '../patient-search/patient-search-container.component';
import { TodayVisitsComponent } from './common/visit/today-visits/today-visits.component';
import { ProgramsContainerComponent } from './programs/programs-container.component';
import {
  ProgramsTransferCareFormWizardComponent
} from './programs/transfer-care/transfer-care-form-wizard.component';
import { ProgramsTransferCareGuard } from './programs/transfer-care/transfer-care.guard';
import { ProgramsComponent } from './programs/programs.component';
import { ProgramsTransferCareComponent } from './programs/transfer-care/transfer-care.component';
import {
  ProgramsTransferCareFormWizardGuard
} from './programs/transfer-care/transfer-care-forms.guard';
import { ProgramEnrollmentComponent } from './programs/program-enrollment.component';
import {
  EnrollmentManagerComponent
} from '../referral-module/components/enrollment-manager/enrollment-manager.component';
import {
  EnrollmentManagerFormWizardComponent
} from '../referral-module/components/enrollment-manager/enrollment-manager-form-wizard.component';
import { PatientDashboardResolver } from './services/patient-dashboard.resolver';
import { PatientCreationComponent } from '../patient-creation/patient-creation.component';
import { PatientImagingComponent } from './common/imaging/patient-imaging.component';
import { GroupEnrollmentComponent } from './programs/group-enrollment/group-enrollment.component';


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
        resolve: {
          patient: PatientDashboardResolver
        },
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
            component: CdmSummaryComponent
          },
          {
            path: 'dermatology/:program/landing-page', // CDM Landing Page
            component: PatientInfoComponent
          },
          {
            path: ':programClass/:program/patient-info',
            component: PatientInfoComponent
          },
          {
            path: ':programClass/:program/patient-encounters',
            component: VisitEncountersComponent
          },
          {
            path: ':programClass/:program/patient-vitals',
            component: PatientVitalsComponent
          },
          { path: ':programClass/:program/group-enrollment',
            component: GroupEnrollmentComponent
          },
          {
            path: ':programClass/:program/forms',
            component: FormsComponent
          },
          {
            path: ':programClass/:program/formentry/:formUuid',
            component: FormentryComponent,
            canDeactivate: [FromentryGuard],
            resolve: {
              compiledSchemaWithEncounter: FormCreationDataResolverService
            }
          },
          { path: ':programClass/:program/hiv-summary', component: HivSummaryComponent },
          { path: ':programClass/:program/cdm-summary', component: CdmSummaryComponent },
          {
            path: ':programClass/:program/patient-monthly-status-history',
            component: PatientMonthlyStatusComponent
          },
          { path: ':programClass/:program/lab-data-summary', component: LabDataSummaryComponent },
          { path: ':programClass/:program/patient-imaging', component: PatientImagingComponent },
          { path: ':programClass/:program/lab-orders', component: LabOrdersComponent },
          {
            path: ':programClass/:program/programs',
            component: ProgramsContainerComponent,
            children: [
              {
                path: '',
                redirectTo: 'enrollment-manager', pathMatch: 'full'
              },
              {
                path: 'enrollment-manager',
                children: [
                  {
                    path: '',
                    component: EnrollmentManagerComponent,
                    canActivate: []
                  },
                  {
                    path: 'forms',
                    component: EnrollmentManagerFormWizardComponent,
                    canDeactivate: []
                  }
                ]
              },
              {
                path: 'enrollment-history',
                component: ProgramsComponent
              },
              {
                path: 'transfer-care',
                children: [
                  {
                    path: '',
                    component: ProgramsTransferCareComponent,
                    canActivate: [ProgramsTransferCareGuard]
                  },
                  {
                    path: 'forms',
                    component: ProgramsTransferCareFormWizardComponent,
                    canDeactivate: [ProgramsTransferCareFormWizardGuard]
                  }
                ]
              }
            ],
          },
          { path: ':programClass/:program/clinical-notes', component: ClinicalNotesComponent },
          { path: ':programClass/:program/visit', component: TodayVisitsComponent },
          { path: ':programClass/:program/locator-map', component: LocatorMapComponent }
        ]
      }
    ]
  },
  {
    path: 'patient-search',
    children: [
      {
        path: '',
        component: PatientSearchContainerComponent
      },
      {
        path: 'patient-registration',
        component: PatientCreationComponent
      }
    ]
  }
];
