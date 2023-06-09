import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular/main';
import { ChartModule } from 'angular2-highcharts';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import {
  AccordionModule,
  DataTableModule,
  SharedModule,
  TabViewModule,
  GrowlModule,
  PanelModule,
  ConfirmDialogModule,
  ConfirmationService,
  DialogModule,
  InputTextModule,
  MessagesModule,
  InputTextareaModule,
  MultiSelectModule,
  DropdownModule,
  ButtonModule,
  CalendarModule
} from 'primeng/primeng';
import { Moh731TabularComponent } from './moh-731-report/moh-731-tabular.component';
import { Moh731ReportFiltersComponent } from './moh-731-report/moh-731-report-filters.component';
import { Moh731ReportBaseComponent } from './moh-731-report/moh-731-report-base.component';
import { EtlApi } from '../etl-api/etl-api.module';
import { Moh731PatientListComponent } from './moh-731-report/moh-731-patientlist.component';
import { DateTimePickerModule } from '@ampath-kenya/ngx-openmrs-formentry';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { MOHReportComponent } from './moh-731-report/moh-731-report-pdf-view.component';
import { MOHReportService } from './moh-731-report/moh-731-report-pdf-view.service';
import { LocationResourceService } from '../openmrs-api/location-resource.service';
import { HivSummaryIndicatorBaseComponent } from './hiv-summary-indicators/hiv-summary-report-base.component';
import { HivSummaryTabularComponent } from './hiv-summary-indicators/hiv-summary-tabular.component';
import { ClinicFlowComponent } from './clinic-flow/clinic-flow.component';
import { ClinicFlowHourlyStatsVizComponent } from './clinic-flow/clinic-flow-hourly-stats-viz.component';
import { ClinicFlowSummaryComponent } from './clinic-flow/clinic-flow-summary.component';
import { ClinicFlowVisitsComponent } from './clinic-flow/clinic-flow-visits.component';
import { ClinicFlowLocationStatsComponent } from './clinic-flow/clinic-flow-location-stats.component';
import { ClinicFlowProviderStatsComponent } from './clinic-flow/clinic-flow-provider-stats.component';
import { ClinicFlowProviderStatsPatientListComponent } from './clinic-flow/clinic-flow-provider-stats-patient-list.component';
import { ReportingUtilitiesModule } from '../reporting-utilities/reporting-utilities.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { HivCareComparativeOverviewBaseComponent } from './hiv-visualization/hiv-care-overview-base.component';
import { HivCareComparativeChartComponent } from './hiv-visualization/hiv-care-overview-chart.component';
import { HivCareIndicatorDefComponent } from './hiv-visualization/indicator-definitions.component';
import { HivCareTabularViewComponent } from './hiv-visualization/hiv-care-tabularView.component';
import { VisualizationPatientListComponent } from './hiv-visualization/visualization-patient-list.component';
import { ClinicalSummaryVisualizationService } from './services/clinical-summary-visualization.service';
import { HivSummaryIndicatorsPatientListComponent } from './hiv-summary-indicators/patient-list.component';
import { PatientsRequiringVLBaseComponent } from './patients-requiring-vl/patients-requiring-vl-base.component';
import { PatientsRequiringVLReportFiltersComponent } from './patients-requiring-vl/patients-requiring-vl-report-filters.component';
import { HivMonthlySummaryIndicatorBaseComponent } from './hiv-monthly-summary-indicators/hiv-monthly-summary-report-base';
import { HivSummaryMonthlyTabularComponent } from './hiv-monthly-summary-indicators/hiv-monthly-summary-tabular.component';
import { HivMonthlySummaryIndicatorsPatientListComponent } from './hiv-monthly-summary-indicators/patient-list.component';
import { ProgramWorkFlowResourceService } from '../openmrs-api/program-workflow-resource.service';
import { HeiIndicatorsReportComponent } from './hei-indicators-report/hei-indicators-report.component';
import { HeiIndicatorsFilterComponent } from './hei-indicators-report/hei-indicators-filter.component';
import { HeiIndicatorsTabularComponent } from './hei-indicators-report/hei-indicators-tabular-component';
import { HeiIndicatorsPatientListComponent } from './hei-indicators-report/hei-indicators-patient-list.component';
import { HeiIndicatorsPdfViewComponent } from './hei-indicators-report/hei-indicators-pdf-view.component';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { SurgeReportTabularComponent } from './surge-report/surge-report-tabular.component';
import { SurgeReportBaseComponent } from './surge-report/surge-report-base.component';
import { SurgeReportPatientListComponent } from './surge-report/surge-report-patient-list.component';
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

