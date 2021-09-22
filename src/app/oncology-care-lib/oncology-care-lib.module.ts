import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AccordionModule,
  DataTableModule,
  SharedModule,
  TabViewModule,
  GrowlModule,
  PanelModule,
  ConfirmDialogModule,
  DialogModule,
  InputTextModule,
  MessagesModule,
  InputTextareaModule,
  MultiSelectModule,
  DropdownModule,
  ButtonModule,
  CalendarModule
} from 'primeng/primeng';

import { DateTimePickerModule } from '@ampath-kenya/ngx-openmrs-formentry';
import { EtlApi } from '../etl-api/etl-api.module';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { MOH412ReportComponent } from './moh-412-report/moh-412/moh-412-report.component';
import { MOH412TabularComponent } from './moh-412-report/moh-412-table/moh-412-tabular.component';
import { MOH412FilterComponent } from './moh-412-report/moh-412-filters/moh-412-filter.component';
import { MOH412PatientListComponent } from './moh-412-report/moh-412-patient-list/moh-412-patient-list.component';
import { MOH412ReportViewComponent } from './moh-412-report/moh-412-report-view/moh-412-report-view.component';
@NgModule({
  imports: [
    DateTimePickerModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    AccordionModule,
    DataTableModule,
    SharedModule,
    TabViewModule,
    GrowlModule,
    PanelModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    MessagesModule,
    InputTextareaModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    CalendarModule
  ],
  exports: [
    MOH412ReportComponent,
    MOH412TabularComponent,
    MOH412FilterComponent,
    MOH412PatientListComponent,
    MOH412ReportViewComponent
  ],
  declarations: [
    MOH412ReportComponent,
    MOH412TabularComponent,
    MOH412FilterComponent,
    MOH412PatientListComponent,
    MOH412ReportViewComponent
  ],
  providers: []
})
export class OncologyProgramModule {}
