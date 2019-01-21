import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule , MatSlideToggleModule
// } from '@angular/material';

import {
  DateTimePickerModule
} from 'ngx-openmrs-formentry/dist/ngx-formentry/';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { AdminDashboardClinicFlowComponent } from './clinic-flow/admin-dashboard-clinic-flow';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { dataAnalyticsDashboardHivRouting } from './data-analytics-hiv.routes';
import { KibanaLibModule } from '../../kibana-lib';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { HivSummaryIndicatorsComponent } from './hiv-summary-indicators/hiv-summary-indicators';
import {
  HivCareComparativeAnalyticsComponent
} from './hiv-data-visualization/hiv-overview-visualization';
import { DataAnalyticsDashboardService } from '../services/data-analytics-dashboard.services';
import { HivClinicFlowResourceService } from '../../etl-api/hiv-clinic-flow-resource.service';
import { ClinicFlowCacheService } from '../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
import { DataAnalyticsDashboardComponent } from '../data-analytics.component';
import {
  HivSummaryMonthlyIndicatorsComponent
} from './hiv-summary-monthly-indicators/hiv-summary-monthly-indicators';
import {
  Moh731ReportComponent
} from './moh-731/moh-731-report.component';
import {
  PatientsProgramEnrollmentComponent
} from '../../patients-program-enrollment/patients-program-enrollment.component';
import {
  PatientProgramEnrollmentModule
} from '../../patients-program-enrollment/patients-program-enrollment.module';
import {
  DataEntryStatisticsModule
} from './../../data-entry-statistics/data-entry-statistics.module';
import {
  Moh731MonthlyVizComponent
} from './moh-731-monthly-viz/moh-731-monthly-viz.component';
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
    KibanaLibModule
  ],
  exports: [
    RouterModule,
    DataAnalyticsDashboardComponent,
    AdminDashboardClinicFlowComponent,
    HivSummaryIndicatorsComponent,
    HivCareComparativeAnalyticsComponent
  ],
  declarations: [
    DataAnalyticsDashboardComponent,
    AdminDashboardClinicFlowComponent,
    AdminDashboardClinicFlowComponent,
    HivSummaryIndicatorsComponent,
    Moh731ReportComponent,
    Moh731MonthlyVizComponent,
    HivCareComparativeAnalyticsComponent,
    HivSummaryMonthlyIndicatorsComponent],
  providers: [
    DataAnalyticsDashboardService,
    HivClinicFlowResourceService,
    ClinicFlowCacheService
  ],
})
export class DataAnalyticsHivModule { }