import { CaseManagementComponent } from './case-management/case-management.component';
import { CaseManagementFiltersComponent } from './case-management/case-management-filters.component';
import { CaseManagementPatientListComponent } from './case-management/case-management-patient-list.component';
import { AssignCaseManagerComponent } from './case-management/assign-case-manager.component';
import { CaseManagementIndicatorDefinitionComponent } from './case-management/case-management-indicator-definitions.component';

import { CaseManagementResourceService } from './../etl-api/case-management-resource.service';
import { PrepReportBaseComponent } from './prep-report/prep-report-base/prep-report-base.component';
import { PrepReportPatientListComponent } from './prep-report/prep-report-patient-list/prep-report-patient-list.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
// tslint:disable-next-line: max-line-length
import { PatientGainsAndLosesPatientListComponent } from './patient-gains-and-loses/patient-gains-and-loses-patient-list/patient-gains-and-loses-patient-list.component';
import { PatientGainsAndLosesComponent } from './patient-gains-and-loses/patient-gains-and-loses.component';
import { FamilyTestingBaseComponent } from './family-testing/family-testing-base.component';
import { FamilyTestingPatientlistComponent } from './family-testing/family-testing-patient-list.component';
import { FamilyTestingTreeComponent } from './family-testing/family-testing-tree.component';
import { FamilyTestingContactComponent } from './family-testing/family-testing-contact-list.component';
import { FamilyTestingButtonRendererComponent } from './family-testing/button-render/button-renderer.component';
import { PrettyEncounterViewerComponent } from '../patient-dashboard/common/formentry/pretty-encounter-viewer.component';
import { FormDataSourceService } from '../patient-dashboard/common/formentry/form-data-source.service';
import { ZscoreService } from '../shared/services/zscore.service';
import { ContactProfileComponent } from './family-testing/contact-profile/contact-profile.component';
import { AddContactTraceComponent } from './family-testing/contact-trace/add-contact-trace.component';
import { EditContactTraceComponent } from './family-testing/contact-trace/edit-contact-trace.component';
import { ContactListComponent } from './family-testing/contact-list/contact-list.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown'; // import { ProgramVisitEncounterSearchModule } from '../program-visit-encounter-search/program-visit-encounter-search.module';
import { IptReportPatientListComponent } from 'src/app/hiv-care-lib/ipt-report/ipt-report-patient-list.component';
import { IptBaseReportComponent } from 'src/app/hiv-care-lib/ipt-report/ipt-report-base.component';

import { PatientGainsFiltersComponent } from './patient-gains-and-loses/patient-gains-and-losses-filters/patient-gains-and-losses-filter.component';
import { PatientGainsAndLossesDashboardViewComponent } from './patient-gains-and-loses/patient-gains-and-losses-dashboard-view/patient-gains-and-losses-dashboard-view.component';
import { PatientGainsAndLossesTabularViewComponent } from './patient-gains-and-loses/patient-gains-and-losses-tabular-view/patient-gains-and-losses-tabular-view.component';

import { Covid19ReportComponent } from './covid-19-report/covid-19-report.component';
import { Covid19ReportFiltersComponent } from './covid-19-report/covid-19-report-filters/covid-19-report-filters.component';
import { Covid19ReportPatientListComponent } from './covid-19-report/covid-19-report-patient-list/covid-19-report-patient-list.component';
import { Covid19TabularViewComponent } from './covid-19-report/covid-19-tabular-view/covid-19-tabular-view.component';
import { TxMlReportBaseComponent } from './tx-ml-report/tx-ml-report-base/tx-ml-report-base.component';
import { TxMlReportPatientListComponent } from './tx-ml-report/tx-ml-report-patient-list/tx-ml-report-patient-list.component';
import { TxMlReportViewComponent } from './tx-ml-report/tx-ml-report-view/tx-ml-report-view.component';
import { TxNewReportBaseComponent } from './tx-new-report/tx-new-report-base/tx-new-report-base.component';
import { TxNewReportPatientListComponent } from './tx-new-report/tx-new-report-patient-list/tx-new-report-patient-list.component';
import { TxCurrReportBaseComponent } from './tx-curr-report/tx-curr-report-base/tx-curr-report-base.component';
import { TxCurrReportPatientListComponent } from './tx-curr-report/tx-curr-report-patient-list/tx-curr-report-patient-list.component';

