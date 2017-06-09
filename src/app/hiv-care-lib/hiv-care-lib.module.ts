import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular/main';
import { TabViewModule } from 'primeng/primeng';

import { Moh731TabularComponent } from './moh-731-report/moh-731-tabular.component';
import { Moh731ReportFilters } from './moh-731-report/moh-731-report-filters.component';
import { Moh731ReportBaseComponent } from './moh-731-report/moh-731-report-base.component';
import { EtlApi } from '../etl-api/etl-api.module';
import { Moh731PatientListComponent } from './moh-731-report/moh-731-patientlist.component';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/src/app/components/date-time-picker';
import { DataListsModule } from '../data-lists/data-lists.module';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { MOHReportComponent } from './moh-731-report/moh-731-report-pdf-view.component';
import { MOHReportService } from './moh-731-report/moh-731-report-pdf-view.service';
import { LocationResourceService } from '../openmrs-api/location-resource.service';
import { SelectModule } from 'ng2-select';
import {
  HivSummaryIndicatorBaseComponent
} from './hiv-summary-indicators/hiv-summary-report-base.component';
import {
  ReportFilters
} from './report-filters/report-filters.component';
import { HivSummaryTabularComponent } from './hiv-summary-indicators/hiv-summary-tabular.component';
@NgModule({
  imports: [
    AgGridModule.withComponents([]),
    EtlApi,
    FormsModule,
    DataListsModule,
    NgamrsSharedModule,
    DateTimePickerModule,
    CommonModule,
    TabViewModule,
    SelectModule
  ],
  exports: [
    Moh731TabularComponent,
    Moh731PatientListComponent,
    Moh731ReportFilters,
    DateTimePickerModule,
    EtlApi,
    CommonModule,
    TabViewModule,
    NgamrsSharedModule,
    MOHReportComponent,
    ReportFilters,
    HivSummaryTabularComponent
  ],
  declarations: [
    Moh731TabularComponent,
    Moh731PatientListComponent,
    Moh731ReportBaseComponent,
    Moh731ReportFilters,
    MOHReportComponent,
    HivSummaryIndicatorBaseComponent,
    ReportFilters,
    HivSummaryTabularComponent
  ],
  providers: [MOHReportService, LocationResourceService]
})
export class HivCareLibModule {
}
