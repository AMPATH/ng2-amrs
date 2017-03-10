import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { DailyScheduleVisitsComponent } from './daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent }
  from './daily-schedule/daily-schedule-appointments.component';
import { DailyScheduleNotReturned } from './daily-schedule/daily-schedule-not-returned.component';
import { DefaulterListComponent } from './defaulter-list/defaulter-list.component';
const clinicDashboardRoutes: Routes = [
  {
    path: '', component: ClinicDashboardComponent,
    canActivate: [
      ClinicDashboardGuard
    ],
  },
  {
    path: ':location_uuid', component: ClinicDashboardComponent,
    children: [
      {
        path: 'daily-schedule', component: DailyScheduleComponent,
        children: [
          { path: 'daily-visits', component: DailyScheduleVisitsComponent },
          { path: 'daily-appointments', component: DailyScheduleAppointmentsComponent },
          { path: 'daily-not-returned', component: DailyScheduleNotReturned },
          { path: '', redirectTo: 'daily-appointments', pathMatch: 'prefix' },
        ]

      },
      { path: 'monthly-schedule', component: MonthlyScheduleComponent },
      { path: 'defaulter-list', component: DefaulterListComponent },
      { path: '', redirectTo: 'daily-schedule', pathMatch: 'prefix' }
    ],
    canActivate: [
      ClinicDashboardGuard
    ],
    canDeactivate: [
      ClinicDashboardGuard
    ]
  }
];
export const clinicDashboardRouting: ModuleWithProviders =
  RouterModule.forChild(clinicDashboardRoutes);
