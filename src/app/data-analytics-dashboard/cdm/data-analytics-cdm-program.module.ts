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
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { dataAnalyticsDashboardCdmRouting } from './cdm-program.routes';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { HivCareComparativeAnalyticsComponent
} from './hiv-data-visualization/hiv-overview-visualization';
import { DataAnalyticsDashboardService } from '../services/data-analytics-dashboard.services';
import { HivClinicFlowResourceService } from '../../etl-api/hiv-clinic-flow-resource.service';
import { ClinicFlowCacheService } from '../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
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
'./cdm-summary-indicators/cdm-summary-indicators.component';
import { CdmSummaryMonthlyIndicatorsComponent }
from './cdm-summary-monthly-indicators/cdm-summary-monthly-indicators.component';
import { CdmSummaryIndicatorsResourceService }
from './../../etl-api/cdm-summary-indicators-resource.service';
import { CdmsummaryIndicatorsPatientListComponent }
from './cdm-summary-indicators-patient-list/cdm-summary-indicators-patient-list.component';
import { CdmSummaryMonthlyTableComponent }
from './cdm-summary-indicators-table/cdm-summary-monthly-indicators-table.component';

@NgModule({
  imports: [
    dataAnalyticsDashboardCdmRouting,
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
    PatientProgramEnrollmentModule
  ],
  exports: [
    CdmSummaryMonthlyIndicatorsComponent,
    CdmsummaryIndicatorsPatientListComponent,
    CdmSummaryIndicatorsComponent,
    CdmSummaryMonthlyTableComponent
  ],
  declarations: [
    CdmSummaryMonthlyIndicatorsComponent,
    CdmsummaryIndicatorsPatientListComponent,
    CdmSummaryIndicatorsComponent,
    CdmSummaryMonthlyTableComponent
  ],
  providers: [
    DataAnalyticsDashboardService,
    HivClinicFlowResourceService,
    ClinicFlowCacheService,
    CdmSummaryIndicatorsResourceService
  ],
})
export class DataAnalyticsCdmProgramModule { }
