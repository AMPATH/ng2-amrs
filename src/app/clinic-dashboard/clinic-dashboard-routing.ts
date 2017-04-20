import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { VisualizationComponent } from './clinical-summary-visualization/visualization-component';
import { ClinicLabOrdersComponent } from './clinic-lab-orders/clinic-lab-orders.component';
import { DailyScheduleVisitsComponent } from './daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent }
  from './daily-schedule/daily-schedule-appointments.component';
import { DailyScheduleNotReturned } from './daily-schedule/daily-schedule-not-returned.component';
import { DefaulterListComponent } from './defaulter-list/defaulter-list.component';
import {
  VisualizationPatientListComponent
} from
'./clinical-summary-visualization/visualization-patient-list/visualization.patient-list.component';
import { HivProgramModule } from './hiv/hiv-program.module';
import { ClinicFlowComponent } from '../clinic-flow/clinic-flow.component';
import { ClinicFlowSummaryComponent } from '../clinic-flow/clinic-flow-summary.component';
import { ClinicFlowVisitsComponent } from '../clinic-flow/clinic-flow-visits.component';
import {
  PatientStatusChangeVisualizationContainerComponent
} from
  './patient-status-change-visualization/patient-status-change-visualization.container.component';
import {
  PatientStatusChangeListComponent
} from
  './patient-status-change-visualization/patient-status-change-list.component';
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
          {
            path: 'clinic-flow', component: ClinicFlowComponent,
            children: [
              { path: 'visits', component: ClinicFlowVisitsComponent },
              { path: 'summary', component: ClinicFlowSummaryComponent },
              { path: '', redirectTo: 'summary', pathMatch: 'prefix' }

            ]
          },
          { path: '', redirectTo: 'daily-appointments', pathMatch: 'prefix' },
        ]

      },
      { path: 'monthly-schedule', component: MonthlyScheduleComponent },
      {
        path: 'visualization',
        children: [
          {
            path: '',
            component: VisualizationComponent
          },
          {
            path: 'patient-list/:report/:indicator/:period',
            component: VisualizationPatientListComponent
          }
        ]
      },
      {
        path: 'patient-status-change-visualization',
        children: [
          {
            path: '',
            component: PatientStatusChangeVisualizationContainerComponent
          },
          {
            path: 'patient-list',
            component: PatientStatusChangeListComponent
          }
        ]
      },
      { path: 'clinic-lab-orders', component: ClinicLabOrdersComponent },
      { path: 'defaulter-list', component: DefaulterListComponent },
      {
        path: 'hiv', loadChildren: () =>
          System.import('./hiv/hiv-program.module')
            .then(mod => mod.HivProgramModule)
      },
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
