import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MdProgressSpinnerModule, MdProgressBarModule, MdTabsModule , MdSlideToggleModule
} from '@angular/material';

import { oncologyProgramRouting } from './oncology-program.routes';
import {
  DateTimePickerModule
} from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { AdminDashboardClinicFlowComponent } from './clinic-flow/admin-dashboard-clinic-flow';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { dataAnalyticsDashboardHivRouting } from './hiv-program.routes';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { HivSummaryIndicatorsComponent } from './hiv-summary-indicators/hiv-summary-indicators';
import { HivCareComparativeAnalyticsComponent
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
import { PatientsProgramEnrollmentComponent } from
'../../patients-program-enrollment/patients-program-enrollment.component';
import { PatientProgramEnrollmentModule } from
'../../patients-program-enrollment/patients-program-enrollment.module';
import { DataEntryStatisticsModule } from
'./../../data-entry-statistics/data-entry-statistics.module';

import { CdmSummaryIndicatorsComponent } from
'./../cdm/cdm-summary-indicators/cdm-summary-indicators.component';
import { CdmSummaryMonthlyIndicatorsComponent }
from './../cdm/cdm-summary-monthly-indicators/cdm-summary-monthly-indicators.component';
import { CdmSummaryIndicatorsResourceService }
from './../../etl-api/cdm-summary-indicators-resource.service';
import { CdmsummaryIndicatorsPatientListComponent }
from './../cdm/cdm-summary-indicators-patient-list/cdm-summary-indicators-patient-list.component';
import { CdmSummaryMonthlyTableComponent }
from './../cdm/cdm-summary-indicators-table/cdm-summary-monthly-indicators-table.component';
import { AgGridModule } from 'ag-grid-angular/main';
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
    MdTabsModule,
    DataEntryStatisticsModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MdSlideToggleModule,
    PatientProgramEnrollmentModule,
    AgGridModule
  ],
  exports: [
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
    HivCareComparativeAnalyticsComponent,
    HivSummaryMonthlyIndicatorsComponent,
    CdmSummaryMonthlyIndicatorsComponent,
    CdmsummaryIndicatorsPatientListComponent,
    CdmSummaryIndicatorsComponent,
    CdmSummaryMonthlyTableComponent
  ],
  providers: [
    DataAnalyticsDashboardService,
    HivClinicFlowResourceService,
    CdmSummaryIndicatorsResourceService,
    ClinicFlowCacheService
  ],
})
export class DataAnalyticsHivProgramModule { }
