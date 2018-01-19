import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import {
  PatientReferralContainerComponent
} from './components/patient-referral-container.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgamrsSharedModule
  ],
  exports: [PatientReferralContainerComponent],
  declarations: [PatientReferralContainerComponent],
  providers: [],

})
export class ReferralModule {
}
