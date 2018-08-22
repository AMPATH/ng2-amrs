import { OncologyProgramModule } from '../oncology-care-lib/oncology-care-lib.module';
import {  NgModule  } from '@angular/core';
import {  CommonModule  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http, RequestOptions, XHRBackend } from '@angular/http';
import { Router } from '@angular/router';
import { DataAnalyticsDashboardComponent } from './data-analytics.component';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import {
  AccordionModule, ButtonModule, FieldsetModule, GrowlModule,
  TabViewModule
 } from 'primeng/primeng';
import {  DateTimePickerModule  } from 'ngx-openmrs-formentry/dist/ngx-formentry/';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
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
import { DataAnalyticsHivProgramModule } from './hiv/data-analytics-hiv-program.module';
import { dataAnalyticsDashboardRouting } from './data-analytics-dashboard-routes';
import { DataEntryStatisticsModule } from './../data-entry-statistics/data-entry-statistics.module';
import {
  AnalyticsPatientReferralProgramModule
} from './referral/referral-program.module';
import { DataAnalyticsOncologyProgramModule } from './oncology/data-analytics-oncology-program.module';
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
    NgamrsSharedModule,
    DataAnalyticsHivProgramModule,
    DataAnalyticsOncologyProgramModule,
    AnalyticsPatientReferralProgramModule,
    CalendarModule.forRoot(),
    AgGridModule.withComponents([]),
    NgxMyDatePickerModule,
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
