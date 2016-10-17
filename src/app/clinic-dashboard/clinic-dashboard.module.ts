import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { clinicDashboardRouting } from './clinic-dashboard-routing';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    clinicDashboardRouting
  ],
  declarations: [
    DailyScheduleComponent
  ],
  providers: [
    ClinicDashboardGuard
  ]
})
export class ClinicDashboardModule { }
