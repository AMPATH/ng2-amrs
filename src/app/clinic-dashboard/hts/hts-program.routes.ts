import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HTSDailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { DailyScheduleVisitsComponent } from '../../clinic-schedule-lib/daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent } from '../../clinic-schedule-lib/daily-schedule/daily-schedule-appointments.component';
import { DailyScheduleNotReturnedComponent } from '../../clinic-schedule-lib/daily-schedule/daily-schedule-not-returned.component';
import { DailyScheduleClinicFlowComponent } from './clinic-flow/daily-schedule-clinic-flow.component';
import { ClinicFlowVisitsComponent } from '../../hiv-care-lib/clinic-flow/clinic-flow-visits.component';
import { ClinicFlowLocationStatsComponent } from '../../hiv-care-lib/clinic-flow/clinic-flow-location-stats.component';
import { ClinicFlowProviderStatsComponent } from '../../hiv-care-lib/clinic-flow/clinic-flow-provider-stats.component';
import { ClinicFlowSummaryComponent } from '../../hiv-care-lib/clinic-flow/clinic-flow-summary.component';
import { ChangeDepartmentComponent } from '../change-department/change-department.component';
import { HtsMonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
const routes: Routes = [
  {
    path: 'daily-schedule',
    component: HTSDailyScheduleComponent,
    children: [
      { path: '', redirectTo: 'daily-appointments', pathMatch: 'prefix' },
      { path: 'daily-visits', component: DailyScheduleVisitsComponent },
      {
        path: 'daily-appointments',
        component: DailyScheduleAppointmentsComponent
      },
      {
        path: 'daily-not-returned',
        component: DailyScheduleNotReturnedComponent
      },
      {
        path: 'clinic-flow',
        component: DailyScheduleClinicFlowComponent,
        children: [
          { path: 'visits', component: ClinicFlowVisitsComponent },
          { path: 'summary', component: ClinicFlowSummaryComponent },
          {
            path: 'provider-stats',
            component: ClinicFlowProviderStatsComponent
          },
          { path: 'location', component: ClinicFlowLocationStatsComponent },
          { path: '', redirectTo: 'summary', pathMatch: 'prefix' }
        ]
      }
    ]
  },
  {
    path: 'monthly-schedule',
    component: HtsMonthlyScheduleComponent
  },
  {
    path: 'department-select',
    component: ChangeDepartmentComponent
  }
];

export const htsProgramRouting: ModuleWithProviders = RouterModule.forChild(
  routes
);
