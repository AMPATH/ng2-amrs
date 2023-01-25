import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenmrsApi } from '../../../openmrs-api/openmrs-api.module';

import { DifferentiatedCareReferralStatusComponent } from './differentiated-care-referral-status/differentiated-care-referral-status.component';
import { DifferentiatedCareReferralService } from './differentiated-care-referral.service';
import { HivReferralComponent } from './hiv-referrals/hiv-referral.component';
import { HivReferralService } from './hiv-referrals/hiv-referral.service';

@NgModule({
  imports: [CommonModule, OpenmrsApi],
  declarations: [
    DifferentiatedCareReferralStatusComponent,
    HivReferralComponent
  ],
  exports: [DifferentiatedCareReferralStatusComponent, HivReferralComponent],
  providers: [DifferentiatedCareReferralService, HivReferralService]
})
export class PatientReferralsModule {}
