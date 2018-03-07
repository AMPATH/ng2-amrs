import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Angulartics2Module } from 'angulartics2';
import { ChartModule } from 'angular2-highcharts';
import { CalendarModule } from 'angular-calendar';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { MdTabsModule, MdSlideToggleModule } from '@angular/material';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { SelectModule } from 'angular2-select';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';
import {
  PatientStatusIndicatorDefComponent
} from './clinical-summary-visualization/patient-status-overview/indicator-definition.component';
import { EtlApi } from '../etl-api/etl-api.module';

import { routes } from './clinic-dashboard.routes';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { VisualizationComponent } from './clinical-summary-visualization/visualization-component';
import { DailyScheduleVisitsComponent } from './daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent }
  from './daily-schedule/daily-schedule-appointments.component';
import { DailyScheduleNotReturnedComponent
} from './daily-schedule/daily-schedule-not-returned.component';

import {
  ArtOverviewComponent
} from './clinical-summary-visualization/art-overview/art-overview.component';
import { DateRangeComponent } from './dashboard-filters/date-range/date-range.component';
import { RangeSliderComponent } from './dashboard-filters/range-slider/range-slider.component';
import {
  IndicatorSelectComponent
} from './dashboard-filters/indicator-selector/indicator-selector.component';
import {
  GenderSelectComponent
} from './dashboard-filters/gender-selector/gender-selector.component';
import { DashboardFiltersComponent } from './dashboard-filters/dashboard-filters.component';
import {
  TabViewModule, FieldsetModule, ButtonModule, GrowlModule,
  AccordionModule
} from 'primeng/primeng';
import { ReportingUtilitiesModule } from '../reporting-utilities/reporting-utilities.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { ClinicLabOrdersComponent } from './clinic-lab-orders/clinic-lab-orders.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';

import {
  HivCareIndicatorDefComponent
} from
  './clinical-summary-visualization/hiv-care-comparative-overview/indicator-definitions.component';
import {
  HivCareComparativeOverviewComponent
} from
  './clinical-summary-visualization/hiv-care-comparative-overview/hiv-care-overview.component';
import {
  HivCareTabularViewComponent
} from
  './clinical-summary-visualization/hiv-care-comparative-overview/hiv-care-tabularview.component';
import { ClinicFlowResource } from '../etl-api/clinic-flow-resource-interface';

// import { ClinicFlowComponent } from '../clinic-flow/clinic-flow.component';

import {
  PatientStatusOverviewComponent
} from './clinical-summary-visualization/patient-status-overview/patient-status-overview.component';
import {
  VisualizationPatientListComponent
} from
  // tslint:disable-next-line:max-line-length
  './clinical-summary-visualization/visualization-patient-list/visualization.patient-list.component';
import {
  PatientStatusChangeVisualizationContainerComponent
} from
  './patient-status-change-visualization/patient-status-change-visualization.container.component';
import {
  PatientStatusChangeVisualizationComponent
} from
  './patient-status-change-visualization/patient-status-change-visualization.component';
import {
  ClinicalSummaryVisualizationService
} from '../hiv-care-lib/services/clinical-summary-visualization.service';
import {
  ArtOverviewIndicatorDefComponent
} from './clinical-summary-visualization/art-overview/indicator-definitions.component';
import { HivProgramModule } from './hiv/hiv-program.module';
import { ClinicFlowCacheService } from '../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
import { Moh731ResourceService } from '../etl-api/moh-731-resource.service';
import {
  PatientStatusDatalistCellComponent
} from './patient-status-change-visualization/patient-status-data-list-cell.component';
import { PatientStatusChangeListComponent } from
  './patient-status-change-visualization/patient-status-change-list.component';
import { MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';
import { SessionStorageService } from '../utils/session-storage.service';
import { HttpClient } from '../shared/services/http-client.service';
import {
  HivClinicFlowResourceService
} from '../etl-api/hiv-clinic-flow-resource.service';
export function highchartsFactory() {
  const hc = require('highcharts');
  const hm = require('highcharts/highcharts-more');
  // const hx = require('highcharts/modules/exporting');
  hm(hc);
  // hx(hm);
  return hc;
}
import { DefaulterListComponent } from './defaulter-list/defaulter-list.component';
import { CacheModule } from 'ionic-cache';
import { DataAnalyticsDashboardService
} from '../data-analytics-dashboard/services/data-analytics-dashboard.services';
import {
  ProgramVisitEncounterSearchModule
} from '../program-visit-encounter-search/program-visit-encounter-search.module';
@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    // ClinicFlowComponent,
    ArtOverviewIndicatorDefComponent,
    ClinicDashboardComponent,
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    VisualizationComponent,
    ClinicLabOrdersComponent,
    DailyScheduleAppointmentsComponent,
    DailyScheduleNotReturnedComponent,
    DailyScheduleVisitsComponent,
    PatientStatusIndicatorDefComponent,
    DashboardFiltersComponent,
    GenderSelectComponent,
    IndicatorSelectComponent,
    DateRangeComponent,
    RangeSliderComponent,
    ArtOverviewComponent,
    PatientStatusOverviewComponent,
    VisualizationPatientListComponent,
    DefaulterListComponent,
    PatientStatusChangeListComponent,
    PatientStatusDatalistCellComponent,
    PatientStatusChangeVisualizationComponent,
    PatientStatusChangeVisualizationContainerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OpenmrsApi,
    EtlApi,
    SelectModule,
    Angulartics2Module.forChild(),
    NgamrsSharedModule,
    ChartModule,
    CalendarModule.forRoot(),
    MdTabsModule,
    RouterModule.forChild(routes),
    DateTimePickerModule,
    DataListsModule,
    ReportingUtilitiesModule,
    TabViewModule,
    FieldsetModule,
    ButtonModule,
    GrowlModule,
    AccordionModule,
    HivProgramModule,
    OpenmrsApi,
    EtlApi,
    SelectModule,
    Angulartics2Module.forChild(),
    NgamrsSharedModule,
    CalendarModule.forRoot(),
    AgGridModule.withComponents([]),
    NgxMyDatePickerModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    CacheModule,
    MdSlideToggleModule,
    ProgramVisitEncounterSearchModule
  ],
  providers: [
    ClinicDashboardCacheService,
    ClinicDashboardGuard,
    ClinicDashboardGuard,
    ClinicDashboardCacheService,
    ClinicalSummaryVisualizationService,
    HivClinicFlowResourceService,
    ClinicFlowCacheService,
    ClinicFlowCacheService,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
    HivClinicFlowResourceService,
    {
      provide: 'ClinicFlowResource',
      useExisting: HivClinicFlowResourceService
    },
    DataAnalyticsDashboardService
  ],
  entryComponents: [PatientStatusDatalistCellComponent]
})
export class ClinicDashboardModule {
  public static routes = routes;
}
