import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular/main';
import { ChartModule } from 'angular2-highcharts';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule, MultiSelectModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { Moh731TabularComponent } from './moh-731-report/moh-731-tabular.component';
import { Moh731ReportFiltersComponent } from './moh-731-report/moh-731-report-filters.component';
import { Moh731ReportBaseComponent } from './moh-731-report/moh-731-report-base.component';
import { EtlApi } from '../etl-api/etl-api.module';
import { Moh731PatientListComponent } from './moh-731-report/moh-731-patientlist.component';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { MOHReportComponent } from './moh-731-report/moh-731-report-pdf-view.component';
import { MOHReportService } from './moh-731-report/moh-731-report-pdf-view.service';
import { LocationResourceService } from '../openmrs-api/location-resource.service';
import {
  HivSummaryIndicatorBaseComponent
} from './hiv-summary-indicators/hiv-summary-report-base.component';
import {
  ReportFiltersComponent
} from '../shared/report-filters/report-filters.component';
import { HivSummaryTabularComponent } from './hiv-summary-indicators/hiv-summary-tabular.component';
import { ClinicFlowComponent } from './clinic-flow/clinic-flow.component';
import {
  ClinicFlowHourlyStatsVizComponent
} from './clinic-flow/clinic-flow-hourly-stats-viz.component';
import {
  ClinicFlowSummaryComponent
} from './clinic-flow/clinic-flow-summary.component';
import {
  ClinicFlowVisitsComponent
} from './clinic-flow/clinic-flow-visits.component';
import {
  ClinicFlowLocationStatsComponent
} from './clinic-flow/clinic-flow-location-stats.component';
import {
  ClinicFlowProviderStatsComponent
} from './clinic-flow/clinic-flow-provider-stats.component';
import { ReportingUtilitiesModule } from '../reporting-utilities/reporting-utilities.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import {
  HivCareComparativeOverviewBaseComponent
} from './hiv-visualization/hiv-care-overview-base.component';
import {
  HivCareComparativeChartComponent
} from './hiv-visualization/hiv-care-overview-chart.component';
import {
  HivCareIndicatorDefComponent
} from './hiv-visualization/indicator-definitions.component';
import {
  HivCareTabularViewComponent
} from './hiv-visualization/hiv-care-tabularView.component';
import {
  VisualizationPatientListComponent
} from './hiv-visualization/visualization-patient-list.component';
import {
  ClinicalSummaryVisualizationService
} from './services/clinical-summary-visualization.service';
import {
  HivSummaryIndicatorsPatientListComponent
} from './hiv-summary-indicators/patient-list.component';
import {
  PatientsRequiringVLBaseComponent
} from './patients-requiring-vl/patients-requiring-vl-base.component';
import {
  PatientsRequiringVLReportFiltersComponent
} from './patients-requiring-vl/patients-requiring-vl-report-filters.component';
import {
  HivMonthlySummaryIndicatorBaseComponent
} from './hiv-monthly-summary-indicators/hiv-monthly-summary-report-base';
import {
  HivSummaryMonthlyTabularComponent
} from './hiv-monthly-summary-indicators/hiv-monthly-summary-tabular.component';
import {
  HivMonthlySummaryIndicatorsPatientListComponent
} from './hiv-monthly-summary-indicators/patient-list.component';
import {
  ProgramWorkFlowResourceService
} from '../openmrs-api/program-workflow-resource.service';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { SurgeReportTabularComponent } from './surge-report/surge-report-tabular.component';
import { SurgeReportBaseComponent } from './surge-report/surge-report-base.component';
import { SurgeReportPatientListComponent } from './surge-report/surge-report-patient-list.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
export function highchartsFactory() {
  const hc = require('highcharts');
  const hcm = require('highcharts/highcharts-more');
  const hce = require('highcharts/modules/exporting');
  hcm(hc);
  hce(hc);
  return hc;
}
import { RetentionReportPatientListComponent } from './retention-report/retention-report-patient-list.component';
import { RetentionReportFiltersComponent } from './retention-report/retention-report-filters.component';
import { RetentionReportComponent } from './retention-report/retention-report.component';
import { RetentionReportResourceService } from './../etl-api/retention-report-resource.service';
import { RetentionReportTabularComponent } from './retention-report/retention-report-tabular.component';
import { RetentionIndicatorDefComponent } from './retention-report/retention-indicator-definitions.component';
import { ChartAbstractionPatientlistComponent } from './dqa-reports/chart-abstraction-patientlist/chart-abstraction-patientlist.component';
import { DqaReportsComponent } from './dqa-reports/dqa-reports/dqa-reports.component';
import { DqaReportBaseComponent } from './dqa-reports/dqa-report-base/dqa-report-base.component';

