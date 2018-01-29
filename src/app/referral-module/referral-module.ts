import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import {
  PatientReferralContainerComponent
} from './components/patient-referral-container.component';
import { PatientReferralItemComponent } from './components/patient-referral-item.component';
import { ProgramWorkFlowResourceService } from '../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../openmrs-api/program-workflow-state-resource.service';
import { ProgramEnrollmentResourceService
} from '../openmrs-api/program-enrollment-resource.service';
import { PatientReferralService } from './services/patient-referral-service';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgamrsSharedModule
  ],
  exports: [PatientReferralContainerComponent, PatientReferralItemComponent],
  declarations: [PatientReferralContainerComponent, PatientReferralItemComponent],
  providers: [
    ProgramEnrollmentResourceService,
    ProgramWorkFlowResourceService,
    PatientReferralService,
    ProgramWorkFlowStateResourceService],

})
export class ReferralModule {
}
