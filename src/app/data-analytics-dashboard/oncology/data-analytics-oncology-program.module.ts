import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';

import { DataAnalyticsDashboardOncologyRouting }
from './ data-analytics-dashboard-oncology-routing.routes';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { DataAnalyticsDashboardService } from '../services/data-analytics-dashboard.services';

import { OncologyReportsComponent } from './oncology-reports/oncology-reports.component';
import { OncologyReportService } from '../../etl-api/oncology-reports.service';
import { OncologyMonthlyIndicatorSummaryComponent } from
'./oncology-reports/oncology-monthly-indicators/oncology-monthly-indicators.component';
import { OncologySummaryFiltersComponent } from
'./oncology-reports/oncology-summary-filters/oncology-summary-filters.component';
import { OncolgyMonthlySummaryIndicatorsResourceService }
from '../../etl-api/oncology-summary-indicators-resource.service';
import {  OncologySummaryIndicatorsTableComponent } from
'./oncology-reports/oncology-summary-indicators-table/oncology-summary-indicators-table.component';
import { OncologysummaryIndicatorsPatientListComponent } from
'./oncology-reports/oncology-indicators-patient-list/oncology-indicators-patient-list.component';
import { BusyModule } from 'angular2-busy';

@NgModule({
  imports: [
    DataAnalyticsDashboardOncologyRouting,
    NgamrsSharedModule,
    CommonModule,
    RouterModule,
    FormsModule,
    DataListsModule,
    AgGridModule,
    BusyModule
  ],
  exports: [
    OncologyReportsComponent,
    OncologyMonthlyIndicatorSummaryComponent,
    OncologySummaryFiltersComponent,
    OncologySummaryIndicatorsTableComponent,
    OncologysummaryIndicatorsPatientListComponent
  ],
  declarations: [
    OncologyReportsComponent,
    OncologyMonthlyIndicatorSummaryComponent,
    OncologySummaryFiltersComponent,
    OncologySummaryIndicatorsTableComponent,
    OncologysummaryIndicatorsPatientListComponent
   ],
  providers: [
    DataAnalyticsDashboardService,
    OncologyReportService,
    OncolgyMonthlySummaryIndicatorsResourceService
  ]
})
export class DataAnalyticsOncologyProgramModule { }
