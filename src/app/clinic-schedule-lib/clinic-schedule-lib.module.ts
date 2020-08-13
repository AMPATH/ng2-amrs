import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule,
//   MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule, MatDatepickerToggle
// } from '@angular/material';
import { CalendarModule } from 'angular-calendar';
import { ClinicDashboardCacheService } from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import {
  DateTimePickerModule
} from 'ngx-openmrs-formentry/';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { EtlApi } from '../etl-api/etl-api.module';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { MonthlyScheduleBaseComponent } from './monthly-schedule/monthly-schedule.component';
import { DailyScheduleBaseComponent } from './daily-schedule/daily-schedule.component';
import { DailyScheduleVisitsComponent
} from './daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent
} from './daily-schedule/daily-schedule-appointments.component';
import { DailyScheduleNotReturnedComponent
} from './daily-schedule/daily-schedule-not-returned.component';
import {
  ProgramVisitEncounterSearchModule
} from '../program-visit-encounter-search/program-visit-encounter-search.module';
@NgModule({
  imports: [
    DateTimePickerModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    // MatTabsModule,
    // MatProgressSpinnerModule,
    // MatProgressBarModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatSlideToggleModule,
    ProgramVisitEncounterSearchModule,
    NgamrsSharedModule,
    CalendarModule,
    RouterModule,
    NgxMyDatePickerModule.forRoot()
  ],
  exports: [
    EtlApi,
    DailyScheduleBaseComponent,
    MonthlyScheduleBaseComponent,
    DailyScheduleAppointmentsComponent,
    DailyScheduleVisitsComponent,
    DailyScheduleNotReturnedComponent
  ],
  declarations: [
    DailyScheduleBaseComponent,
    MonthlyScheduleBaseComponent,
    DailyScheduleAppointmentsComponent,
    DailyScheduleVisitsComponent,
    DailyScheduleNotReturnedComponent
  ],
  providers: [
    ClinicDashboardCacheService
  ]
})
export class ClinicScheduleLibModule { }
