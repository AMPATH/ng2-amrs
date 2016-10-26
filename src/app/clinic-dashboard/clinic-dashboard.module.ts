import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { clinicDashboardRouting } from './clinic-dashboard-routing.module';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { ClinicDashboardComponent } from './clinic-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    clinicDashboardRouting
  ],
  declarations: [
    DailyScheduleComponent,
    ClinicDashboardComponent
  ],
  providers: [
    ClinicDashboardGuard
  ],
  exports: [
    DailyScheduleComponent,
    ClinicDashboardComponent
  ],
})
export class ClinicDashboardModule {
}
