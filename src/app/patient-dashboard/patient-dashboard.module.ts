import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule
} from 'primeng/primeng';

import { Ng2PaginationModule } from 'ng2-pagination';
import { TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';
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
import { HivSummaryComponent } from './hiv-summary/hiv-summary.component';
import { ClinicalNotesComponent } from './clinical-notes/clinical-notes.component';
import { VisitComponent } from './visit/visit.component';
import { PatientIdentifierComponent } from './patient-identifier/patient-identifier.component';
import { ProgramsComponent } from './programs/programs.component';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { PatientSearchService } from './patient-search/patient-search.service';
import { FormOrderMetaDataService } from './forms/form-order-metadata.service';
import { FormListService } from './forms/form-list.service';
import { FormsResourceService } from './../openmrs-api/forms-resource.service';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { PatientEncounterService } from './patient-encounters/patient-encounters.service';
import { EncounterListComponent } from './patient-encounters/encounter-list.component';
import { VitalsResourceService } from '../etl-api/vitals-resource.service';
import { HivSummaryResourceService } from '../etl-api/hiv-summary-resource.service';
import { PatientService } from './patient.service';
import { VisitResourceService } from '../openmrs-api/visit-resource.service';
import { PatientBannerComponent } from './patient-banner/patient-banner.component';
import { LabSyncComponent } from './lab-data-summary/lab-sync.component';
import { LabsResourceService } from '../etl-api/labs-resource.service';
import { MedicationHistoryComponent } from './hiv-summary/madication-history.component';
import { MedicationHistoryResourceService } from '../etl-api/medication-history-resource.service';
import { ClinicalNotesResourceService } from '../etl-api/clinical-notes-resource.service';
import { HivSummaryService } from './hiv-summary/hiv-summary.service';
import { LabResultComponent } from './lab-data-summary/lab-result.component';
import { ContactsComponent } from './patient-info/contacts.component';
import { AddressComponent } from './patient-info/address.component';
import { FormListComponent } from './forms/form-list.component';
import { PatientDemographicsComponent } from './patient-info/patient-demograpics.component';



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
    Ng2PaginationModule, OpenmrsApi,
    TooltipModule,
    TabViewModule,
    GrowlModule, PanelModule


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
    Ng2FilterPipe
  ],
  providers: [
    PatientEncounterService,
    PatientDashboardGuard,
    PatientSearchService,
    AppFeatureAnalytics,
    VitalsResourceService,
    PatientService,
    VisitResourceService,
    LabsResourceService,
    ClinicalNotesResourceService,
    MedicationHistoryResourceService,
    HivSummaryResourceService,
    HivSummaryService,
    FormListService,
    FormOrderMetaDataService,
    FormsResourceService
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
    ClinicalNotesComponent,
    ProgramsComponent,
    EncounterListComponent,
    PatientDemographicsComponent,
    FormListComponent
  ]
})
export class PatientDashboardModule {
}
