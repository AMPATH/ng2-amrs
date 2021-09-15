import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';

import { DataAnalyticsDashboardOncologyRouting } from './data-analytics-oncology.routes';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { DataAnalyticsDashboardService } from '../services/data-analytics-dashboard.services';

import { OncologyReportsComponent } from './oncology-reports/oncology-reports.component';
import { OncologyReportService } from '../../etl-api/oncology-reports.service';
import { OncologySummaryIndicatorsComponent } from './oncology-reports/oncology-summary-indicators/oncology-summary-indicators.component';
import { OncologySummaryFiltersComponent } from './oncology-reports/oncology-summary-filters/oncology-summary-filters.component';
import { OncologySummaryIndicatorsResourceService } from '../../etl-api/oncology-summary-indicators-resource.service';
import { OncologySummaryIndicatorsTableComponent } from './oncology-reports/oncology-summary-indicators-table/oncology-summary-indicators-table.component';
import { OncologySummaryIndicatorsPatientListComponent } from './oncology-reports/oncology-indicators-patient-list/oncology-indicators-patient-list.component';
import { NgBusyModule } from 'ng-busy';
import { ChangeDepartmentModule } from '../change-department/change-department.module';
import { DataAnalyticsHivModule } from '../hiv/data-analytics-hiv.module';
import { TabViewModule } from 'primeng/primeng';
import { OncologyReportPdfViewComponent } from './oncology-reports/oncology-report-pdf-view/oncology-report-pdf-view.component';
import { OncologyAggregateReportViewComponent } from './oncology-reports/oncology-aggregate-report-view/oncology-aggregate-report-view.component';
import { MOH412OncologyDataAnalyticsComponent } from './oncology-reports/moh-412-report/moh-412-data-analytics.component';
import { MOH412OncologyDataAnalyticsPatientListComponent } from './oncology-reports/moh-412-report/moh-412-data-analytics-patient-list.component';
import { OncologyProgramModule } from './../../oncology-care-lib/oncology-care-lib.module';
@NgModule({
  imports: [
    DataAnalyticsDashboardOncologyRouting,
    NgamrsSharedModule,
    CommonModule,
    RouterModule,
    FormsModule,
    DataListsModule,
    AgGridModule,
    NgBusyModule,
    TabViewModule,
    ChangeDepartmentModule,
    DataAnalyticsHivModule,
    OncologyProgramModule
  ],
  exports: [
    OncologyReportsComponent,
    OncologySummaryIndicatorsComponent,
    OncologySummaryFiltersComponent,
    OncologySummaryIndicatorsTableComponent,
    OncologySummaryIndicatorsPatientListComponent,
    MOH412OncologyDataAnalyticsComponent,
    MOH412OncologyDataAnalyticsPatientListComponent
  ],
  declarations: [
    OncologyReportsComponent,
    OncologySummaryIndicatorsComponent,
    OncologySummaryFiltersComponent,
    OncologySummaryIndicatorsTableComponent,
    OncologySummaryIndicatorsPatientListComponent,
    OncologyReportPdfViewComponent,
    OncologyAggregateReportViewComponent,
    MOH412OncologyDataAnalyticsComponent,
    MOH412OncologyDataAnalyticsPatientListComponent
  ],
  providers: [
    DataAnalyticsDashboardService,
    OncologyReportService,
    OncologySummaryIndicatorsResourceService
  ]
})
export class DataAnalyticsOncologyModule {}
