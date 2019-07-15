import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule, MatSnackBarModule, MatSlideToggleModule, MatCardModule, MatRadioModule,
  MatExpansionModule, MatMenuModule, MatIconModule, MatButtonModule, MatTooltipModule
} from '@angular/material';

import { NgBusyModule, BusyConfig } from 'ng-busy';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ngx-select';
import { CacheService } from 'ionic-cache';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormEntryModule } from 'ngx-openmrs-formentry';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { Angulartics2Module } from 'angulartics2';
import { NgSelectModule } from '@ng-select/ng-select';
import { CacheModule } from 'ionic-cache';
import { PdfViewerModule } from 'ng2-pdf-viewer';



import { DisplayErrorComponent } from './display-error/display-error.component';
import { DateSelectorComponent } from './components/date-selector.component';
import { StringToDatePipe } from './pipes/string-to-date.pipe';
import { Ng2FilterPipe } from './pipes/ng2-filter.pipe';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { OnlineTrackerComponent } from '../online-tracker';
import { BuildVersionComponent } from '../build-version';
import { RoutesProviderService } from './dynamic-route/route-config-provider.service';
import { HivSummaryService } from '../patient-dashboard/hiv/hiv-summary/hiv-summary.service';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { SessionService } from '../openmrs-api/session.service';
import { SessionStorageService } from '../utils/session-storage.service';
import {
  UserDefaultPropertiesService
} from '../user-default-properties/user-default-properties.service';
import {
  LocationFilterComponent
} from './locations/location-filter/location-filter.component';
import { EtlApi } from '../etl-api/etl-api.module';
import { BusyComponent } from './busy-loader/busy.component';
import { ConfirmDialogModule, DialogModule, TabViewModule } from 'primeng/primeng';
import {
  HivProgramSnapshotComponent
} from '../patient-dashboard/hiv/program-snapshot/hiv-program-snapshot.component';
import {
  CdmProgramSnapshotComponent
} from '../patient-dashboard/cdm/program-snapshot/cdm-program-snapshot.component';
import { FormListComponent } from '../patient-dashboard/common/forms/form-list.component';
import { ReportFiltersComponent } from './report-filters/report-filters.component';
import { ZeroVlPipe } from './pipes/zero-vl-pipe';
import {
  PatientEncounterObservationsComponent
} from '../patient-dashboard/common/patient-encounters/patient-encounter-observations.component';
import {
  PrettyEncounterViewerComponent
} from '../patient-dashboard/common/formentry/pretty-encounter-viewer.component';
import {
  RetrospectiveDataEntryModule
} from '../retrospective-data-entry/retrospective-data-entry.module';
import { DataListsModule } from './data-lists/data-lists.module';
import { AppModalComponent } from './modal/app-modal.component';
import { PocHttpInteceptor } from './services/poc-http-interceptor';
import { SelectDepartmentService } from './services/select-department.service';
import { RisonService } from './services/rison-service';
import { KibanaVizHostComponent } from './kibana-viz-host/kibana-viz-host.component';
import { KibanaVizComponent } from './kibana-viz/kibana-viz.component';

@NgModule({
  imports: [
    LaddaModule.forRoot({
      style: 'expand-right',
      spinnerSize: 20,
      spinnerColor: 'white',
      spinnerLines: 12
    }),
    CommonModule,
    HttpClientModule,
    OpenmrsApi,
    EtlApi,
    Angulartics2Module,
    Angulartics2Module.forRoot([Angulartics2Piwik]),
    FormsModule,
    NgxMyDatePickerModule.forRoot(),
    RouterModule,
    Ng2Bs3ModalModule,
    DateTimePickerModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    // BrowserAnimationsModule
    CacheModule,
    MatExpansionModule,
    // SelectModule,
    NgSelectModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCardModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    FormEntryModule,
    DataListsModule,
    AgGridModule,
    RetrospectiveDataEntryModule,
    ConfirmDialogModule, DialogModule,
    MatSnackBarModule, NgxPaginationModule,
    MatRadioModule, MatMenuModule, MatIconModule,
    MatExpansionModule, MatButtonModule, MatTooltipModule,
    PdfViewerModule, ReactiveFormsModule
  ],
  exports: [NgBusyModule, LaddaModule, NgSelectModule, DisplayErrorComponent, AppModalComponent, AgGridModule,
    RetrospectiveDataEntryModule, MatCardModule, PatientEncounterObservationsComponent,
    StringToDatePipe, Ng2FilterPipe, OnlineTrackerComponent, HivProgramSnapshotComponent,
    BuildVersionComponent, FormListComponent, ReportFiltersComponent, ZeroVlPipe, PrettyEncounterViewerComponent,
    DateSelectorComponent, PdfViewerModule , NgxMyDatePickerModule, KibanaVizComponent , KibanaVizHostComponent ,
    OpenmrsApi, EtlApi, Ng2Bs3ModalModule, ModalModule, BsDropdownModule, TooltipModule,
    LocationFilterComponent, Angulartics2Module, MatSnackBarModule, MatTabsModule, ReactiveFormsModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatSlideToggleModule, NgxPaginationModule, MatButtonModule,
    CdmProgramSnapshotComponent, MatRadioModule, FormsModule, MatMenuModule, MatIconModule, MatExpansionModule, MatTooltipModule],
  declarations: [
    DisplayErrorComponent, StringToDatePipe, ZeroVlPipe, Ng2FilterPipe, HivProgramSnapshotComponent,
    FormListComponent, ReportFiltersComponent,
    OnlineTrackerComponent, AppModalComponent, KibanaVizHostComponent ,  KibanaVizComponent ,
    BuildVersionComponent, DateSelectorComponent,
    PatientEncounterObservationsComponent, PrettyEncounterViewerComponent,
    CdmProgramSnapshotComponent
  ],
  providers: [Ng2FilterPipe, StringToDatePipe, ZeroVlPipe, RoutesProviderService,
    HivSummaryService, RisonService, SelectDepartmentService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true
    }
  ],
})
export class NgamrsSharedModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgamrsSharedModule,
      providers: [AuthenticationService, SessionService,
        SessionStorageService, UserDefaultPropertiesService]
    };
  }
}
