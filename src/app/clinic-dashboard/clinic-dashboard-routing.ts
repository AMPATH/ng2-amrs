import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { VisualizationComponent } from './clinical-summary-visualization/visualization-component';
import { ClinicLabOrdersComponent } from './clinic-lab-orders/clinic-lab-orders.component';
import { VisualizationPatientListComponent } from './clinical-summary-visualization/visualization-patient-list/visualization.patient-list.component';
import { ClinicFlowSummaryComponent } from '../hiv-care-lib/clinic-flow/clinic-flow-summary.component';
import { ClinicFlowVisitsComponent } from '../hiv-care-lib/clinic-flow/clinic-flow-visits.component';
import { PatientStatusChangeVisualizationContainerComponent } from './patient-status-change-visualization/patient-status-change-visualization.container.component';
import { PatientStatusChangeListComponent } from './patient-status-change-visualization/patient-status-change-list.component';
import { ClinicFlowLocationStatsComponent } from '../hiv-care-lib/clinic-flow/clinic-flow-location-stats.component';
import { ClinicFlowProviderStatsComponent } from '../hiv-care-lib/clinic-flow/clinic-flow-provider-stats.component';
import { DailyScheduleClinicFlowComponent } from './hiv/clinic-flow/daily-schedule-clinic-flow.component';
import { PatientsProgramEnrollmentComponent } from '../patients-program-enrollment/patients-program-enrollment.component';
import { ProgramEnrollmentPatientListComponent } from './../patients-program-enrollment/program-enrollent-patient-list.component';

const clinicDashboardRoutes: Routes = [
  {
    path: '',
    component: ClinicDashboardComponent,
    canActivate: [ClinicDashboardGuard]
  },
  {
    path: ':location_uuid',
    component: ClinicDashboardComponent,
    children: [
      {
        path: 'cdm',
        loadChildren: () =>
          System.import('./cdm/cdm-program.module').then((mod) => mod.CdmModule)
      },
      {
        path: 'general',
        loadChildren: () =>
          System.import('./general/general.module').then(
            (mod) => mod.GeneralModule
          )
      },
      {
        path: 'hiv',
        loadChildren: () =>
          System.import('./hiv/hiv-program.module').then(
            (mod) => mod.HivProgramModule
          )
      },
      {
        path: 'referral',
        loadChildren: () =>
          System.import('./referral/patient-referral-program.module').then(
            (mod) => mod.PatientReferralProgramModule
          )
      },
      {
        path: 'hemato-oncology',
        loadChildren: () =>
          System.import('./hemato-oncology/oncology-program.module').then(
            (mod) => mod.OncologyProgramModule
          )
      },
      {
        path: 'mnch',
        loadChildren: () =>
          System.import('./mnch/mnch-program.module').then(
            (mod) => mod.MNCHModule
          )
      },
      {
        path: 'hts',
        loadChildren: () =>
          System.import('./hts/hts-program.module').then((mod) => mod.HTSModule)
      },
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'prefix'
      }
    ],
    canActivate: [ClinicDashboardGuard]
  }
];
export const clinicDashboardRouting: ModuleWithProviders = RouterModule.forChild(
  clinicDashboardRoutes
);
