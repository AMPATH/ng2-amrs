import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule, ConfirmDialogModule, DialogModule, MessagesModule } from 'primeng/primeng';
import { MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';
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

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ConfirmDialogModule,
    SharedModule,
    DialogModule,
    MessagesModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    LabOrderSearchModule,
    Ng2PaginationModule,
    NgamrsSharedModule,
    PatientDashboardCdmModule,
    PatientDashboardOncologyModule,
    PatientDashboardCommonModule,
    PatientDashboardHivModule,
    PatientSearchModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    GeneralLandingPageComponent,
    PatientDashboardComponent,
    ProgramsComponent
  ],
  providers: [
    PatientDashboardGuard,
    PatientSearchService,
    PatientService,
    PatientProgramService,
    PatientPreviousEncounterService,
    ProgramService,
    DatePipe,
    PatientRoutesFactory
  ],
  exports: [
    GeneralLandingPageComponent,
    ProgramsComponent
  ]
})
export class PatientDashboardModule {
  public static routes = routes;
}
