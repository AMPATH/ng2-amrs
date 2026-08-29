import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatTabsModule,
  MatProgressSpinnerModule,
  MatProgressBarModule
} from '@angular/material';
import { Angulartics2Module } from 'angulartics2';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import {
  AccordionModule,
  ButtonModule,
  FieldsetModule,
  GrowlModule,
  TabViewModule
} from 'primeng/primeng';
import { DateTimePickerModule } from '@ampath-kenya/ngx-openmrs-formentry';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { CalendarModule } from 'angular-calendar';
import { HivClinicFlowResourceService } from '../etl-api/hiv-clinic-flow-resource.service';
import { CacheModule } from 'ionic-cache';
import { SelectDepartmentService } from './../shared/services/select-department.service';
import { DataEntryStatisticsModule } from '../data-entry-statistics/data-entry-statistics.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PocHttpInteceptor } from '../shared/services/poc-http-interceptor';
import { RegistersDashboardComponent } from './registers-dashboard.component';
import { RegistersDashboardGuard } from './registers-guard.guard';
import { RegistersRoutesFactory } from '../navigation/side-navigation/registers-side-nav/register-side-nav-routes.factory';
import { registersDashboardRouting } from './registers-dashboard-routes';
import { RegistersDashboardService } from './service/registers-dashboard.service';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    registersDashboardRouting,
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
    CalendarModule.forRoot(),
    AgGridModule.withComponents([]),
    NgxMyDatePickerModule.forRoot(),
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    CacheModule,
    DataEntryStatisticsModule
  ],
  declarations: [RegistersDashboardComponent],
  providers: [
    RegistersDashboardGuard,
    RegistersDashboardService,
    SelectDepartmentService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true
    },
    RegistersRoutesFactory
  ],
  exports: []
})
export class RegistersModule {}
