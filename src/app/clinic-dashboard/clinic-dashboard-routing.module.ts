import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { AuthGuard } from '../shared/guards/auth.guard';
const clinicDashboardRoutes: Routes = [
  { path: 'daily-schedule', component: DailyScheduleComponent, canActivate: [AuthGuard] },
  {
    path: ':location_uuid', component: ClinicDashboardComponent,
    children: [
      { path: 'daily-schedule', component: DailyScheduleComponent },
      { path: 'monthly-schedule', component: MonthlyScheduleComponent },
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
