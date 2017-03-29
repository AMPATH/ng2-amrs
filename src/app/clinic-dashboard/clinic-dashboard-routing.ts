import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { VisualizationComponent } from './clinical-summary-visualization/visualization-component';
import { ClinicLabOrdersComponent } from './clinic-lab-orders/clinic-lab-orders.component';
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
        path: 'daily-schedule', component: DailyScheduleComponent
      },
      { path: 'monthly-schedule', component: MonthlyScheduleComponent },
      {
        path: 'visualization', component: VisualizationComponent
      },
      { path: 'clinic-lab-orders', component: ClinicLabOrdersComponent },
      { path: '', redirectTo: 'daily-schedule', pathMatch: 'prefix' },
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
