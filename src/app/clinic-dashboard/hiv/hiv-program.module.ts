import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import {
  TabViewModule,
  FieldsetModule,
  ButtonModule,
  GrowlModule,
  AccordionModule,
  DialogModule
} from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { DateTimePickerModule } from '@ampath-kenya/ngx-openmrs-formentry';
import { CalendarModule } from 'angular-calendar';
import { ChartModule } from 'angular2-highcharts';
import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import { clinicDashboardHivRouting } from './hiv-program.routes';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { EtlApi } from '../../etl-api/etl-api.module';
import { DepartmentProgramFilterModule } from './../../department-program-filter/department-program-filter.module';
import { PatientStatusChangeVisualizationContainerComponent } from './patient-status-change-visualization/patient-status-change-visualization.container.component';
import { PatientStatusChangeVisualizationComponent } from './patient-status-change-visualization/patient-status-change-visualization.component';
import { PatientStatusDatalistCellComponent } from './patient-status-change-visualization/patient-status-data-list-cell.component';
import { PatientStatusChangeListComponent } from './patient-status-change-visualization/patient-status-change-list.component';
import { HivSummaryIndicatorComponent } from './hiv-summary-indicators/hiv-summary-indicator.component';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { ClinicScheduleLibModule } from '../../clinic-schedule-lib/clinic-schedule-lib.module';
import { PatientsRequiringVLComponent } from './patients-requiring-vl/patients-requiring-vl.component';
import { DailyScheduleClinicFlowComponent } from './clinic-flow/daily-schedule-clinic-flow.component';
import { HivCareComparativeComponent } from './hiv-visualization/hiv-care-overview.component';
import { HivDailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { HivMonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { PatientStatusIndicatorDefComponent } from './clinical-summary-visualization/patient-status-overview/indicator-definition.component';
import { ArtOverviewComponent } from './clinical-summary-visualization/art-overview/art-overview.component';
import { PatientStatusOverviewComponent } from './clinical-summary-visualization/patient-status-overview/patient-status-overview.component';
import { VisualizationPatientListComponent } from './clinical-summary-visualization/visualization-patient-list/visualization.patient-list.component';
import { DashboardFiltersComponent } from '../dashboard-filters/dashboard-filters.component';
import { DateRangeComponent } from '../dashboard-filters/date-range/date-range.component';
import { RangeSliderComponent } from '../dashboard-filters/range-slider/range-slider.component';
import { IndicatorSelectComponent } from '../dashboard-filters/indicator-selector/indicator-selector.component';
import { GenderSelectComponent } from '../dashboard-filters/gender-selector/gender-selector.component';
import { ArtOverviewIndicatorDefComponent } from './clinical-summary-visualization/art-overview/indicator-definitions.component';
import { ClinicalSummaryVisualizationService } from '../../hiv-care-lib/services/clinical-summary-visualization.service';
import { ProgramVisitEncounterSearchModule } from '../../program-visit-encounter-search/program-visit-encounter-search.module';
import { RouterModule } from '@angular/router';
import { Moh731MonthlyVizComponent } from './moh731-monthly-viz/moh731-monthly-viz.component';
import { ClinicKibanaVizComponent } from '../../clinic-dashboard/clinic-kibana-viz/clinic-kibana-viz.component';
import { KibanaLibModule } from '../../kibana-lib';

import { HivEnhancedComponent } from './hiv-enhanced-program/hiv-enhanced-program.component';
import { HivEnhancedFiltersComponent } from './hiv-enhanced-program/hiv-enhanced-program-filters/hiv-enhanced-program-filters.component';
import { HivEnhancedPatientListComponent } from './hiv-enhanced-program/hiv-enhanced-patient-list/hiv-enhanced-patient-list.component';
import { DefaulterListComponent } from '../general/defaulter-list/defaulter-list.component';
import { GeneralModule } from '../general/general.module';
import { ChangeDepartmentModule } from '../change-department/change-department.module';
import { HivDifferentiatedCareComponent } from './hiv-differentiated-care-program/hiv-differentiated-care-program.component';
import { HivDifferentiatedCarePatientListComponent } from './hiv-differentiated-care-program/hiv-differentiated-care-program-patient-list/hiv-differentiated-care-patient-list.component';
import { SurgeReportComponent } from './surge-report/surge-report.component';
import { ReportingUtilitiesModule } from 'src/app/reporting-utilities/reporting-utilities.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { ClinicDashboardRetentionReportComponent } from './retention-report/clinic-dashboard-retention-report.component';
import { ClinicDashboardCaseManagementComponent } from './case-management/clinic-dashboard-case-management.component';
import { PrepReportComponent } from './prep-report/prep-report.component';
import { AhdReportComponent } from './ahd-report/ahd-report.component';
import { ClinicDashboardHeiReportComponent } from './clinic-dashboard-hei-indicators-report/clinic-dashboard-hei-report.component';
import { ClinicDashboardPmtctRriReportComponent } from './clinic-dashboard-pmtct-rri-report/clinic-dashboard-pmtct-rri-report.component';

import { HIVListsMicroFrontendComponent } from './hiv-lists-microfrontend-report/hiv-lists-microfrontend.component';
import { FamilyTestingComponent } from './family-testing/family-testing.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ClinicDashboardGainsAndLossesComponent } from './patient-gain-and-loses-report/clinic-dashboard-gains-and-losses.component';
import { MOH412ClinicDashboardComponent } from './moh-412-report/moh-412-clinic-dashboard.component';
import { MOH412ClinicDashboardPatientListComponent } from './moh-412-report/moh-412-clinic-dashboard-patient-list.component';
import { OncologyProgramModule } from './../../oncology-care-lib/oncology-care-lib.module';
import { IptReportComponent } from './ipt-report/ipt-report.component';
import { DefaulterListFilterComponent } from './../general/defaulter-list/defaulter-list-filter-component';
import { ClinicDashboardCovid19ReportComponent } from './covid-19-report/clinic-dashboard-covid-19-report.component';
import { PreAppointmentOutreachResourceService } from 'src/app/etl-api/pre-appointment-outreach-resource.service';
import { PreAppointmentOutreachComponent } from '../general/pre-appointment-outreach/pre-appointment-outreach.component';
import { PlhivNcdV2ReportComponent } from './plhiv-ncd-v2-report/plhiv-ncd-v2-report.component';
import { MedicationPickUpPatientListComponent } from '../general/appointments/medication-pickup-patient-list.component';

@NgModule({
  imports: [
    clinicDashboardHivRouting,
    HivCareLibModule,
    DateTimePickerModule,
    AgGridModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    CalendarModule,
    TabViewModule,
    FieldsetModule,
    ButtonModule,
    DialogModule,
    GrowlModule,
    AccordionModule,
    ChartModule,
    ProgramVisitEncounterSearchModule,
    ClinicScheduleLibModule,
    DepartmentProgramFilterModule,
    ChangeDepartmentModule,
    GeneralModule,
    KibanaLibModule,
    ReportingUtilitiesModule,
    BsDatepickerModule.forRoot(),
    AngularMultiSelectModule,
    OncologyProgramModule
  ],
  exports: [
    HivSummaryIndicatorComponent,
    DailyScheduleClinicFlowComponent,
    PatientsRequiringVLComponent,
    PatientStatusChangeListComponent,
    PatientStatusDatalistCellComponent,
    PatientStatusChangeVisualizationComponent,
    PatientStatusChangeVisualizationContainerComponent,
    DashboardFiltersComponent,
    GenderSelectComponent,
    IndicatorSelectComponent,
    DateRangeComponent,
    RangeSliderComponent,
    RouterModule,
    ClinicDashboardHeiReportComponent,
    ClinicDashboardPmtctRriReportComponent,
    ClinicDashboardGainsAndLossesComponent,
    MOH412ClinicDashboardComponent,
    MOH412ClinicDashboardPatientListComponent,
    DefaulterListFilterComponent,
    ClinicDashboardCovid19ReportComponent
  ],
  declarations: [
    Moh731ReportComponent,
    HivSummaryIndicatorComponent,
    DailyScheduleClinicFlowComponent,
    PatientsRequiringVLComponent,
    PatientStatusIndicatorDefComponent,
    VisualizationPatientListComponent,
    ArtOverviewComponent,
    PatientStatusOverviewComponent,
    ArtOverviewIndicatorDefComponent,
    // HivSummaryIndicatorsPatientListComponent,
    HivCareComparativeComponent,
    HivDailyScheduleComponent,
    HivMonthlyScheduleComponent,
    PatientStatusChangeListComponent,
    PatientStatusDatalistCellComponent,
    PatientStatusChangeVisualizationComponent,
    PatientStatusChangeVisualizationContainerComponent,
    DashboardFiltersComponent,
    GenderSelectComponent,
    IndicatorSelectComponent,
    DateRangeComponent,
    RangeSliderComponent,
    HivEnhancedComponent,
    HivEnhancedFiltersComponent,
    HivEnhancedPatientListComponent,
    DefaulterListComponent,
    Moh731MonthlyVizComponent,
    ClinicKibanaVizComponent,
    HivDifferentiatedCareComponent,
    HivDifferentiatedCarePatientListComponent,
    SurgeReportComponent,
    ClinicDashboardRetentionReportComponent,
    ClinicDashboardCaseManagementComponent,
    PrepReportComponent,
    AhdReportComponent,
    ClinicDashboardHeiReportComponent,
    ClinicDashboardPmtctRriReportComponent,
    HIVListsMicroFrontendComponent,
    FamilyTestingComponent,
    ClinicDashboardGainsAndLossesComponent,
    MOH412ClinicDashboardComponent,
    MOH412ClinicDashboardPatientListComponent,
    IptReportComponent,
    DefaulterListFilterComponent,
    ClinicDashboardCovid19ReportComponent,
    PreAppointmentOutreachComponent,
    PlhivNcdV2ReportComponent,
    MedicationPickUpPatientListComponent
  ],
  providers: [
    ClinicalSummaryVisualizationService,
    PreAppointmentOutreachResourceService
  ],
  entryComponents: [PatientStatusDatalistCellComponent]
})
export class HivProgramModule {}
