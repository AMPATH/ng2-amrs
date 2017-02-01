import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EtlApi } from '../etl-api/etl-api.module';

import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule
} from 'primeng/primeng';
import { Angulartics2Module } from 'angulartics2';
import { Ng2PaginationModule } from 'ng2-pagination';
import { Ng2FilterPipe } from '../shared/pipes/ng2-filter.pipe';
import { patientDashboardRouting } from './patient-dashboard-routing';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { PatientEncountersComponent } from './patient-encounters/patient-encounters.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientDashboardGuard } from './patient-dashboard.guard';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientVitalsComponent } from './patient-vitals/patient-vitals.component';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { FormsComponent } from './forms/forms.component';
import { LabDataSummaryComponent } from './lab-data-summary/lab-data-summary.component';
import { LabOrdersComponent } from './lab-orders/lab-orders.component';
import { HivSummaryLatestComponent } from './hiv-summary/hiv-summary-latest.component';
import { HivSummaryHistoricalComponent } from './hiv-summary/hiv-summary-historical.component';
import { HivSummaryComponent } from './hiv-summary/hiv-summary.component';
import { ClinicalNotesComponent } from './clinical-notes/clinical-notes.component';
import { VisitComponent } from './visit/visit.component';
import { PatientIdentifierComponent } from './patient-identifier/patient-identifier.component';
import { ProgramService } from './programs/program.service';
import { ProgramsComponent } from './programs/programs.component';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { PatientSearchService } from './patient-search/patient-search.service';
import { FormOrderMetaDataService } from './forms/form-order-metadata.service';
import { FormListService } from './forms/form-list.service';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { PatientEncounterService } from './patient-encounters/patient-encounters.service';
import { EncounterListComponent } from './patient-encounters/encounter-list.component';
import { PatientService } from './patient.service';
import { PatientBannerComponent } from './patient-banner/patient-banner.component';
import { LabSyncComponent } from './lab-data-summary/lab-sync.component';
import { MedicationHistoryComponent } from './hiv-summary/madication-history.component';
import { HivSummaryService } from './hiv-summary/hiv-summary.service';
import { LabResultComponent } from './lab-data-summary/lab-result.component';
import { ContactsComponent } from './patient-info/contacts.component';
import { AddressComponent } from './patient-info/address.component';
import { FormListComponent } from './forms/form-list.component';
import { PatientDemographicsComponent } from './patient-info/patient-demograpics.component';
import { PatientVitalsService } from './patient-vitals/patient-vitals.service';
import { FormSchemaService } from './formentry/form-schema.service';
import { UtilsModule } from '../utils/utils.module';
import { FormDataSourceService } from './formentry/form-data-source.service';
import { FormentryComponent } from './formentry/formentry.component';
import { FormentryHelperService } from './formentry/formentry-helper.service';
import { FormEntryModule } from 'ng2-openmrs-formentry';
import { FromentryGuard } from './formentry/formentry.guard';
import { PatientPreviousEncounterService } from './patient-previous-encounter.service';
import { FormCreationDataResolverService } from './formentry/form-creation-data-resolver.service';
import { LabTestOrdersComponent } from './lab-orders/lab-test-orders.component';
import { FormSubmissionService } from './formentry/form-submission.service';
import { PatientReminderService } from './patient-reminders/patient-reminders.service';
import { DraftedFormsService } from './formentry/drafted-forms.service';
import { DraftedFormNavComponent } from './formentry/drafted-form-nav.component';
import { TodaysVitalsComponent } from './todays-vitals/todays-vitals.component';
import { TodaysVitalsService } from './todays-vitals/todays-vitals.service';
import { ToastrModule } from 'toastr-ng2';
import { PatientRemindersComponent } from './patient-reminders/patient-reminders.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    patientDashboardRouting,
    CommonModule,
    AccordionModule,
    DataTableModule,
    SharedModule,
    NgamrsSharedModule,
    Ng2PaginationModule,
    OpenmrsApi,
    UtilsModule,
    TabViewModule,
    GrowlModule, PanelModule,
    Angulartics2Module.forChild(),
    FormEntryModule,
    ReactiveFormsModule,
    ConfirmDialogModule, DialogModule,
    ToastrModule.forRoot(),
    EtlApi

  ],
  declarations: [
    PatientInfoComponent,
    PatientEncountersComponent,
    PatientSearchComponent,
    PatientDashboardComponent,
    PatientVitalsComponent,
    FormsComponent,
    LabDataSummaryComponent,
    LabOrdersComponent,
    HivSummaryComponent,
    HivSummaryLatestComponent,
    HivSummaryHistoricalComponent,
    ClinicalNotesComponent,
    ProgramsComponent,
    EncounterListComponent,
    VisitComponent,
    PatientBannerComponent,
    LabSyncComponent,
    MedicationHistoryComponent,
    LabResultComponent,
    ContactsComponent,
    PatientIdentifierComponent,
    AddressComponent,
    PatientDemographicsComponent,
    FormListComponent,
    Ng2FilterPipe,
    FormentryComponent,
    LabTestOrdersComponent,
    DraftedFormNavComponent,
    TodaysVitalsComponent,
    PatientRemindersComponent

  ],
  providers: [
    PatientEncounterService,
    PatientDashboardGuard,
    PatientSearchService,
    AppFeatureAnalytics,
    PatientService,
    PatientPreviousEncounterService,
    HivSummaryService,
    FormListService,
    FormOrderMetaDataService,
    PatientVitalsService,
    FormSchemaService,
    FormDataSourceService,
    FormentryHelperService,
    ConfirmationService,
    FromentryGuard,
    FormCreationDataResolverService,
    FormSubmissionService,
    PatientReminderService,
    DraftedFormsService,
    TodaysVitalsService,
    ProgramService
  ],
  exports: [
    PatientDashboardComponent,
    PatientEncountersComponent,
    PatientVitalsComponent,
    FormsComponent,
    LabDataSummaryComponent,
    LabOrdersComponent,
    HivSummaryComponent,
    HivSummaryLatestComponent,
    HivSummaryHistoricalComponent,
    ClinicalNotesComponent,
    ProgramsComponent,
    EncounterListComponent,
    PatientDemographicsComponent,
    FormListComponent,
    FormentryComponent,
    DraftedFormNavComponent,
    PatientRemindersComponent
  ]
})
export class PatientDashboardModule {
}
