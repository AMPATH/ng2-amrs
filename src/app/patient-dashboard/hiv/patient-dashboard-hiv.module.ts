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
import { FormEntryModule } from 'ng2-openmrs-formentry';
import { MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';
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
import { HivLandingPageComponent } from './landing-page/landing-page.component';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { PatientDashboardCommonModule } from '../common/patient-dashboard.common.module';

import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../utils/session-storage.service';
import { HttpClient } from '../../shared/services/http-client.service';

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
    MdProgressSpinnerModule,
    MdProgressBarModule,
    NgamrsSharedModule,
    OpenmrsApi,
    FormEntryModule,
    TabViewModule,
    GrowlModule, PanelModule
  ],
  exports: [
    HivLandingPageComponent,
    HivPatientClinicalSummaryComponent,
    HivProgramSnapshotComponent,
    HivSummaryComponent,
    HivSummaryHistoricalComponent,
    HivSummaryLatestComponent,
    MedicationHistoryComponent,
    PatientMonthlyStatusComponent,
    PreviousVisitComponent],
  declarations: [
    HivLandingPageComponent,
    HivPatientClinicalSummaryComponent,
    HivProgramSnapshotComponent,
    HivSummaryComponent,
    HivSummaryHistoricalComponent,
    HivSummaryLatestComponent,
    MedicationHistoryComponent,
    PatientMonthlyStatusComponent,
    PreviousVisitComponent
  ],
  providers: [
    {
      provide: Http,
      useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions,
                   router: Router, sessionStorageService: SessionStorageService) =>
        new HttpClient(xhrBackend, requestOptions, router, sessionStorageService),
      deps: [XHRBackend, RequestOptions, Router, SessionStorageService]
    }
  ],
})
export class PatientDashboardHivModule { }
