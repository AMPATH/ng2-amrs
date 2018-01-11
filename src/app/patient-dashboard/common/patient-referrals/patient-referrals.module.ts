
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenmrsApi } from '../../../openmrs-api/openmrs-api.module';
import { ReferralStatusComponent } from
  './referral-status/referral-status.component';
import { PatientReferralService } from
'./referral-status/referral-service';
@NgModule({
  imports: [
    CommonModule,
    OpenmrsApi
  ],
  declarations: [
    ReferralStatusComponent
  ],
  exports: [
    ReferralStatusComponent
  ],
  providers: [
    PatientReferralService
  ]
})
export class PatientReferralsModule { }
