import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import {
  PatientReferralContainerComponent
} from './components/patient-referral-container.component';
import { ReferralProviderComponent } from
  './components/referral-provider.component';
import { PatientReferralItemComponent } from './components/patient-referral-item.component';
import { ProgramWorkFlowResourceService } from '../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../openmrs-api/program-workflow-state-resource.service';
import { ProgramEnrollmentResourceService
} from '../openmrs-api/program-enrollment-resource.service';
import { PatientReferralService } from './services/patient-referral-service';
import { PatientReferralVisitComponent } from './components/patient-referral-visit.component';
import { ProgramReferralResourceService } from '../etl-api/program-referral-resource.service';
import {
    ReferralProviderResourceService
} from '../etl-api/referral-provider-resource.service';
import { DataListsModule } from '../shared/data-lists/data-lists.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    DataListsModule
  ],
  exports: [
  PatientReferralContainerComponent,
  PatientReferralItemComponent,
  PatientReferralVisitComponent,
  ReferralProviderComponent],
  declarations: [
  PatientReferralContainerComponent,
  PatientReferralItemComponent,
  PatientReferralVisitComponent,
  ReferralProviderComponent],
  providers: [
    ProgramEnrollmentResourceService,
    ProgramReferralResourceService,
    ProgramWorkFlowResourceService,
    PatientReferralService,
    ProgramWorkFlowStateResourceService,
    ReferralProviderResourceService],

})
export class ReferralModule {
}
