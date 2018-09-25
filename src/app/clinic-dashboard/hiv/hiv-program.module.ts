import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule,
MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule, MatDatepickerToggle
} from '@angular/material';
import {
    TabViewModule, FieldsetModule, ButtonModule, GrowlModule,
    AccordionModule
} from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import {
    DateTimePickerModule
} from 'ngx-openmrs-formentry/dist/ngx-formentry/';
import { CalendarModule } from 'angular-calendar';
import { ChartModule } from 'angular2-highcharts';
import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import { clinicDashboardHivRouting } from './hiv-program.routes';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { EtlApi } from '../../etl-api/etl-api.module';
import { HivModuleComponent } from './hiv-program.component';
import { DepartmentProgramFilterModule } from
'./../../department-program-filter/department-program-filter.module';
import {
    PatientStatusChangeVisualizationContainerComponent
} from
'./patient-status-change-visualization/patient-status-change-visualization.container.component';
import {
    PatientStatusChangeVisualizationComponent
} from
'./patient-status-change-visualization/patient-status-change-visualization.component';
import {
    PatientStatusDatalistCellComponent
} from './patient-status-change-visualization/patient-status-data-list-cell.component';
import { PatientStatusChangeListComponent } from
'./patient-status-change-visualization/patient-status-change-list.component';
import {
    HivSummaryIndicatorComponent
} from './hiv-summary-indicators/hiv-summary-indicator.component';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { ClinicScheduleLibModule } from '../../clinic-schedule-lib/clinic-schedule-lib.module';
import {
    PatientsRequiringVLComponent
 } from './patients-requiring-vl/patients-requiring-vl.component';
import { DailyScheduleClinicFlowComponent
} from './clinic-flow/daily-schedule-clinic-flow.component';
import { HivCareComparativeComponent
} from './hiv-visualization/hiv-care-overview.component';
import {
    HivDailyScheduleComponent
} from './daily-schedule/daily-schedule.component';
import {
    HivMonthlyScheduleComponent
} from './monthly-schedule/monthly-schedule.component';
import {
    PatientStatusIndicatorDefComponent
  } from './clinical-summary-visualization/patient-status-overview/indicator-definition.component';
import {
    ArtOverviewComponent
} from './clinical-summary-visualization/art-overview/art-overview.component';
import {
    PatientStatusOverviewComponent
} from './clinical-summary-visualization/patient-status-overview/patient-status-overview.component';
import {
    VisualizationPatientListComponent
} from
// tslint:disable-next-line:max-line-length
'./clinical-summary-visualization/visualization-patient-list/visualization.patient-list.component';
import { DashboardFiltersComponent } from '../dashboard-filters/dashboard-filters.component';
import { DateRangeComponent } from '../dashboard-filters/date-range/date-range.component';
import { RangeSliderComponent } from '../dashboard-filters/range-slider/range-slider.component';
import {
  IndicatorSelectComponent
} from '../dashboard-filters/indicator-selector/indicator-selector.component';
import {
  GenderSelectComponent
} from '../dashboard-filters/gender-selector/gender-selector.component';
import {
    ArtOverviewIndicatorDefComponent
} from './clinical-summary-visualization/art-overview/indicator-definitions.component';
import {
    ClinicalSummaryVisualizationService
} from '../../hiv-care-lib/services/clinical-summary-visualization.service';
import {
    ProgramVisitEncounterSearchModule
} from '../../program-visit-encounter-search/program-visit-encounter-search.module';
import { RouterModule } from '@angular/router';

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
        GrowlModule,
        AccordionModule,
        ChartModule,
        ProgramVisitEncounterSearchModule,
        ClinicScheduleLibModule,
        DepartmentProgramFilterModule
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
        RouterModule
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
    ],
    providers: [
        ClinicalSummaryVisualizationService
    ],
    entryComponents: [PatientStatusDatalistCellComponent]
})
export class HivProgramModule { }
