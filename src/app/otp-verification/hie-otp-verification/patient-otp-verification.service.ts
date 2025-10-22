import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ValidateHieCustomOtpResponse } from 'src/app/models/hie-registry.model';

@Injectable({
  providedIn: 'root'
})
export class HieOtpClientConsentService {
  private otpValidationSubj = new Subject<ValidateHieCustomOtpResponse>();
  public otpValidation$ = this.otpValidationSubj.asObservable();
  public source: string;

  validateOtp(
    validateHieCustomOtpResponse: ValidateHieCustomOtpResponse,
    source?: string
  ) {
    this.otpValidationSubj.next({
      ...validateHieCustomOtpResponse,
      source: source
    });
  }
  setSource(sourceName: string) {
    this.source = sourceName;
  }
}
