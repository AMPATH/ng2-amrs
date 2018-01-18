import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EtlApi } from '../../etl-api/etl-api.module';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Angulartics2Module } from 'angulartics2';
import { Ng2PaginationModule } from 'ng2-pagination';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import {
  PatientEncountersComponent
} from './patient-encounters/patient-encounters.component';
import { PatientVitalsComponent } from './patient-vitals/patient-vitals.component';
import { FormsComponent } from './forms/forms.component';
import { LabDataSummaryComponent } from './lab-data-summary/lab-data-summary.component';
import { LabOrdersComponent } from './lab-orders/lab-orders.component';
import { ClinicalNotesComponent } from './clinical-notes/clinical-notes.component';
import { VisitComponent } from './visit/visit.component';
import { EditVisitTypeComponent } from './visit/visit-details/edit-visit-type.component';
import { PatientIdentifierComponent
} from './patient-identifier/patient-identifier.component';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { PatientSearchService } from '../../patient-search/patient-search.service';
import { FormOrderMetaDataService } from './forms/form-order-metadata.service';
import { FormListService } from './forms/form-list.service';
import { OpenmrsApi } from '../../openmrs-api/openmrs-api.module';
import { PatientEncounterService } from './patient-encounters/patient-encounters.service';
import { EncounterListComponent } from './patient-encounters/encounter-list.component';
import {
  PatientEncounterObservationsComponent
} from './patient-encounters/patient-encounter-observations.component';
import { PatientService } from '../services/patient.service';
import { PatientBannerComponent } from './patient-banner/patient-banner.component';
import { LabSyncComponent } from './lab-data-summary/lab-sync.component';
import { HivSummaryService } from '../hiv/hiv-summary/hiv-summary.service';
import { LabResultComponent } from './lab-data-summary/lab-result.component';
import { ContactsComponent } from './patient-info/contacts.component';
import { AddressComponent } from './patient-info/address.component';
import { PatientDemographicsComponent } from './patient-info/patient-demograpics.component';
import { PatientVitalsService } from './patient-vitals/patient-vitals.service';
import { FormSchemaService } from './formentry/form-schema.service';
import { UtilsModule } from '../../utils/utils.module';
import { FormDataSourceService } from './formentry/form-data-source.service';
import { FormentryComponent } from './formentry/formentry.component';
import { FormentryHelperService } from './formentry/formentry-helper.service';
import { FormEntryModule } from 'ng2-openmrs-formentry';
import { FromentryGuard } from './formentry/formentry.guard';
import { PatientPreviousEncounterService } from '../services/patient-previous-encounter.service';
import {
  FormCreationDataResolverService
} from './formentry/form-creation-data-resolver.service';
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
import {
  PatientRelationshipService
} from './patient-relationships/patient-relationship.service';
import {
  PatientRelationshipSearchComponent
} from './patient-relationships/patient-relationship-search.component';
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
import { PatientCareStatusResourceService } from
  '../../etl-api/patient-care-status-resource.service';
import { PatientIdentifierService } from './patient-identifier/patient-identifiers.service';
import { EditContactsComponent } from './patient-info/edit-contacts.component';
import { AgGridModule } from 'ag-grid-angular/main';
import { FileUploaderModule } from 'ngx-file-uploader';

import {
  HivPatientClinicalSummaryService
} from '../hiv/patient-clinical-summaries/hiv-patient-clinical-summary.service';
import { EditDemographicsComponent } from './patient-info/edit-demographics.component';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { VisitPeriodComponent } from './visit/visit-period/visit-period.component';
import { LocatorMapComponent } from './locator-map/locator-map.component';
import { SecurePipe } from './locator-map/secure.pipe';
import { SelectModule } from 'angular2-select';
import { CohortMemberModule } from '../../patient-list-cohort/cohort-member/cohort-member.module';
import { EditHealtCenterComponent } from './patient-info/edit-healthcenter.component';
import {
  VisitEncountersListComponent
} from './visit-encounters/visit-encounters-list.component';
import { VisitEncountersComponent } from './visit-encounters/visit-encounters.component';
import { VisitEncountersPipe } from './visit-encounters/visit-encounters.pipe';
import {
  OrderByAlphabetPipe
} from './visit-encounters/visit-encounter.component.order.pipe';
import { OrderByEncounterTimeAscPipe } from './visit-encounters/orderByEncounterTime.pipe';
import { EncounterTypeFilter } from
  './patient-encounters/encounter-list.component.filterByEncounterType.pipe';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { LabOrderSearchModule } from '../../lab-order-search/lab-order-search.module';
