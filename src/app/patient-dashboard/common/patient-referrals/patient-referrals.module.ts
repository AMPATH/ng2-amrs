import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenmrsApi } from '../../../openmrs-api/openmrs-api.module';

import {
  DifferentiatedCareReferralStatusComponent
} from './differentiated-care-referral-status/differentiated-care-referral-status.component';
import { OncologyReferralStatusComponent } from './oncology-referral-status/oncology-referral-status.component';
import { DifferentiatedCareReferralService } from './differentiated-care-referral.service';
import { ProgramReferralService } from './program-referral.service';

@NgModule({
  imports: [
    CommonModule,
    OpenmrsApi
  ],
  declarations: [
    DifferentiatedCareReferralStatusComponent,
    OncologyReferralStatusComponent
  ],
  exports: [
    DifferentiatedCareReferralStatusComponent,
    OncologyReferralStatusComponent
  ],
  providers: [
    DifferentiatedCareReferralService,
    ProgramReferralService
  ]
})
export class PatientReferralsModule { }
