import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule, DataTableModule, SharedModule } from 'primeng/primeng';
import { Ng2PaginationModule } from 'ng2-pagination';

import { patientDashboardRouting } from './patient-dashboard-routing';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { PatientEncountersComponent } from './patient-encounters/patient-encounters.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientDashboardGuard } from './patient-dashboard.guard';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { PatientVitalsComponent } from './patient-vitals/patient-vitals.component';
import { FormsComponent } from './forms/forms.component';
import { LabDataSummaryComponent } from './lab-data-summary/lab-data-summary.component';
import { LabOrdersComponent } from './lab-orders/lab-orders.component';
import { HivSummaryComponent } from './hiv-summary/hiv-summary.component';
import { ClinicalNotesComponent } from './clinical-notes/clinical-notes.component';
import { ProgramsComponent } from './programs/programs.component';
import { PatientSearchService } from './patient-search/patient-search.service';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    patientDashboardRouting, CommonModule, AccordionModule, DataTableModule, SharedModule, NgamrsSharedModule,
    Ng2PaginationModule, OpenmrsApi

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
    ClinicalNotesComponent,
    ProgramsComponent
  ],
  providers: [
    PatientDashboardGuard,
    PatientSearchService

  ],
  exports: [
    PatientDashboardComponent,
    PatientEncountersComponent,
    PatientVitalsComponent,
    FormsComponent,
    LabDataSummaryComponent,
    LabOrdersComponent,
    HivSummaryComponent,
    ClinicalNotesComponent,
    ProgramsComponent
  ]
})
export class PatientDashboardModule {
}
