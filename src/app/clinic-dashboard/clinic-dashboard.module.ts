import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Angulartics2Module } from 'angulartics2';
import { ChartModule } from 'angular2-highcharts';
import { CalendarModule } from 'angular-calendar';

import {
  DailyScheduleResourceService
} from
  '../etl-api/daily-scheduled-resource.service';
import {
  HivClinicFlowResourceService
} from
  '../etl-api/hiv-clinic-flow-resource.service';

import { ClinicFlowResource } from '../etl-api/clinic-flow-resource-interface';
import { clinicDashboardRouting } from './clinic-dashboard-routing';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { DailyScheduleVisitsComponent } from './daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent }
  from './daily-schedule/daily-schedule-appointments.component';
import { PatientStatusChangeListComponent } from
  './patient-status-change-visualization/patient-status-change-list.component';
import { DailyScheduleNotReturned } from './daily-schedule/daily-schedule-not-returned.component';
import {
  DefaulterListResourceService
} from
  '../etl-api/defaulter-list-resource.service';
import { DefaulterListComponent } from './defaulter-list/defaulter-list.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { MonthlyScheduleComponent } from './monthly-schedule/monthly-schedule.component';
import { VisualizationComponent } from './clinical-summary-visualization/visualization-component';
import { ClinicFlowComponent } from '../clinic-flow/clinic-flow.component';
import { ClinicFlowSummaryComponent } from '../clinic-flow/clinic-flow-summary.component';
import { ClinicFlowVisitsComponent } from '../clinic-flow/clinic-flow-visits.component';
import { ClinicFlowHourlyStatsVizComponent } from
  '../clinic-flow/clinic-flow-hourly-stats-viz.component';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/src/app/components/date-time-picker';
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
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';

