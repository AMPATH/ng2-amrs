import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { clinicDashboardRouting } from './clinic-dashboard-routing';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
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

  ]
})
export class ClinicDashboardModule { }
