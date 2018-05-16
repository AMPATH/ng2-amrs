import {  NgModule  } from '@angular/core';
import {  CommonModule  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
   MdTabsModule, MdProgressSpinnerModule, MdProgressBarModule
 } from '@angular/material';
import { Http, RequestOptions, XHRBackend } from '@angular/http';
import { Router } from '@angular/router';
import { DataAnalyticsDashboardComponent } from './data-analytics.component';
import {  Angulartics2Module  } from 'angulartics2';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import {
  AccordionModule, ButtonModule, FieldsetModule, GrowlModule,
  TabViewModule
 } from 'primeng/primeng';
import {  DateTimePickerModule  } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { BusyConfig, BusyModule } from 'angular2-busy';
import { AgGridModule } from 'ag-grid-angular';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { CalendarModule } from 'angular-calendar';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';
import { ClinicDashboardCacheService
} from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import { HivClinicFlowResourceService } from '../etl-api/hiv-clinic-flow-resource.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { HttpClient } from '../shared/services/http-client.service';
import { CacheModule } from 'ionic-cache';
import {
  DataAnalyticsDashboardService
} from './services/data-analytics-dashboard.services';
import { DataAnalyticsHivProgramModule } from './hiv/hiv-program.module';
import { dataAnalyticsDashboardRouting } from './data-analytics-dashboard-routes';
import { DataEntryStatisticsModule } from
'./../data-entry-statistics/data-entry-statistics.module';
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
    TabViewModule,
    FieldsetModule,
    ButtonModule,
    GrowlModule,
    AccordionModule,
    Angulartics2Module.forChild(),
    NgamrsSharedModule,
    BusyModule.forRoot(
      new BusyConfig({
        message: 'Please Wait...',
        backdrop: true,
        delay: 200,
        minDuration: 600,
        wrapperClass: 'my-class',

      })
    ),
    DataAnalyticsHivProgramModule,
    CalendarModule.forRoot(),
    AgGridModule.withComponents([]),
    NgxMyDatePickerModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    CacheModule,
    DataEntryStatisticsModule
  ],
  declarations: [
  ],
  providers: [
    DataAnalyticsDashboardGuard,
    ClinicDashboardCacheService,
    DataAnalyticsDashboardService,
    {
      provide: 'ClinicFlowResource',
      useExisting: HivClinicFlowResourceService
    },
    {
      provide: Http,
      useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions,
                   router: Router, sessionStorageService: SessionStorageService) =>
        new HttpClient(xhrBackend, requestOptions, router, sessionStorageService),
      deps: [XHRBackend, RequestOptions, Router, SessionStorageService]
    }
  ],
  exports: []
})
export class DataAnalyticsModule {}
