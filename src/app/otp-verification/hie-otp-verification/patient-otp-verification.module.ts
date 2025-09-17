import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/primeng';
import { PatientOtpVerificationDialogComponent } from './dialog/patient-otp-verification-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HieOtpClientConsentService } from './patient-otp-verification.service';

@NgModule({
  imports: [DialogModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [PatientOtpVerificationDialogComponent],
  exports: [PatientOtpVerificationDialogComponent],
  providers: [HieOtpClientConsentService]
})
export class PatientOtpVerificationModule {}
