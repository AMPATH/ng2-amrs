import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdProgressSpinnerModule, MdProgressBarModule, MdTabsModule , MdSlideToggleModule
} from '@angular/material';
import { RouterModule } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular/main';
import { ChartModule } from 'angular2-highcharts';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { Moh731TabularComponent } from './moh-731-report/moh-731-tabular.component';
import { Moh731ReportFiltersComponent } from './moh-731-report/moh-731-report-filters.component';
import { Moh731ReportBaseComponent } from './moh-731-report/moh-731-report-base.component';
import { EtlApi } from '../etl-api/etl-api.module';
import { Moh731PatientListComponent } from './moh-731-report/moh-731-patientlist.component';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
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
import { ClinicFlowHourlyStatsVizComponent
} from './clinic-flow/clinic-flow-hourly-stats-viz.component';
import { ClinicFlowSummaryComponent
} from './clinic-flow/clinic-flow-summary.component';
import { ClinicFlowVisitsComponent
} from './clinic-flow/clinic-flow-visits.component';
import { ClinicFlowLocationStatsComponent
} from './clinic-flow/clinic-flow-location-stats.component';
import { ClinicFlowProviderStatsComponent
} from './clinic-flow/clinic-flow-provider-stats.component';
import { ReportingUtilitiesModule } from '../reporting-utilities/reporting-utilities.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { HivCareComparativeOverviewBaseComponent
} from './hiv-visualization/hiv-care-overview-base.component';
import { HivCareComparativeChartComponent
} from './hiv-visualization/hiv-care-overview-chart.component';
import { HivCareIndicatorDefComponent
} from './hiv-visualization/indicator-definitions.component';
import { HivCareTabularViewComponent
} from './hiv-visualization/hiv-care-tabularView.component';
import { VisualizationPatientListComponent
} from './hiv-visualization/visualization-patient-list.component';
import {
  ClinicalSummaryVisualizationService
} from './services/clinical-summary-visualization.service';
import {
  HivSummaryIndicatorsPatientListComponent
} from './hiv-summary-indicators/patient-list.component';
import { PatientsRequiringVLBaseComponent
} from './patients-requiring-vl/patients-requiring-vl-base.component';
import { PatientsRequiringVLReportFiltersComponent
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
    ChartModule.forRoot(require('highcharts'),
      require('highcharts/highcharts-more'),
      require('highcharts/modules/exporting')
    ),
    ReportingUtilitiesModule,
    DataListsModule,
    NgxMyDatePickerModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MdSlideToggleModule
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
    HivMonthlySummaryIndicatorsPatientListComponent
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
    HivMonthlySummaryIndicatorsPatientListComponent
  ],
  providers: [MOHReportService,
    LocationResourceService,
    ClinicalSummaryVisualizationService,
    ProgramWorkFlowResourceService
  ]
})
export class HivCareLibModule {
}
