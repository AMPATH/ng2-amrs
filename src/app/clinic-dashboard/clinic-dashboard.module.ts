import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Angulartics2Module } from 'angulartics2';

import { CalendarModule } from 'angular-calendar';


import { clinicDashboardRouting } from './clinic-dashboard-routing';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';

import { TabViewModule, FieldsetModule, ButtonModule, GrowlModule } from 'primeng/primeng';
import { ReportingUtilities } from '../reporting-utilities/reporting-utilities.module';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';
import { SelectModule } from 'angular2-select';
import { BusyModule } from 'angular2-busy';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    clinicDashboardRouting,
    ReportingUtilities,
    TabViewModule,
    FieldsetModule,
    ButtonModule,
    GrowlModule,
    OpenmrsApi,
    SelectModule,
    Angulartics2Module.forChild(),
    BusyModule,
    CalendarModule.forRoot()
  ],
  declarations: [
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    ClinicDashboardComponent
  ],
  providers: [
    ClinicDashboardGuard,
    ClinicDashboardCacheService
  ],
  exports: [
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    ClinicDashboardComponent
  ],
})
export class ClinicDashboardModule {
}