import {
  TabViewModule, FieldsetModule, ButtonModule, GrowlModule,
  AccordionModule
} from 'primeng/primeng';
import { ReportingUtilities } from '../reporting-utilities/reporting-utilities.module';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';
import { SelectModule } from 'angular2-select';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataListsModule } from '../data-lists/data-lists.module';
import { ClinicLabOrdersComponent } from './clinic-lab-orders/clinic-lab-orders.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { MdTabsModule } from '@angular/material';
import { MaterialModule } from '@angular/material';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import {
  PatientStatusOverviewComponent
} from './clinical-summary-visualization/patient-status-overview/patient-status-overview.component';
import {
  PatientStatusIndicatorDefComponent
} from './clinical-summary-visualization/patient-status-overview/indicator-definition.component';
import { EtlApi } from '../etl-api/etl-api.module';
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
} from './services/clinical-summary-visualization.service';
import {
  ArtOverviewIndicatorDefComponent
} from './clinical-summary-visualization/art-overview/indicator-definitions.component';
import { HivProgramModule } from './hiv/hiv-program.module';
import { ClinicFlowCacheService } from '../clinic-flow/clinic-flow-cache.service';
import { Moh731ResourceService } from '../etl-api/moh-731-resource.service';
import {
  ClinicFlowLocationStatsComponent
} from '../clinic-flow/clinic-flow-location-stats.component';
import {
  ClinicFlowProviderStatsComponent
} from '../clinic-flow/clinic-flow-provider-stats.component';
import {
  PatientStatusDatalistCellComponent
} from './patient-status-change-visualization/patient-status-data-list-cell.component';
import { MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule, Router } from '@angular/router';
import { SessionStorageService } from '../utils/session-storage.service';
import { HttpClient } from '../shared/services/http-client.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DateTimePickerModule,
    DataListsModule,
    clinicDashboardRouting,
    ReportingUtilities,
    TabViewModule,
    FieldsetModule,
    ButtonModule,
    GrowlModule,
    AccordionModule,
    OpenmrsApi,
    EtlApi,
    SelectModule,
    Angulartics2Module.forChild(),
    NgamrsSharedModule,
    ChartModule.forRoot(require('highcharts'),
      require('highcharts/highcharts-more'),
      require('highcharts/modules/exporting')
    ),
    BusyModule.forRoot(
      new BusyConfig({
        message: 'Please Wait...',
        backdrop: true,
        delay: 200,
        minDuration: 600,
        wrapperClass: 'my-class',

      })
    ),
    HivProgramModule,
    CalendarModule.forRoot(),
    AgGridModule.withComponents([]),
    NgamrsSharedModule,
    NgxMyDatePickerModule,
    MdTabsModule.forRoot(),
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MaterialModule
  ],
  declarations: [
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    VisualizationComponent,
    ArtOverviewComponent,
    HivCareComparativeOverviewComponent,
    VisualizationPatientListComponent,
    HivCareTabularViewComponent,
    DateRangeComponent,
    RangeSliderComponent,
    DashboardFiltersComponent,
    IndicatorSelectComponent,
    GenderSelectComponent,
    ClinicDashboardComponent,
    ClinicLabOrdersComponent,
    DailyScheduleAppointmentsComponent,
    DailyScheduleNotReturned,
    DailyScheduleVisitsComponent,
    DefaulterListComponent,
    PatientStatusOverviewComponent,
    PatientStatusIndicatorDefComponent,
    HivCareIndicatorDefComponent,
    ArtOverviewIndicatorDefComponent,
    ClinicFlowComponent,
    ClinicFlowHourlyStatsVizComponent,
    ClinicFlowSummaryComponent,
    ClinicFlowVisitsComponent,
    PatientStatusChangeVisualizationContainerComponent,
    PatientStatusChangeVisualizationComponent,
    PatientStatusChangeListComponent,
    ClinicFlowLocationStatsComponent,
    ClinicFlowProviderStatsComponent,
    PatientStatusDatalistCellComponent

  ],
  entryComponents: [PatientStatusDatalistCellComponent, PatientStatusChangeListComponent],
  providers: [
    ClinicDashboardGuard,
    DailyScheduleResourceService,
    Moh731ResourceService,
    ClinicDashboardCacheService,
    DefaulterListResourceService,
    ClinicalSummaryVisualizationService,
    ClinicDashboardCacheService,
    HivClinicFlowResourceService,
    ClinicFlowCacheService,
    {
      provide: 'ClinicFlowResource',
      useExisting: HivClinicFlowResourceService
    },
    {
      provide: Http,
      useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions,
        router: Router, sessionStorageService: SessionStorageService) =>
        new HttpClient(xhrBackend, requestOptions, router, sessionStorageService),
      deps: [XHRBackend, RequestOptions, Router, SessionStorageService]
    },
  ],
  exports: [
    BusyModule,
    DailyScheduleComponent,
    MonthlyScheduleComponent,
    VisualizationComponent,
    ArtOverviewComponent,
    HivCareComparativeOverviewComponent,
    VisualizationPatientListComponent,
    HivCareTabularViewComponent,
    DateRangeComponent,
    RangeSliderComponent,
    DashboardFiltersComponent,
    IndicatorSelectComponent,
    GenderSelectComponent,
    ClinicLabOrdersComponent,
    DailyScheduleAppointmentsComponent,
    DailyScheduleNotReturned,
    DailyScheduleVisitsComponent,
    ClinicDashboardComponent,
    DefaulterListComponent,
    PatientStatusOverviewComponent,
    PatientStatusIndicatorDefComponent,
    HivCareIndicatorDefComponent,
    ArtOverviewIndicatorDefComponent,
    ClinicFlowComponent,
    ClinicFlowHourlyStatsVizComponent,
    ClinicFlowSummaryComponent,
    ClinicFlowVisitsComponent,
    PatientStatusChangeListComponent,
    ClinicFlowLocationStatsComponent,
    ClinicFlowProviderStatsComponent
  ],
})
export class ClinicDashboardModule {
}
