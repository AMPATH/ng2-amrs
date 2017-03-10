import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Angulartics2Module } from 'angulartics2';

import { CalendarModule } from 'angular-calendar';

import {
  DailyScheduleResourceService
} from
  '../etl-api/daily-scheduled-resource.service';
import { clinicDashboardRouting } from './clinic-dashboard-routing';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { DailyScheduleVisitsComponent } from './daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent }
  from './daily-schedule/daily-schedule-appointments.component';
import { DailyScheduleNotReturned } from './daily-schedule/daily-schedule-not-returned.component';
import {
  DefaulterListResourceService
} from
  '../etl-api/defaulter-list-resource.service';
import { DefaulterListComponent } from './defaulter-list/defaulter-list.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';

import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';

import { TabViewModule, FieldsetModule, ButtonModule, GrowlModule } from 'primeng/primeng';
import { ReportingUtilities } from '../reporting-utilities/reporting-utilities.module';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';
import { SelectModule } from 'angular2-select';
import { BusyModule } from 'angular2-busy';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataListsModule } from '../data-lists/data-lists.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { MdTabsModule } from '@angular/material';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataListsModule,
    clinicDashboardRouting,
    ReportingUtilities,
    TabViewModule,
    FieldsetModule,
    ButtonModule,
    GrowlModule,
    OpenmrsApi,
    SelectModule,
    Angulartics2Module.forChild(),
    NgamrsSharedModule,
    BusyModule,
    CalendarModule.forRoot(),
    AgGridModule.withComponents([]),
    NgamrsSharedModule,
    NgxMyDatePickerModule,
    MdTabsModule.forRoot()
  ],
  declarations: [
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    ClinicDashboardComponent,
    DailyScheduleAppointmentsComponent,
    DailyScheduleNotReturned,
    DailyScheduleVisitsComponent,
    DefaulterListComponent
  ],
  providers: [
    ClinicDashboardGuard,
    DailyScheduleResourceService,
    ClinicDashboardCacheService,
    DefaulterListResourceService
  ]
  ,
  exports: [
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    ClinicDashboardComponent,
    DailyScheduleAppointmentsComponent,
    DailyScheduleNotReturned,
    DailyScheduleVisitsComponent,
    ClinicDashboardComponent,
    DefaulterListComponent
  ],
})
export class ClinicDashboardModule {
}