@NgModule({
  imports: [
    RouterModule,
    AgGridModule.withComponents([]),
    FormsModule,
    DataListsModule,
    NgamrsSharedModule,
    DateTimePickerModule,
    CommonModule,
    AccordionModule,
    DataTableModule,
    SharedModule,
    GrowlModule,
    MultiSelectModule,
    PanelModule,
    ConfirmDialogModule,
    DialogModule,
    TabViewModule,
    AccordionModule,
    InputTextModule,
    MessagesModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    ChartModule,
    ReportingUtilitiesModule,
    DataListsModule,
    NgxMyDatePickerModule.forRoot()
  ],
  exports: [
    Moh731TabularComponent,
    Moh731PatientListComponent,
    Moh731ReportFiltersComponent,
    DateTimePickerModule,
    EtlApi,
    CommonModule,
    TabViewModule,
    NgamrsSharedModule,
    MOHReportComponent,
    HivSummaryTabularComponent,
    PatientsRequiringVLBaseComponent,
    PatientsRequiringVLReportFiltersComponent,
    ClinicFlowComponent,
    ClinicFlowHourlyStatsVizComponent,
    ClinicFlowSummaryComponent,
    ClinicFlowVisitsComponent,
    ClinicFlowLocationStatsComponent,
    ClinicFlowProviderStatsComponent,
    HivCareComparativeOverviewBaseComponent,
    HivCareComparativeChartComponent,
    HivCareIndicatorDefComponent,
    HivCareTabularViewComponent,
    VisualizationPatientListComponent,
    HivSummaryIndicatorsPatientListComponent,
    HivSummaryMonthlyTabularComponent,
    HivMonthlySummaryIndicatorsPatientListComponent,
    SurgeReportTabularComponent,
    SurgeReportBaseComponent,
    SurgeReportPatientListComponent,
    RetentionReportPatientListComponent,
    RetentionReportFiltersComponent,
    RetentionReportComponent,
    RetentionReportTabularComponent,
    RetentionIndicatorDefComponent
  ],
  declarations: [
    Moh731TabularComponent,
    Moh731PatientListComponent,
    Moh731ReportBaseComponent,
    Moh731ReportFiltersComponent,
    MOHReportComponent,
    HivSummaryIndicatorBaseComponent,
    HivSummaryTabularComponent,
    PatientsRequiringVLBaseComponent,
    PatientsRequiringVLReportFiltersComponent,
    ClinicFlowComponent,
    ClinicFlowHourlyStatsVizComponent,
    ClinicFlowSummaryComponent,
    ClinicFlowVisitsComponent,
    ClinicFlowLocationStatsComponent,
    ClinicFlowProviderStatsComponent,
    HivCareComparativeOverviewBaseComponent,
    HivCareComparativeChartComponent,
    HivCareIndicatorDefComponent,
    HivCareTabularViewComponent,
    VisualizationPatientListComponent,
    HivSummaryIndicatorsPatientListComponent,
    HivMonthlySummaryIndicatorBaseComponent,
    HivSummaryMonthlyTabularComponent,
    HivMonthlySummaryIndicatorsPatientListComponent,
    SurgeReportTabularComponent,
    SurgeReportBaseComponent,
    SurgeReportPatientListComponent,
    RetentionReportPatientListComponent,
    RetentionReportFiltersComponent,
    RetentionReportComponent,
    RetentionReportTabularComponent,
    RetentionIndicatorDefComponent,
    ChartAbstractionPatientlistComponent,
    DqaReportsComponent,
    DqaReportBaseComponent
  ],
  providers: [MOHReportService,
    LocationResourceService,
    ClinicalSummaryVisualizationService,
    RetentionReportResourceService,
    ProgramWorkFlowResourceService,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }
  ]
})
export class HivCareLibModule {
}
