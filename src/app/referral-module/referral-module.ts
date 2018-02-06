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
import { PatientReferralVisitComponent } from './components/patient-referral-visit.component';
import { ProgramReferralResourceService } from '../etl-api/program-referral-resource.service';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgamrsSharedModule
  ],
  exports: [PatientReferralContainerComponent, PatientReferralItemComponent,
    PatientReferralVisitComponent],
  declarations: [PatientReferralContainerComponent, PatientReferralItemComponent,
    PatientReferralVisitComponent],
  providers: [
    ProgramEnrollmentResourceService,
    ProgramReferralResourceService,
    ProgramWorkFlowResourceService,
    PatientReferralService,
    ProgramWorkFlowStateResourceService],

})
export class ReferralModule {
}
