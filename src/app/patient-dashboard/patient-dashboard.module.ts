import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule, ConfirmDialogModule, DialogModule, MessagesModule,
TabViewModule, PanelModule
} from 'primeng/primeng';
import { MdProgressSpinnerModule, MdProgressBarModule, MdSlideToggleModule, MdTabsModule
} from '@angular/material';
import { Ng2PaginationModule } from 'ng2-pagination';
import { routes } from './patient-dashboard.routes';
import { PatientDashboardGuard } from './patient-dashboard.guard';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { ProgramService } from './programs/program.service';
import { ProgramsComponent } from './programs/programs.component';
import { PatientSearchService } from '../patient-search/patient-search.service';
import { PatientService } from './services/patient.service';
import { PatientPreviousEncounterService } from './services/patient-previous-encounter.service';
import { LabOrderSearchModule } from '../lab-order-search/lab-order-search.module';
import { GeneralLandingPageComponent } from './general-landing-page/landing-page.component';
import { PatientRoutesFactory } from '../navigation';
import { PatientDashboardCommonModule } from './common/patient-dashboard.common.module';
import { PatientDashboardHivModule } from './hiv/patient-dashboard-hiv.module';
import { PatientSearchModule } from '../patient-search/patient-search.module';
import { PatientProgramService } from './programs/patient-programs.service';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { PatientDashboardCdmModule } from './cdm/patient-dashboard-cdm.module';
import { PatientDashboardOncologyModule } from './oncology/patient-dashboard-cdm.module';
import {
  PatientDashboardDermatologyModule } from './dermatology/patient-dashboard-dermatology.module';
import { DepartmentProgramsConfigService } from '../etl-api/department-programs-config.service';
import { ProgramsContainerComponent } from './programs/programs-container.component';
import { ProgramTransferCareModule } from './programs/transfer-care/transfer-care.module';
import { ProgramEnrollmentComponent } from './programs/program-enrollment.component';

import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { SessionStorageService } from '../utils/session-storage.service';
import { HttpClient } from '../shared/services/http-client.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ConfirmDialogModule,
    SharedModule,
    DialogModule,
    MessagesModule,
    TabViewModule,
    PanelModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MdTabsModule,
    MdSlideToggleModule,
    LabOrderSearchModule,
    Ng2PaginationModule,
    NgamrsSharedModule,
    PatientDashboardCdmModule,
    PatientDashboardOncologyModule,
    PatientDashboardCommonModule,
    PatientDashboardHivModule,
    PatientDashboardDermatologyModule,
    PatientSearchModule,
    ProgramTransferCareModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    GeneralLandingPageComponent,
    PatientDashboardComponent,
    ProgramEnrollmentComponent,
    ProgramsContainerComponent,
    ProgramsComponent
  ],
  providers: [
    PatientDashboardGuard,
    PatientSearchService,
    PatientService,
    PatientProgramService,
    PatientPreviousEncounterService,
    ProgramService,
    DepartmentProgramsConfigService,
    DatePipe,
    PatientRoutesFactory,
    {
      provide: Http,
      useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions,
                   router: Router, sessionStorageService: SessionStorageService) =>
        new HttpClient(xhrBackend, requestOptions, router, sessionStorageService),
      deps: [XHRBackend, RequestOptions, Router, SessionStorageService]
    }
  ],
  exports: [
    GeneralLandingPageComponent,
    ProgramsContainerComponent,
    ProgramEnrollmentComponent,
    ProgramsComponent
  ]
})
export class PatientDashboardModule {
  public static routes = routes;
}
