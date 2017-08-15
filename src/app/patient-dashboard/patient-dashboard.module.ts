import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EtlApi } from '../etl-api/etl-api.module';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
// import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';
import { Angulartics2Module } from 'angulartics2';
import { Ng2PaginationModule } from 'ng2-pagination';
import { patientDashboardRouting } from './patient-dashboard-routing';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { PatientEncountersComponent } from './patient-encounters/patient-encounters.component';
import { PatientDashboardGuard } from './patient-dashboard.guard';
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
import { FormOrderMetaDataService } from './forms/form-order-metadata.service';
import { FormListService } from './forms/form-list.service';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { PatientEncounterService } from './patient-encounters/patient-encounters.service';
import { EncounterListComponent } from './patient-encounters/encounter-list.component';
import {
  PatientEncounterObservationsComponent
} from './patient-encounters/patient-encounter-observations.component';
import { PatientService } from './patient.service';
import { PatientBannerComponent } from './patient-banner/patient-banner.component';
import { LabSyncComponent } from './lab-data-summary/lab-sync.component';
import { MedicationHistoryComponent } from './hiv-summary/medication-history.component';
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
import { ToastrModule } from 'ngx-toastr';
import { PatientRemindersComponent } from './patient-reminders/patient-reminders.component';
import { OrderListComponent } from './formentry/order-list.component';
// tslint:disable-next-line:max-line-length
import { PatientMonthlyStatusComponent } from './patient-status-change/patient-monthly-status.component';
import { PatientRelationshipService } from './patient-relationships/patient-relationship.service';
import {
  AddPatientRelationshipComponent
} from './patient-relationships/add-patient-relationship.component';
import {
  EditPatientRelationshipComponent
} from './patient-relationships/edit-patient-relationship.component';
import {
  PatientRelationshipTypeService
} from './patient-relationships/patient-relation-type.service';
import {
  PatientRelationshipsComponent
} from './patient-relationships/patient-relationships.component';
import { EditAddressComponent } from './patient-info/edit-address.component';
import {
  EditPatientIdentifierComponent
} from './patient-identifier/edit-patient-identifier.component';
import { PatientCareStatusResourceService } from '../etl-api/patient-care-status-resource.service';
import { PatientIdentifierService } from './patient-identifier/patient-identifiers.service';
import { EditContactsComponent } from './patient-info/edit-contacts.component';
import {
  HivPatientClinicalSummaryComponent
} from './patient-clinical-summaries/hiv-patient-clinical-summary.component';
import { AgGridModule } from 'ag-grid-angular/main';
import { LabOrderSearchModule } from '../lab-order-search/lab-order-search.module';
import { FileUploaderModule } from 'ngx-file-uploader';

import {
  HivPatientClinicalSummaryService
} from './patient-clinical-summaries/hiv-patient-clinical-summary.service';
import { EditDemographicsComponent } from './patient-info/edit-demographics.component';
import { PatientRoutesFactory } from './patient-side-nav/patient-side-nav-routes.factory';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { HivProgramSnapshotComponent } from './programs/hiv/hiv-program-snapshot.component';
import { VisitPeriodComponent } from './visit/visit-period/visit-period.component';
import { LocatorMapComponent } from './locator-map/locator-map.component';
import { SecurePipe } from './locator-map/secure.pipe';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SelectModule } from 'angular2-select';
import { CohortMemberModule } from '../patient-list-cohort/cohort-member/cohort-member.module';
import { EditHealtCenterComponent } from './patient-info/edit-healthcenter.component';
import { VisitEncountersListComponent } from './visit-encounters/visit-encounters-list.component';
import { VisitEncountersComponent } from './visit-encounters/visit-encounters.component';
import { VisitEncountersPipe } from './visit-encounters/visit-encounters.pipe';
import { OrderByAlphabetPipe } from './visit-encounters/visit-encounter.component.order.pipe';
import { OrderByEncounterTimeAscPipe } from './visit-encounters/orderByEncounterTime.pipe';
// tslint:disable-next-line:max-line-length
import { EncounterTypeFilter } from './patient-encounters/encounter-list.component.filterByEncounterType.pipe';

import { routes } from './patient-dashboard.routes';
import { PatientSearchModule } from './../patient-search/patient-search.module';
import { PatientDashboardComponent } from './patient-dashboard.component';

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    LandingPageComponent,
    PatientInfoComponent,
    PatientEncountersComponent,
    PatientEncounterObservationsComponent,
    PatientDashboardComponent,
    PatientVitalsComponent,
    FormsComponent,
    LabDataSummaryComponent,
    LabOrdersComponent,
    HivSummaryComponent,
    HivSummaryLatestComponent,
    HivSummaryHistoricalComponent,
    HivProgramSnapshotComponent,
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
    FormentryComponent,
    LabTestOrdersComponent,
    DraftedFormNavComponent,
    TodaysVitalsComponent,
    PatientRemindersComponent,
    OrderListComponent,
    PatientRelationshipsComponent,
    EditContactsComponent,
    EditAddressComponent,
    EditHealtCenterComponent,
    HivPatientClinicalSummaryComponent,
    EditDemographicsComponent,
    EditPatientIdentifierComponent,
    EditPatientRelationshipComponent,
    AddPatientRelationshipComponent,
    VisitPeriodComponent,
    PatientMonthlyStatusComponent,
    LocatorMapComponent,
    SecurePipe,
    VisitEncountersListComponent,
    VisitEncountersComponent,
    VisitEncountersPipe,
    OrderByAlphabetPipe,
    OrderByEncounterTimeAscPipe,
    EncounterTypeFilter
  ],
  imports: [
    CommonModule,
    PatientSearchModule,
    FormsModule,
    AccordionModule,
    DataTableModule,
    SharedModule,
    InputTextModule,
    MessagesModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    NgamrsSharedModule,
    Ng2PaginationModule,
    OpenmrsApi,
    UtilsModule,
    TabViewModule,
    GrowlModule, PanelModule,
    Angulartics2Module.forChild(),
    MdProgressSpinnerModule,
    MdProgressBarModule,
    FormEntryModule,
    ReactiveFormsModule,
    ConfirmDialogModule, DialogModule,
    ToastrModule.forRoot(),
    EtlApi,
    ButtonModule,
    DateTimePickerModule,
    SelectModule,
    AgGridModule.withComponents([

    ]),
    LabOrderSearchModule,
    FileUploaderModule,
    CohortMemberModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    PatientEncounterService,
    PatientDashboardGuard,
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
    PatientRelationshipService,
    ProgramService,
    HivPatientClinicalSummaryService,
    DatePipe,
    PatientIdentifierService,
    PatientRoutesFactory,
    PatientRelationshipTypeService,
    PatientCareStatusResourceService
  ]
})
export class PatientDashboardModule {
  public static routes = routes;
}
