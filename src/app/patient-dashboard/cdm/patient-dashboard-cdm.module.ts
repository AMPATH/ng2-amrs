import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { CdmLandingPageComponent } from './landing-page/landing-page.component';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../utils/session-storage.service';
import { HttpClient } from '../../shared/services/http-client.service';
import { CdmSummaryComponent } from './cdm-summary/cdm-summary.component';
import { CdmSummaryLatestComponent } from './cdm-summary/cdm-summary-latest.component';
import { CdmSummaryHistoricalComponent } from './cdm-summary/cdm-summary-historical.component';
import { CdmMedicationHistoryComponent } from './cdm-summary/medication-history.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    PanelModule,
    TabViewModule,
    NgxPaginationModule
  ],
  exports: [
    CdmLandingPageComponent,
    CdmSummaryComponent
  ],
  declarations: [
    CdmLandingPageComponent,
    CdmSummaryComponent,
    CdmSummaryLatestComponent,
    CdmSummaryHistoricalComponent,
    CdmMedicationHistoryComponent
  ],
})
export class PatientDashboardCdmModule { }
