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
import { TxReportsDashboardComponent } from './tx-reports-dashboard/tx-reports-dashboard.component';
import { TxMlReportComponent } from './tx-ml-report/tx-ml-report.component';
import { TxNewReportComponent } from './datim-reports/tx-new-report/tx-new-report.component';
import { TxCurrReportComponent } from './datim-reports/tx-curr-report.component';
import { TxMmdReportComponent } from './datim-reports/tx-mmd-report.component';
import { TxRttReportComponent } from './datim-reports/tx-rtt-report.component';
import { AhdReportComponent } from './ahd-report/ahd-report.component';
import { PlhivNcdV2ReportComponent } from './plhiv-ncd-v2-report/plhiv-ncd-v2-report.component';
import { RegistersComponent } from './registers/registers.component';
import { HeiRegisterComponent } from './registers/hei-register/hei-register.component';
import { AncRegisterComponent } from './registers/anc-register/anc-register.component';
import { NutritionRegisterComponent } from './registers/nutrition-register/nutrition-register.component';
import { MaternityRegisterComponent } from './registers/maternity-register/maternity-register.component';
import { HtsrefferallinkageRegisterComponent } from './registers/htsrefferallinkage-register/htsrefferallinkage-register.component';
import { PncRegisterComponent } from './registers/pnc-register/pnc-register.component';
import { DefaultertracingRegisterComponent } from './registers/defaultertracing-register/defaultertracing-register.component';
import { PrepdailyRegisterComponent } from './registers/prepdaily-register/prepdaily-register.component';
import { CntdailyRegisterComponent } from './registers/cntdaily-register/cntdaily-register.component';

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
    DataAnalyticsMonthlyReportComponent,
    TxReportsDashboardComponent
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
    ContactTestingComponent,
    TxReportsDashboardComponent,
    TxMlReportComponent,
    TxNewReportComponent,
    TxCurrReportComponent,
    TxMmdReportComponent,
    TxRttReportComponent,
    PlhivNcdV2ReportComponent,
    AhdReportComponent,
    RegistersComponent,
    HeiRegisterComponent,
    AncRegisterComponent,
    NutritionRegisterComponent,
    MaternityRegisterComponent,
    HtsrefferallinkageRegisterComponent,
    PncRegisterComponent,
    DefaultertracingRegisterComponent,
    PrepdailyRegisterComponent,
    CntdailyRegisterComponent
  ],
  providers: [
    DataAnalyticsDashboardService,
    HivClinicFlowResourceService,
    ClinicFlowCacheService
  ]
})
export class DataAnalyticsHivModule {}
