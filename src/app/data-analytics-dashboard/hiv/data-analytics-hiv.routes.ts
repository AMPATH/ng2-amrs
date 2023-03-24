import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HivSummaryIndicatorComponent } from './hiv-summary-indicators/hiv-summary-indicator.component';
import { HivSummaryIndicatorsPatientListComponent } from '../../hiv-care-lib/hiv-summary-indicators/patient-list.component';
import { HivCareComparativeComponent } from './hiv-visualization/hiv-care-overview.component';
import { VisualizationPatientListComponent } from '../../hiv-care-lib/hiv-visualization/visualization-patient-list.component';
import { AdminDashboardClinicFlowComponent } from './clinic-flow/admin-dashboard-clinic-flow';
import { HivCareComparativeAnalyticsComponent } from './hiv-data-visualization/hiv-overview-visualization';
import { HivSummaryIndicatorsComponent } from './hiv-summary-indicators/hiv-summary-indicators';
import { DataAnalyticsDashboardComponent } from '../data-analytics.component';
import { DataAnalyticsDashboardGuard } from '../data-analytics-guard';
import { HivSummaryMonthlyIndicatorsComponent } from './hiv-summary-monthly-indicators/hiv-summary-monthly-indicators';
import { HivMonthlySummaryIndicatorsPatientListComponent } from '../../hiv-care-lib/hiv-monthly-summary-indicators/patient-list.component';
import { PatientsProgramEnrollmentComponent } from '../../patients-program-enrollment/patients-program-enrollment.component';
import { ProgramEnrollmentPatientListComponent } from './../../patients-program-enrollment/program-enrollent-patient-list.component';
import { DataEntryStatisticsComponent } from './../../data-entry-statistics/data-entry-statistics.component';
import { DataEntryStatisticsPatientListComponent } from './../../data-entry-statistics/data-entry-statistics-patient-list.component';
import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import { Moh731PatientListComponent } from './../../hiv-care-lib/moh-731-report/moh-731-patientlist.component';
import { ChangeDepartmentComponent } from '../change-department/change-department.component';
import { Moh731MonthlyVizComponent } from './moh-731-monthly-viz/moh-731-monthly-viz.component';
import { DashboardsViewerComponent } from '../../kibana-lib';
import { SurgeReportComponent } from './surge/surge-report.component';
import { SurgeReportPatientListComponent } from 'src/app/hiv-care-lib/surge-report/surge-report-patient-list.component';
import { DqaReportsComponent } from 'src/app/hiv-care-lib/dqa-reports/dqa-reports/dqa-reports.component';
// tslint:disable-next-line:max-line-length
import { ChartAbstractionPatientlistComponent } from 'src/app/hiv-care-lib/dqa-reports/chart-abstraction-patientlist/chart-abstraction-patientlist.component';
import { DqaReportBaseComponent } from 'src/app/hiv-care-lib/dqa-reports/dqa-report-base/dqa-report-base.component';
import { PrepReportPatientListComponent } from './../../hiv-care-lib/prep-report/prep-report-patient-list/prep-report-patient-list.component';
import { PrepReportComponent } from './prep-report/prep-report.component';
import { DataAnalyticsMonthlyReportComponent } from './monthly-reports-dashboard/data-analytics-monthly-reports.component';
import { MOH412HIVDataAnalyticsComponent } from './moh-412-report/moh-412-hiv-data-analytics.component';
import { MOH412HIVDataAnalyticsPatientListComponent } from './moh-412-report/moh-412-hiv-data-analytics-patient-list.component';
import { IptReportPatientListComponent } from 'src/app/hiv-care-lib/ipt-report/ipt-report-patient-list.component';
import { IPTReportComponent } from './ipt-report/ipt-report.component';
import { ClinicFlowProviderStatsPatientListComponent } from './../../hiv-care-lib/clinic-flow/clinic-flow-provider-stats-patient-list.component';
import { DataAnalyticsHivGainsAndLossesComponent } from './hiv-monthly-gains-and-losses/data-analytics-hiv-gains-and-losses.component';
import { PatientGainsAndLosesPatientListComponent } from './../../hiv-care-lib/patient-gains-and-loses/patient-gains-and-loses-patient-list/patient-gains-and-loses-patient-list.component';
import { ContactTestingComponent } from './contact-testing/contact-testing/contact-testing.component';

