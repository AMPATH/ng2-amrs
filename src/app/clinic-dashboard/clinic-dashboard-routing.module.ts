import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard'
const clinicDashboardRoutes: Routes = [
  { path: 'clinic-dashboard', component: ClinicDashboardComponent },
  {
    path: 'clinic-dashboard/:location_uuid', component: ClinicDashboardComponent,
    children: [
      { path: '', redirectTo: 'daily-schedule', pathMatch: 'full' },
      { path: 'daily-schedule', component: DailyScheduleComponent },
    ],
    canActivate: [
      ClinicDashboardGuard
    ],
    canDeactivate: [
      ClinicDashboardGuard
    ]
  }
];
export const clinicDashboardRouting: ModuleWithProviders = RouterModule.forChild(clinicDashboardRoutes);
