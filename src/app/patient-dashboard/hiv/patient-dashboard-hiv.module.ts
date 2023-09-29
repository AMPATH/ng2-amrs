import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AccordionModule,
  DataTableModule,
  SharedModule,
  TabViewModule,
  GrowlModule,
  PanelModule,
  ConfirmDialogModule,
  ConfirmationService,
  DialogModule,
  InputTextModule,
  MessagesModule,
  InputTextareaModule,
  DropdownModule,
  ButtonModule,
  CalendarModule
} from 'primeng/primeng';
import { PreviousVisitComponent } from './hiv-summary/previous-visit.component';
import { FormEntryModule } from '@ampath-kenya/ngx-openmrs-formentry';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { OpenmrsApi } from '../../openmrs-api/openmrs-api.module';
import { HivPatientClinicalSummaryComponent } from './patient-clinical-summaries/hiv-patient-clinical-summary.component';
import { HivProgramSnapshotComponent } from './program-snapshot/hiv-program-snapshot.component';
import { HivSummaryComponent } from './hiv-summary/hiv-summary.component';
import { HivSummaryHistoricalComponent } from './hiv-summary/hiv-summary-historical.component';
import { MedicationHistoryComponent } from './hiv-summary/medication-history.component';
import { GeneXpertImagesComponent } from './genexpert-images/genexpert-images.component';
import { PatientMonthlyStatusComponent } from './patient-status-change/patient-monthly-status.component';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { PatientDashboardCommonModule } from '../common/patient-dashboard.common.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PocHttpInteceptor } from 'src/app/shared/services/poc-http-interceptor';
import { GeneXpertResourceService } from './genexpert-images/genexpert-images-resource.service';
import { HivSummaryService } from './hiv-summary/hiv-summary.service';
import { HivSummaryResourceService } from '../../etl-api/hiv-summary-resource.service';
import { PredictionResourceService } from 'src/app/etl-api/prediction-resource.service';
import { AhdEventsSummaryComponent } from './hiv-summary/ahd-events-summary/ahd-events-summary.component';

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
    GrowlModule,
    PanelModule,
    HttpClientModule
  ],
  exports: [
    HivPatientClinicalSummaryComponent,
    HivSummaryComponent,
    HivSummaryHistoricalComponent,
    MedicationHistoryComponent,
    PatientMonthlyStatusComponent,
    PreviousVisitComponent,
    AhdEventsSummaryComponent
  ],
  declarations: [
    HivPatientClinicalSummaryComponent,
    HivSummaryComponent,
    HivSummaryHistoricalComponent,
    MedicationHistoryComponent,
    PatientMonthlyStatusComponent,
    PreviousVisitComponent,
    GeneXpertImagesComponent,
    AhdEventsSummaryComponent
  ],
  providers: [
    GeneXpertResourceService,
    HivSummaryService,
    PredictionResourceService,
    HivSummaryResourceService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true
    }
  ]
})
export class PatientDashboardHivModule {}
