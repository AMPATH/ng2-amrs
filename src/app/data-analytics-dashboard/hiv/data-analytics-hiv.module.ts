import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule , MatSlideToggleModule
// } from '@angular/material';

import { DateTimePickerModule } from '@ampath-kenya/ngx-openmrs-formentry';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { AdminDashboardClinicFlowComponent } from './clinic-flow/admin-dashboard-clinic-flow';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { dataAnalyticsDashboardHivRouting } from './data-analytics-hiv.routes';
import { KibanaLibModule } from '../../kibana-lib';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { HivSummaryIndicatorsComponent } from './hiv-summary-indicators/hiv-summary-indicators';
import { HivCareComparativeAnalyticsComponent } from './hiv-data-visualization/hiv-overview-visualization';
import { DataAnalyticsDashboardService } from '../services/data-analytics-dashboard.services';
import { HivClinicFlowResourceService } from '../../etl-api/hiv-clinic-flow-resource.service';
import { ClinicFlowCacheService } from '../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
import { HivSummaryMonthlyIndicatorsComponent } from './hiv-summary-monthly-indicators/hiv-summary-monthly-indicators';
import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import { PatientsProgramEnrollmentComponent } from '../../patients-program-enrollment/patients-program-enrollment.component';
import { PatientProgramEnrollmentModule } from '../../patients-program-enrollment/patients-program-enrollment.module';
import { DataEntryStatisticsModule } from './../../data-entry-statistics/data-entry-statistics.module';
import { ChangeDepartmentModule } from '../change-department/change-department.module';
import { Moh731MonthlyVizComponent } from './moh-731-monthly-viz/moh-731-monthly-viz.component';
import { SurgeReportComponent } from './surge/surge-report.component';
import { ReportingUtilitiesModule } from 'src/app/reporting-utilities/reporting-utilities.module';
import { PrepReportComponent } from './prep-report/prep-report.component';
import { MOH412HIVDataAnalyticsComponent } from './moh-412-report/moh-412-hiv-data-analytics.component';
import { MOH412HIVDataAnalyticsPatientListComponent } from './moh-412-report/moh-412-hiv-data-analytics-patient-list.component';
import { OncologyProgramModule } from './../../oncology-care-lib/oncology-care-lib.module';
import { IPTReportComponent } from './ipt-report/ipt-report.component';
import { DataAnalyticsMonthlyReportComponent } from './monthly-reports-dashboard/data-analytics-monthly-reports.component';
import { DataAnalyticsHivGainsAndLossesComponent } from './hiv-monthly-gains-and-losses/data-analytics-hiv-gains-and-losses.component';
import { ContactTestingComponent } from './contact-testing/contact-testing/contact-testing.component';
import { DialogModule } from 'primeng/primeng';
import { PrepMonthlyReportPatientListComponent } from 'src/app/hiv-care-lib/prep-report/monthly/prep-monthly-patient-list/prep-monthly-report-patient-list.component';

@NgModule({
  imports: [
    dataAnalyticsDashboardHivRouting,
    HivCareLibModule,
    DateTimePickerModule,
    NgamrsSharedModule,
    DataListsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    DataEntryStatisticsModule,
    PatientProgramEnrollmentModule,
    ChangeDepartmentModule,
    KibanaLibModule,
    ReportingUtilitiesModule,
    OncologyProgramModule,
    DialogModule
  ],
  exports: [
    RouterModule,
    AdminDashboardClinicFlowComponent,
    HivSummaryIndicatorsComponent,
    HivCareComparativeAnalyticsComponent,
    MOH412HIVDataAnalyticsComponent,
    MOH412HIVDataAnalyticsPatientListComponent,
    DataAnalyticsMonthlyReportComponent
  ],
  declarations: [
    AdminDashboardClinicFlowComponent,
    AdminDashboardClinicFlowComponent,
    HivSummaryIndicatorsComponent,
    Moh731ReportComponent,
    Moh731MonthlyVizComponent,
    HivCareComparativeAnalyticsComponent,
    HivSummaryMonthlyIndicatorsComponent,
    SurgeReportComponent,
    PrepReportComponent,
    PrepMonthlyReportPatientListComponent,
    MOH412HIVDataAnalyticsComponent,
    MOH412HIVDataAnalyticsPatientListComponent,
    IPTReportComponent,
    DataAnalyticsMonthlyReportComponent,
    DataAnalyticsHivGainsAndLossesComponent,
    ContactTestingComponent
  ],
  providers: [
    DataAnalyticsDashboardService,
    HivClinicFlowResourceService,
    ClinicFlowCacheService
  ]
})
export class DataAnalyticsHivModule {}
