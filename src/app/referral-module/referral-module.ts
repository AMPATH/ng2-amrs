import { NgModule } from '@angular/core';
import { CommonModule, NgSwitch } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReferralProviderComponent } from
  './components/provider/referral-provider.component';
import { ProgramWorkFlowResourceService } from '../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../openmrs-api/program-workflow-state-resource.service';
import { ProgramEnrollmentResourceService
} from '../openmrs-api/program-enrollment-resource.service';
import { PatientReferralService } from './services/patient-referral-service';
import { PatientReferralVisitComponent } from './components/visit/patient-referral-visit.component';
import { ProgramReferralResourceService } from '../etl-api/program-referral-resource.service';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { DialogModule } from 'primeng/primeng';
import { EnrollmentManagerComponent
} from './components/enrollment-manager/enrollment-manager.component';
import { PatientService } from '../patient-dashboard/services/patient.service';
import { EnrollementWorkflowService } from './services/enrollment-workflow-service';
import { AgGridModule } from 'ag-grid-angular';
import { TabViewModule } from 'primeng/components/tabview/tabview';
import {
  PatientReferralBaseComponent
} from './patient-referral/patient-referral-report-base.component';
import {
  PatientReferralTabularComponent
} from './patient-referral/patient-referral-tabular.component';
import { ProgramsTransferCareService
} from '../patient-dashboard/programs/transfer-care/transfer-care.service';
@NgModule({
  imports: [
    RouterModule.forChild([]),
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    NgSelectModule,
    DataListsModule,
    AgGridModule.withComponents([]),
    TabViewModule,
    DialogModule
  ],
  exports: [
    PatientReferralVisitComponent,
    EnrollmentManagerComponent,
    PatientReferralTabularComponent],
  declarations: [
    EnrollmentManagerComponent,
    PatientReferralVisitComponent,
    PatientReferralBaseComponent,
    PatientReferralTabularComponent],
  providers: [
    ProgramEnrollmentResourceService,
    ProgramReferralResourceService,
    ProgramWorkFlowResourceService,
    PatientReferralService,
    PatientService,
    ProgramsTransferCareService,
    EnrollementWorkflowService,
    NgSwitch,
    ProgramWorkFlowStateResourceService]

})
export class ReferralModule {
}