const routes: Routes = [
  {
    path: 'clinic-flow',
    children: [
      {
        path: '',
        component: AdminDashboardClinicFlowComponent
      },
      {
        path: 'patient-list',
        component: ClinicFlowProviderStatsPatientListComponent
      }
    ]
  },
  {
    path: 'program-enrollment',
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
    path: 'hiv-comparative-chart-analytics',
    children: [
      {
        path: '',
        component: HivCareComparativeAnalyticsComponent
      },
      {
        path: 'patient-list/:report/:indicator/:period',
        component: VisualizationPatientListComponent
      }
    ]
  },
  {
    path: 'hiv-summary-indicator-report',
    children: [
      {
        path: '',
        component: HivSummaryIndicatorsComponent
      },
      {
        path: 'patient-list/:indicator/:period/:gender/:age/:locationUuids',
        component: HivSummaryIndicatorsPatientListComponent
      }
    ]
  },
  {
    path: 'moh-731-report',
    children: [
      {
        path: '',
        component: Moh731ReportComponent
      },
      {
        path: 'patient-list',
        component: Moh731PatientListComponent
      }
    ]
  },
  {
    path: 'moh-731-monthly-viz',
    children: [
      {
        path: '',
        component: Moh731MonthlyVizComponent
      }
    ]
  },
  {
    path: 'hiv-viz',
    children: [
      {
        path: '',
        component: DashboardsViewerComponent
      }
    ]
  },
  // {
  //   path: 'hiv-summary-monthly-indicator-report',
  //   children: [
  //     {
  //       path: '',
  //       component: HivSummaryMonthlyIndicatorsComponent
  //     },
  //     {
  //       path: 'patient-list/:indicator/:period/:gender/:age/:locationUuids',
  //       component: HivMonthlySummaryIndicatorsPatientListComponent,
  //     }
  //   ]
  // },
  {
    path: 'data-entry-statistics',
    children: [
      {
        path: '',
        component: DataEntryStatisticsComponent
      },
      {
        path: 'patient-list',
        component: DataEntryStatisticsPatientListComponent
      }
    ]
  },
  {
    path: 'select-department',
    component: ChangeDepartmentComponent
  },
  {
    path: 'surge',
    children: [
      {
        path: 'surge-report-patientlist',
        component: SurgeReportPatientListComponent
      },
      {
        path: '',
        component: SurgeReportComponent
      }
    ]
  },
  {
    path: 'monthly-report',
    children: [
      {
        path: '',
        component: DataAnalyticsMonthlyReportComponent
      },
      {
        path: 'prep-report',
        children: [
          {
            path: '',
            component: PrepReportComponent
          },
          {
            path: 'patient-list',
            component: PrepReportPatientListComponent
          }
        ]
      },
      {
        path: 'moh-412-report',
        children: [
          {
            path: '',
            component: MOH412HIVDataAnalyticsComponent
          },
          {
            path: 'patient-list',
            component: MOH412HIVDataAnalyticsPatientListComponent
          }
        ]
      },
      {
        path: 'ipt-report',
        children: [
          {
            path: '',
            component: IPTReportComponent
          },
          {
            path: 'ipt-report-patientlist',
            component: IptReportPatientListComponent
          }
        ]
      },
      {
        path: 'patient-gains-and-losses',
        children: [
          {
            path: '',
            component: DataAnalyticsHivGainsAndLossesComponent
          },
          {
            path: 'patient-list',
            component: PatientGainsAndLosesPatientListComponent
          }
        ]
      }
    ]
  },
  {
    path: 'dqa',
    children: [
      {
        path: 'dqa-filter',
        children: [
          {
            path: '',
            component: DqaReportBaseComponent
          },
          {
            path: 'dqa-report-patientlist',
            component: ChartAbstractionPatientlistComponent
          }
        ]
      },
      {
        path: '',
        component: DqaReportsComponent,
        data: { multipleLocation: true }
      }
    ]
  },
  {
    path: 'family-testing',
    children: [
      {
        path: '',
        component: ContactTestingComponent
      }
    ]
  }
];

export const dataAnalyticsDashboardHivRouting: ModuleWithProviders = RouterModule.forChild(
  routes
);
