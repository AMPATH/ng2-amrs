import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

import { NgBusyModule, BusyConfig } from 'ng-busy';
import { LaddaModule } from 'angular2-ladda';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SelectModule } from 'ngx-select';
import {
  MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule, MatSnackBarModule, MatSlideToggleModule, MatCardModule, MatRadioModule,
  MatExpansionModule, MatMenuModule, MatIconModule, MatButtonModule, MatTooltipModule
} from '@angular/material';
import { CacheService } from 'ionic-cache';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/dist/ngx-formentry/';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormEntryModule } from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { ToastComponent } from '../patient-dashboard/common/formentry/form-updater-toast.component';
import { DisplayErrorComponent } from './display-error/display-error.component';
import { DateSelectorComponent } from './components/date-selector.component';
import { StringToDatePipe } from './pipes/string-to-date.pipe';
import { Ng2FilterPipe } from './pipes/ng2-filter.pipe';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { OnlineTrackerComponent } from '../online-tracker';
import { BuildVersionComponent } from '../build-version';
import { RoutesProviderService } from './dynamic-route/route-config-provider.service';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { HivSummaryService } from '../patient-dashboard/hiv/hiv-summary/hiv-summary.service';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { SessionService } from '../openmrs-api/session.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import {
  UserDefaultPropertiesService
} from '../user-default-properties/user-default-properties.service';
import { Angulartics2Module } from 'angulartics2';
import { NgSelectModule } from '@ng-select/ng-select';
import { CacheModule } from 'ionic-cache';
import {
  LocationFilterComponent
} from './locations/location-filter/location-filter.component';
import { EtlApi } from '../etl-api/etl-api.module';
import { BusyComponent } from './busy-loader/busy.component';
import {
  UnenrollPatientProgramsComponent
} from '../patient-dashboard/common/programs/unenroll-patient-programs.component';
import { ConfirmDialogModule, DialogModule, TabViewModule } from 'primeng/primeng';
import {
  HivProgramSnapshotComponent
} from '../patient-dashboard/hiv/program-snapshot/hiv-program-snapshot.component';
import { CdmProgramSnapshotComponent
} from '../patient-dashboard/cdm/program-snapshot/cdm-program-snapshot.component';
import { GeneralLandingPageComponent
} from '../patient-dashboard/general-landing-page/landing-page.component';
import {
  ProgramsContainerComponent
} from '../patient-dashboard/programs/programs-container.component';
import {
  ProgramEnrollmentComponent
} from '../patient-dashboard/programs/program-enrollment.component';
import { ProgramsComponent } from '../patient-dashboard/programs/programs.component';
import { FormListComponent } from '../patient-dashboard/common/forms/form-list.component';
import { ReportFiltersComponent } from './report-filters/report-filters.component';
import {
  EnrollmentManagerFormWizardComponent
} from '../referral-module/components/enrollment-manager/enrollment-manager-form-wizard.component';
import {
  PatientReferralContainerComponent
} from '../referral-module/components/referral-container/patient-referral-container.component';
import {
  PatientReferralItemComponent
} from '../referral-module/components/referral-container/patient-referral-item.component';
import { ZeroVlPipe } from './pipes/zero-vl-pipe';
import {
  PatientEncounterObservationsComponent
} from '../patient-dashboard/common/patient-encounters/patient-encounter-observations.component';
import {
  PrettyEncounterViewerComponent
} from '../patient-dashboard/common/formentry/pretty-encounter-viewer.component';
import { XHRBackend, RequestOptions, Http } from '@angular/http';
import { HttpClient } from './services/http-client.service';
export function httpClient(xhrBackend: XHRBackend, requestOptions: RequestOptions,
  router: Router, sessionStorageService: SessionStorageService) {
  return new HttpClient(xhrBackend, requestOptions, router, sessionStorageService);
  }
import { RetrospectiveDataEntryModule
} from '../retrospective-data-entry/retrospective-data-entry.module';

@NgModule({
  imports: [
    LaddaModule.forRoot({
      style: 'expand-right',
      spinnerSize: 20,
      spinnerColor: 'white',
      spinnerLines: 12
    }),
    CommonModule,
    OpenmrsApi,
    EtlApi,
    Angulartics2Module,
    Angulartics2Module.forRoot([Angulartics2Piwik]),
    FormsModule,
    NgxMyDatePickerModule,
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
    RetrospectiveDataEntryModule,
    ConfirmDialogModule, DialogModule,
    MatSnackBarModule, NgxPaginationModule,
    MatRadioModule, MatMenuModule, MatIconModule,
    MatExpansionModule, MatButtonModule, MatTooltipModule
  ],
  exports: [NgBusyModule, LaddaModule, NgSelectModule, DisplayErrorComponent,
    RetrospectiveDataEntryModule, MatCardModule,
    PatientReferralContainerComponent, PatientEncounterObservationsComponent,
    StringToDatePipe, Ng2FilterPipe, OnlineTrackerComponent, HivProgramSnapshotComponent,
    BuildVersionComponent, UnenrollPatientProgramsComponent,
    ProgramsContainerComponent, ProgramsComponent, EnrollmentManagerFormWizardComponent,
    ProgramEnrollmentComponent, FormListComponent, ReportFiltersComponent,
    PatientReferralItemComponent, ZeroVlPipe, PrettyEncounterViewerComponent,
    DateSelectorComponent, PdfViewerComponent, NgxMyDatePickerModule, GeneralLandingPageComponent,
    OpenmrsApi, EtlApi, Ng2Bs3ModalModule, ModalModule, BsDropdownModule, TooltipModule,
    LocationFilterComponent, ToastComponent, Angulartics2Module, MatSnackBarModule, MatTabsModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatSlideToggleModule, NgxPaginationModule, MatButtonModule,
    CdmProgramSnapshotComponent, MatRadioModule, FormsModule, MatMenuModule, MatIconModule, MatExpansionModule, MatTooltipModule],
  declarations: [
    DisplayErrorComponent, StringToDatePipe, ZeroVlPipe, Ng2FilterPipe, HivProgramSnapshotComponent,
    GeneralLandingPageComponent, ProgramsComponent, EnrollmentManagerFormWizardComponent,
    ProgramsContainerComponent, FormListComponent, PatientReferralContainerComponent,
    ProgramEnrollmentComponent, ReportFiltersComponent, PatientReferralItemComponent,
    OnlineTrackerComponent, ToastComponent, UnenrollPatientProgramsComponent,
    BuildVersionComponent, DateSelectorComponent, PdfViewerComponent,
    PatientEncounterObservationsComponent, PrettyEncounterViewerComponent,
    CdmProgramSnapshotComponent
  ],
  entryComponents: [
    ToastComponent
  ],
  providers: [Ng2FilterPipe, StringToDatePipe, ZeroVlPipe, RoutesProviderService,
    HivSummaryService, {
      provide: Http,
      useFactory: httpClient,
      deps: [XHRBackend, RequestOptions, Router, SessionStorageService]
    }],
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
