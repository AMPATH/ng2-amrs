import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { PreviousVisitComponent } from './hiv-summary/previous-visit.component';
import { FormEntryModule } from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { OpenmrsApi } from '../../openmrs-api/openmrs-api.module';
import { HivPatientClinicalSummaryComponent
} from './patient-clinical-summaries/hiv-patient-clinical-summary.component';
import { HivProgramSnapshotComponent
} from './program-snapshot/hiv-program-snapshot.component';
import { HivSummaryComponent } from './hiv-summary/hiv-summary.component';
import { HivSummaryHistoricalComponent } from './hiv-summary/hiv-summary-historical.component';
import { HivSummaryLatestComponent } from './hiv-summary/hiv-summary-latest.component';
import { MedicationHistoryComponent } from './hiv-summary/medication-history.component';
import { PatientMonthlyStatusComponent
} from './patient-status-change/patient-monthly-status.component';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { PatientDashboardCommonModule } from '../common/patient-dashboard.common.module';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PatientDashboardCommonModule,
    AccordionModule,
    DataTableModule,
    DialogModule,
    MessagesModule,
    SharedModule,
    Ng2Bs3ModalModule,
    NgamrsSharedModule,
    OpenmrsApi,
    FormEntryModule,
    TabViewModule,
    GrowlModule, PanelModule,
    HttpClientModule
  ],
  exports: [
    HivPatientClinicalSummaryComponent,
    HivSummaryComponent,
    HivSummaryHistoricalComponent,
    HivSummaryLatestComponent,
    MedicationHistoryComponent,
    PatientMonthlyStatusComponent,
    PreviousVisitComponent],
  declarations: [
    HivPatientClinicalSummaryComponent,
    HivSummaryComponent,
    HivSummaryHistoricalComponent,
    HivSummaryLatestComponent,
    MedicationHistoryComponent,
    PatientMonthlyStatusComponent,
    PreviousVisitComponent
  ],
  providers: [
  ],
})
export class PatientDashboardHivModule { }
