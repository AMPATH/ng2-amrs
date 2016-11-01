import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { clinicDashboardRouting } from './clinic-dashboard-routing.module';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    clinicDashboardRouting
  ],
  declarations: [
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    ClinicDashboardComponent
  ],
  providers: [
    ClinicDashboardGuard
  ],
  exports: [
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    ClinicDashboardComponent
  ],
})
export class ClinicDashboardModule {
}
