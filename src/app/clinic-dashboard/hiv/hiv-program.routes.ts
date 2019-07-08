import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HivModuleComponent } from './hiv-program.component';
import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import {
    HivSummaryIndicatorComponent
} from './hiv-summary-indicators/hiv-summary-indicator.component';
import {
    HivSummaryIndicatorsPatientListComponent
} from '../../hiv-care-lib/hiv-summary-indicators/patient-list.component';
import {
    PatientsRequiringVLComponent
} from './patients-requiring-vl/patients-requiring-vl.component';
import {
    HivCareComparativeComponent
} from './hiv-visualization/hiv-care-overview.component';
import {
    PatientStatusChangeVisualizationContainerComponent
} from './patient-status-change-visualization/patient-status-change-visualization.container.component';
import { PatientStatusChangeListComponent
} from './patient-status-change-visualization/patient-status-change-list.component';
import {
  VisualizationPatientListComponent
} from '../../hiv-care-lib/hiv-visualization/visualization-patient-list.component';
import { Moh731PatientListComponent
} from './../../hiv-care-lib/moh-731-report/moh-731-patientlist.component';
import {
    HivDailyScheduleComponent
} from './daily-schedule/daily-schedule.component';
import {
    HivMonthlyScheduleComponent
} from './monthly-schedule/monthly-schedule.component';
import { DailyScheduleVisitsComponent
} from '../../clinic-schedule-lib/daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent
} from '../../clinic-schedule-lib/daily-schedule/daily-schedule-appointments.component';
import { DailyScheduleNotReturnedComponent
} from '../../clinic-schedule-lib/daily-schedule/daily-schedule-not-returned.component';
import { DailyScheduleClinicFlowComponent
} from '../hiv/clinic-flow/daily-schedule-clinic-flow.component';
import { ClinicFlowVisitsComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-visits.component';
import {
  ClinicFlowLocationStatsComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-location-stats.component';
import {
  ClinicFlowProviderStatsComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-provider-stats.component';
import { ClinicFlowSummaryComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-summary.component';
import { HivEnhancedComponent } from './hiv-enhanced-program/hiv-enhanced-program.component';
import { DefaulterListComponent } from '../general/defaulter-list/defaulter-list.component';
import { PatientsProgramEnrollmentComponent } from '../../patients-program-enrollment/patients-program-enrollment.component';
import { ProgramEnrollmentPatientListComponent } from '../../patients-program-enrollment/program-enrollent-patient-list.component';
import { ClinicLabOrdersComponent } from '../general/clinic-lab-orders/clinic-lab-orders.component';
import { ChangeDepartmentComponent } from '../change-department/change-department.component';
import {
    Moh731MonthlyVizComponent
} from './moh731-monthly-viz/moh731-monthly-viz.component';
import {
    DashboardsViewerComponent
} from '../../kibana-lib';
import { HivDifferentiatedCareComponent } from './hiv-differentiated-care-program/hiv-differentiated-care-program.component';
import { SurgeReportComponent } from './surge-report/surge-report.component';
import { SurgeReportPatientListComponent } from 'src/app/hiv-care-lib/surge-report/surge-report-patient-list.component';

const routes: Routes = [
    {
        path: 'landing-page',
        component: Moh731ReportComponent // replace with landing page for module
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
    {
        path: 'moh-731-report',
        component: Moh731ReportComponent // replace with landing page for module
    },
    {
        path: 'moh-731-report/patient-list',
        component: Moh731PatientListComponent
    },
    {
        path: 'moh-731-monthly-viz',
        component: Moh731MonthlyVizComponent // replace with landing page for module
    },
    {
        path: 'hiv-viz',
        component: DashboardsViewerComponent
    },
    {
        path: 'hiv-summary-indicator-report',
        children: [
            {
                path: '',
                component: HivSummaryIndicatorComponent
            },
            {
                path: 'patient-list/:indicator/:period/:gender/:age/:locationUuids',
                component: HivSummaryIndicatorsPatientListComponent,
            }
        ]
    },
    {
        path: 'patients-requiring-vl',
        component: PatientsRequiringVLComponent,
    },
    {
        path: 'hiv-comparative-chart',
        children: [
            {
                path: '',
                component: HivCareComparativeComponent
            },
            {
                path: 'patient-list/:report/:indicator/:period',
                component: VisualizationPatientListComponent
            }

        ]

    },
    {
        path: 'daily-schedule',
        component: HivDailyScheduleComponent,
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
            }
          ]
    },
    {
        path: 'monthly-schedule',
        component: HivMonthlyScheduleComponent
    },
    {
        path: 'viremia-reports',
        component: HivEnhancedComponent
    },
    {
        path: 'defaulter-list',
        component: DefaulterListComponent
    },
    {
        path: 'clinic-lab-orders',
        component: ClinicLabOrdersComponent
    },
    { path: 'program-enrollment',
       children: [
        {
            path: '',
            component: PatientsProgramEnrollmentComponent
        },
        {
            path: 'patient-list',
            component: ProgramEnrollmentPatientListComponent
        }
    ]
    },
    {
        path: 'hiv-differentiated-care',
        component: HivDifferentiatedCareComponent
    },
    {
        path: 'department-select',
        component : ChangeDepartmentComponent
    },
    {
        path: 'surge-reports',
        component: SurgeReportComponent
    },
    {
        path: 'surge-reports/surge-report-patientlist',
        component: SurgeReportPatientListComponent
    }
];

export const clinicDashboardHivRouting: ModuleWithProviders =
    RouterModule.forChild(routes);
