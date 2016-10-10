import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
const clinicDashboardRoutes: Routes = [
  { path: '', component: ClinicDashboardComponent },
  {
    path: ':location_uuid', component: ClinicDashboardComponent,
    children: [
      { path: '', redirectTo: 'daily-schedule', pathMatch: 'full' },
      { path: 'daily-schedule', component: DailyScheduleComponent },
    ]
  }
];
export const clinicDashboardRouting: ModuleWithProviders = RouterModule.forChild(clinicDashboardRoutes);