@NgModule({
  imports: [
    RouterModule,
    AgGridModule.withComponents([]),
    FormsModule,
    AngularMultiSelectModule,
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
    NgxMyDatePickerModule.forRoot(),
    AgGridModule.withComponents([FamilyTestingButtonRendererComponent])
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
    ClinicFlowProviderStatsPatientListComponent,
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
    RetentionIndicatorDefComponent,
    CaseManagementComponent,
    CaseManagementFiltersComponent,
    CaseManagementPatientListComponent,
    AssignCaseManagerComponent,
    CaseManagementIndicatorDefinitionComponent,
    HeiIndicatorsReportComponent,
    HeiIndicatorsFilterComponent,
    HeiIndicatorsTabularComponent,
    HeiIndicatorsPatientListComponent,
    HeiIndicatorsPdfViewComponent,
    FamilyTestingBaseComponent,
    FamilyTestingPatientlistComponent,
    FamilyTestingTreeComponent,
    FamilyTestingContactComponent,
    FamilyTestingButtonRendererComponent,
    ContactProfileComponent,
    AddContactTraceComponent,
    EditContactTraceComponent,
    ContactListComponent,
    PatientGainsAndLosesComponent,
    PatientGainsAndLossesDashboardViewComponent,
    PatientGainsAndLossesTabularViewComponent,
    Covid19ReportComponent,
    Covid19ReportFiltersComponent,
    Covid19ReportPatientListComponent,
    Covid19TabularViewComponent,
    TxMlReportViewComponent
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
    ClinicFlowProviderStatsPatientListComponent,
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
    DqaReportBaseComponent,
    CaseManagementComponent,
    CaseManagementFiltersComponent,
    CaseManagementPatientListComponent,
    AssignCaseManagerComponent,
    CaseManagementIndicatorDefinitionComponent,
    PrepReportBaseComponent,
    PrepReportPatientListComponent,
    MonthlyReportComponent,
    HeiIndicatorsReportComponent,
    HeiIndicatorsFilterComponent,
    HeiIndicatorsTabularComponent,
    HeiIndicatorsPatientListComponent,
    HeiIndicatorsPdfViewComponent,
    PatientGainsAndLosesPatientListComponent,
    PatientGainsAndLosesComponent,
    FamilyTestingBaseComponent,
    FamilyTestingPatientlistComponent,
    FamilyTestingTreeComponent,
    FamilyTestingContactComponent,
    FamilyTestingButtonRendererComponent,
    ContactProfileComponent,
    AddContactTraceComponent,
    EditContactTraceComponent,
    ContactListComponent,
    PatientGainsAndLosesComponent,
    PatientGainsFiltersComponent,
    IptBaseReportComponent,
    IptReportPatientListComponent,
    PatientGainsAndLossesDashboardViewComponent,
    PatientGainsAndLossesTabularViewComponent,
    Covid19ReportComponent,
    Covid19ReportFiltersComponent,
    Covid19ReportPatientListComponent,
    Covid19TabularViewComponent,
    TxMlReportBaseComponent,
    TxMlReportPatientListComponent,
    TxMlReportViewComponent,
    TxNewReportBaseComponent,
    TxNewReportPatientListComponent,
    TxCurrReportBaseComponent,
    TxCurrReportPatientListComponent
  ],
  providers: [
    MOHReportService,
    LocationResourceService,
    ClinicalSummaryVisualizationService,
    RetentionReportResourceService,
    CaseManagementResourceService,
    ProgramWorkFlowResourceService,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
    FormDataSourceService,
    ZscoreService
  ]
})
export class HivCareLibModule {}
