import {  NgModule  } from '@angular/core';
import {  CommonModule  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MaterialModule, MdTabsModule, MdProgressSpinnerModule, MdProgressBarModule
 } from '@angular/material';
import { dataAnalyticsDashboardRouting } from './data-analytics-dashboard-routing';
import { DataAnalyticsDashboardComponent } from './data-analytics.component';
import {  Angulartics2Module  } from 'angulartics2';
import { DataListsModule } from '../data-lists/data-lists.module';
import { ReportingUtilities } from '../reporting-utilities/reporting-utilities.module';
import {
  AccordionModule, ButtonModule, FieldsetModule, GrowlModule,
  TabViewModule
 } from 'primeng/primeng';
import {  DateTimePickerModule  } from 'ng2-openmrs-formentry/src/app/components/date-time-picker';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { EtlApi } from '../etl-api/etl-api.module';
import { SelectModule } from 'angular2-select';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { ChartModule } from 'angular2-highcharts';
import { BusyConfig, BusyModule } from 'angular2-busy';
import { HivProgramModule } from '../clinic-dashboard/hiv/hiv-program.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { CalendarModule } from 'angular-calendar';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    dataAnalyticsDashboardRouting,
    CommonModule,
    FormsModule,
    DateTimePickerModule,
    DataListsModule,
    ReportingUtilities,
    TabViewModule,
    FieldsetModule,
    ButtonModule,
    GrowlModule,
    AccordionModule,
    OpenmrsApi,
    EtlApi,
    SelectModule,
    Angulartics2Module.forChild(),
    NgamrsSharedModule,
    ChartModule.forRoot(require('highcharts'),
      require('highcharts/highcharts-more'),
      require('highcharts/modules/exporting')
    ),
    BusyModule.forRoot(
      new BusyConfig({
        message: 'Please Wait...',
        backdrop: true,
        delay: 200,
        minDuration: 600,
        wrapperClass: 'my-class',

      })
    ),
    HivProgramModule,
    CalendarModule.forRoot(),
    AgGridModule.withComponents([]),
    NgxMyDatePickerModule,
    MdTabsModule.forRoot(),
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MaterialModule
  ],
  declarations: [
    DataAnalyticsDashboardComponent,
  ],
  providers: [
    DataAnalyticsDashboardGuard,
  ],
  exports: [
    DataAnalyticsDashboardComponent
  ]
})
export class DataAnalyticsModule {}