import { PatientSearchModule } from '../../patient-search/patient-search.module';
import { PatientProgramService } from '../programs/patient-programs.service';
import { BusyComponent } from '../../shared/busy-loader/busy.component';
import { FormentryReferralsHandlerService } from './formentry/formentry-referrals-handler.service';
import { PatientReferralsModule } from './patient-referrals/patient-referrals.module';
import { VisitDetailsComponent } from './visit/visit-details/visit-details.component';
import { VisitStarterComponent } from './visit/visit-starter/visit-starter.component';
import { TodayVisitService } from './visit/today-visit.service';
import { TodayVisitsComponent } from './visit/today-visits/today-visits.component';
import { VisitSummaryComponent } from './visit/visit-summary/visit-summary.component';
import { UnenrollPatientProgramsComponent } from './programs/unenroll-patient-programs.component';
import { ProgramTransferCareModule } from '../programs/transfer-care/transfer-care.module';
import { FormUpdaterService } from './formentry/form-updater.service';
import { ReferralModule } from '../../referral-module/ReferralModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
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
    Ng2Bs3ModalModule,
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
    FileUploaderModule,
    CohortMemberModule,
    LabOrderSearchModule,
    HivCareLibModule,
    PatientSearchModule,
    PatientReferralsModule,
    ReferralModule,
    ProgramTransferCareModule
  ],
  exports: [
    PatientInfoComponent,
    BusyComponent,
    PatientEncountersComponent,
    PatientEncounterObservationsComponent,
    PatientVitalsComponent,
    FormsComponent,
    LabDataSummaryComponent,
    LabOrdersComponent,
    ClinicalNotesComponent,
    EncounterListComponent,
    VisitComponent,
    PatientBannerComponent,
    LabSyncComponent,
    LabResultComponent,
    ContactsComponent,
    PatientIdentifierComponent,
    AddressComponent,
    PatientDemographicsComponent,
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
    EditDemographicsComponent,
    EditPatientIdentifierComponent,
    EditPatientRelationshipComponent,
    AddPatientRelationshipComponent,
    PatientRelationshipSearchComponent,
    VisitPeriodComponent,
    TodayVisitsComponent,
    VisitSummaryComponent,
    LocatorMapComponent,
    SecurePipe,
    VisitEncountersListComponent,
    VisitEncountersComponent,
    VisitDetailsComponent,
    VisitStarterComponent,
    UnenrollPatientProgramsComponent,
    VisitEncountersPipe,
    OrderByAlphabetPipe,
    OrderByEncounterTimeAscPipe,
    EncounterTypeFilter],
  declarations: [
    VisitSummaryComponent,
    PatientInfoComponent,
    BusyComponent,
    PatientEncountersComponent,
    PatientEncounterObservationsComponent,
    PatientVitalsComponent,
    FormsComponent,
    LabDataSummaryComponent,
    LabOrdersComponent,
    ClinicalNotesComponent,
    EncounterListComponent,
    VisitComponent,
    PatientBannerComponent,
    EditVisitTypeComponent,
    LabSyncComponent,
    LabResultComponent,
    ContactsComponent,
    PatientIdentifierComponent,
    AddressComponent,
    PatientDemographicsComponent,
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
    EditDemographicsComponent,
    EditPatientIdentifierComponent,
    EditPatientRelationshipComponent,
    AddPatientRelationshipComponent,
    PatientRelationshipSearchComponent,
    VisitPeriodComponent,
    TodayVisitsComponent,
    LocatorMapComponent,
    SecurePipe,
    VisitEncountersListComponent,
    VisitEncountersComponent,
    VisitDetailsComponent,
    VisitStarterComponent,
    UnenrollPatientProgramsComponent,
    VisitEncountersPipe,
    OrderByAlphabetPipe,
    OrderByEncounterTimeAscPipe,
    EncounterTypeFilter],
  providers: [
    FormUpdaterService,
    PatientEncounterService,
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
    PatientProgramService,
    PatientRelationshipService,
    HivPatientClinicalSummaryService,
    DatePipe,
    PatientIdentifierService,
    PatientRelationshipTypeService,
    FormentryReferralsHandlerService,
    PatientCareStatusResourceService,
    TodayVisitService],
})
export class PatientDashboardCommonModule { }
