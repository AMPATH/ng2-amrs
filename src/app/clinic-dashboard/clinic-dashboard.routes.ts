import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { VisualizationComponent } from './clinical-summary-visualization/visualization-component';
import { ClinicLabOrdersComponent } from './clinic-lab-orders/clinic-lab-orders.component';
import { DailyScheduleVisitsComponent } from './daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent }
  from './daily-schedule/daily-schedule-appointments.component';
import { DailyScheduleNotReturnedComponent
} from './daily-schedule/daily-schedule-not-returned.component';

import {
  PatientStatusChangeVisualizationContainerComponent
} from
  './patient-status-change-visualization/patient-status-change-visualization.container.component';
import {
  VisualizationPatientListComponent
} from
'./clinical-summary-visualization/visualization-patient-list/visualization.patient-list.component';
import {
  PatientStatusChangeListComponent
} from
  './patient-status-change-visualization/patient-status-change-list.component';
import { DefaulterListComponent } from './defaulter-list/defaulter-list.component';

import { ClinicFlowSummaryComponent
} from '../hiv-care-lib/clinic-flow/clinic-flow-summary.component';
import { ClinicFlowVisitsComponent
} from '../hiv-care-lib/clinic-flow/clinic-flow-visits.component';
import {
  ClinicFlowLocationStatsComponent
} from '../hiv-care-lib/clinic-flow/clinic-flow-location-stats.component';
import {
  ClinicFlowProviderStatsComponent
} from '../hiv-care-lib/clinic-flow/clinic-flow-provider-stats.component';
import { DailyScheduleClinicFlowComponent
} from './hiv/clinic-flow/daily-schedule-clinic-flow.component';

export const routes = [
  {
    path: '',
    children: [
      { path: '', component: ClinicDashboardComponent },
      {
        path: ':location_uuid', component: ClinicDashboardComponent,
        canActivate: [
          ClinicDashboardGuard
        ],
         canDeactivate: [
          ClinicDashboardGuard
        ],
        children: [
          {
            path: 'daily-schedule', component: DailyScheduleComponent,
            children: [
              { path: '', redirectTo: 'daily-appointments', pathMatch: 'prefix' },
              { path: 'daily-visits', component: DailyScheduleVisitsComponent },
              { path: 'daily-appointments', component: DailyScheduleAppointmentsComponent },
              { path: 'daily-not-returned', component: DailyScheduleNotReturnedComponent },
              {
                path: 'clinic-flow', component: DailyScheduleClinicFlowComponent,
                children: [
                  { path: 'visits', component: ClinicFlowVisitsComponent },
                  { path: 'summary', component: ClinicFlowSummaryComponent },
                  { path: 'provider-stats', component: ClinicFlowProviderStatsComponent },
                  { path: 'location', component: ClinicFlowLocationStatsComponent },
                  { path: '', redirectTo: 'summary', pathMatch: 'prefix' }

                ]
              },
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
                path: ':view',
                component: PatientStatusChangeVisualizationContainerComponent
              },
              {
                path: ':view/patient-list',
                component: PatientStatusChangeListComponent
              },
              { path: '', redirectTo: 'cumulative', pathMatch: 'prefix' }
            ]
          },
          { path: 'clinic-lab-orders', component: ClinicLabOrdersComponent },
          { path: 'defaulter-list', component: DefaulterListComponent },
          {
            path: 'hiv', loadChildren: './hiv/hiv-program.module#HivProgramModule'
          },
          { path: '', redirectTo: 'daily-schedule', pathMatch: 'prefix' },
        ]
      }
    ]
  },
];
