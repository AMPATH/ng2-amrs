import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Angulartics2Module } from 'angulartics2';
import { ChartModule } from 'angular2-highcharts';
import { CalendarModule } from 'angular-calendar';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { MatTabsModule, MatSlideToggleModule } from '@angular/material';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';
import { EtlApi } from '../etl-api/etl-api.module';
import { routes } from './clinic-dashboard.routes';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
import {
  TabViewModule,
  FieldsetModule,
  ButtonModule,
  GrowlModule,
  AccordionModule
} from 'primeng/primeng';
import { ReportingUtilitiesModule } from '../reporting-utilities/reporting-utilities.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { DateTimePickerModule } from 'ngx-openmrs-formentry';
import { NgxPaginationModule } from 'ngx-pagination';
import { GeneralModule } from './general/general.module';
import { CdmModule } from './cdm/cdm-program.module';
import { HivProgramModule } from './hiv/hiv-program.module';
import { OncologyProgramModule } from './oncology/oncology-program.module';
import { ClinicFlowCacheService } from '../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
import {
  MatProgressSpinnerModule,
  MatProgressBarModule
} from '@angular/material';
import { HivClinicFlowResourceService } from '../etl-api/hiv-clinic-flow-resource.service';
export function highchartsFactory() {
  const hc = require('highcharts');
  const hm = require('highcharts/highcharts-more');
  // const hx = require('highcharts/modules/exporting');
  hm(hc);
  // hx(hm);
  return hc;
}
import { CacheModule } from 'ionic-cache';
import { DataAnalyticsDashboardService } from '../data-analytics-dashboard/services/data-analytics-dashboard.services';
import { ProgramVisitEncounterSearchModule } from '../program-visit-encounter-search/program-visit-encounter-search.module';
import { DepartmentProgramFilterModule } from './../department-program-filter/department-program-filter.module';
import { PatientProgramEnrollmentService } from './../etl-api/patient-program-enrollment.service';
import { PatientProgramEnrollmentModule } from './../patients-program-enrollment/patients-program-enrollment.module';
import { PatientReferralProgramModule } from './referral/patient-referral-program.module';
import { ClinicRoutesFactory } from '../navigation/side-navigation/clinic-side-nav/clinic-side-nav-routes.factory';

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    ClinicDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OpenmrsApi,
    EtlApi,
    Angulartics2Module,
    NgamrsSharedModule,
    ChartModule,
    CalendarModule.forRoot(),
    MatTabsModule,
    RouterModule.forChild(routes),
    DateTimePickerModule,
    DataListsModule,
    ReportingUtilitiesModule,
    TabViewModule,
    FieldsetModule,
    ButtonModule,
    GrowlModule,
    AccordionModule,
    CdmModule,
    GeneralModule,
    HivProgramModule,
    OpenmrsApi,
    EtlApi,
    Angulartics2Module,
    NgamrsSharedModule,
    CalendarModule.forRoot(),
    AgGridModule.withComponents([]),
    NgxMyDatePickerModule.forRoot(),
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    CacheModule,
    MatSlideToggleModule,
    ProgramVisitEncounterSearchModule,
    DepartmentProgramFilterModule,
    PatientProgramEnrollmentModule,
    NgxPaginationModule,
    PatientReferralProgramModule,
    OncologyProgramModule
  ],
  providers: [
    ClinicDashboardCacheService,
    ClinicDashboardGuard,
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
    DataAnalyticsDashboardService,
    PatientProgramEnrollmentService,
    ClinicRoutesFactory
  ],
  entryComponents: []
})
export class ClinicDashboardModule {
  public static routes = routes;
}
