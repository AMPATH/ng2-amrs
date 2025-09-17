import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ValidateHieCustomOtpResponse } from 'src/app/models/hie-registry.model';

@Injectable({
  providedIn: 'root'
})
export class HieOtpClientConsentService {
  private otpValidationSubj = new Subject<ValidateHieCustomOtpResponse>();
  public otpValidation$ = this.otpValidationSubj.asObservable();

  validateOtp(validateHieCustomOtpResponse: ValidateHieCustomOtpResponse) {
    this.otpValidationSubj.next(validateHieCustomOtpResponse);
  }
}
