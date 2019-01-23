import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenmrsApi } from '../../../openmrs-api/openmrs-api.module';

import { DifferentiatedCareReferralService } from './differentiated-care-referral.service';
import {
  DifferentiatedCareReferralStatusComponent
} from './differentiated-care-referral-status/differentiated-care-referral-status.component';

@NgModule({
  imports: [
    CommonModule,
    OpenmrsApi
  ],
  declarations: [
    DifferentiatedCareReferralStatusComponent
  ],
  exports: [
    DifferentiatedCareReferralStatusComponent
  ],
  providers: [
    DifferentiatedCareReferralService
  ]
})
export class PatientReferralsModule { }
