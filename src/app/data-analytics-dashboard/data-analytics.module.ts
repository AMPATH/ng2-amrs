import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatTabsModule, MatProgressSpinnerModule, MatProgressBarModule
} from '@angular/material';
import { Router } from '@angular/router';
import { Angulartics2Module } from 'angulartics2';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import {
  AccordionModule, ButtonModule, FieldsetModule, GrowlModule,
  TabViewModule
} from 'primeng/primeng';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { CalendarModule } from 'angular-calendar';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';
import {
  ClinicDashboardCacheService
} from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import { HivClinicFlowResourceService } from '../etl-api/hiv-clinic-flow-resource.service';
import { CacheModule } from 'ionic-cache';
import {
  DataAnalyticsDashboardService
} from './services/data-analytics-dashboard.services';
import { SelectDepartmentService } from './../shared/services/select-department.service';
import { DataAnalyticsHivModule } from './hiv/data-analytics-hiv.module';
import {
  DataAnalyticsOncologyModule
} from './oncology/data-analytics-oncology.module';
import {
  DataAnalyticsCdmModule
} from './cdm/data-analytics-cdm.module';
import {
  dataAnalyticsDashboardRouting
} from './data-analytics-dashboard-routes';
import {
  DataEntryStatisticsModule
} from '../data-entry-statistics/data-entry-statistics.module';
import {
  AnalyticsPatientReferralProgramModule
} from './referral/referral-program.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PocHttpInteceptor } from '../shared/services/poc-http-interceptor';
import { ClinicRoutesFactory
} from '../navigation/side-navigation/clinic-side-nav/clinic-side-nav-routes.factory';
import { DataAnalyticsDashboardComponent } from './data-analytics.component';
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
    HttpClientModule,
    GrowlModule,
    AccordionModule,
    Angulartics2Module,
    NgamrsSharedModule,
    DataAnalyticsHivModule,
    DataAnalyticsOncologyModule,
    AnalyticsPatientReferralProgramModule,
    CalendarModule.forRoot(),
    AgGridModule.withComponents([]),
    NgxMyDatePickerModule.forRoot(),
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    CacheModule,
    DataEntryStatisticsModule,
    DataAnalyticsCdmModule
  ],
  declarations: [
    DataAnalyticsDashboardComponent
  ],
  providers: [
    DataAnalyticsDashboardGuard,
    ClinicDashboardCacheService,
    DataAnalyticsDashboardService,
    SelectDepartmentService,
    {
      provide: 'ClinicFlowResource',
      useExisting: HivClinicFlowResourceService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true
    },
    ClinicRoutesFactory
  ],
  exports: []
})
export class DataAnalyticsModule { }
