import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HieClientVerificationIdentifierType } from 'src/app/constants/identifier-types';
import { Subject } from 'rxjs';
import { catchError, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { HieOtpClientConsentService } from '../patient-otp-verification.service';
import { HealthInformationExchangeService } from 'src/app/hie-api/health-information-exchange.service';
import {
  RequestCustomOtpDto,
  ValidateHieCustomOtpDto
} from 'src/app/models/hie-registry.model';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './patient-otp-verification-dialog.component.html',
  styleUrls: ['./patient-otp-verification-dialog.component.css']
})
export class PatientOtpVerificationDialogComponent
  implements OnInit, OnDestroy {
  @Input() show = false;
  @Output() hideVerifyOtpDialog = new EventEmitter<boolean>();
  otpVerificationForm = new FormGroup({
    phoneNumber: new FormControl(null, Validators.required),
    sessionId: new FormControl(null, Validators.required),
    otp: new FormControl(null, Validators.required)
  });
  sendCustomOtpForm = new FormGroup({
    identificationNumber: new FormControl(null, Validators.required),
    identificationType: new FormControl(null, Validators.required)
  });
  showErrorAlert = false;
  errorAlert = null;
  successAlert = null;
  hasOtp = false;
  destroy$ = new Subject<boolean>();
  sessionId: string;
  showLoader = false;
  loadingMessage = null;

  hieClientVerificationIdentifierTypes = Object.keys(
    HieClientVerificationIdentifierType
  ).map((key) => {
    return {
      label: HieClientVerificationIdentifierType[key],
      value: HieClientVerificationIdentifierType[key]
    };
  });
  public currentUserLocation: { uuid: string; display: string };

  constructor(
    private hieService: HealthInformationExchangeService,
    private hieOtpClientConsentService: HieOtpClientConsentService,
    private userDefaultPropertiesService: UserDefaultPropertiesService
  ) {}

  ngOnInit(): void {
    this.getUserCurrentLocation();
  }

  getUserCurrentLocation() {
    this.currentUserLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  isValidHieOtpValidatePayload(payload: ValidateHieCustomOtpDto): boolean {
    if (!payload.sessionId) {
      this.displayErrorAlert('Please ensure you have a valid sessionId');
      return false;
    }
    if (!payload.otp) {
      this.displayErrorAlert('Please ensure you have entered a valid otp');
      return false;
    }

    return true;
  }
  displayErrorAlert(msg: string) {
    this.showErrorAlert = true;
    this.errorAlert = msg;
  }
  resetErrorAlert() {
    this.showErrorAlert = false;
    this.errorAlert = null;
  }
  resetAlerts() {
    this.resetErrorAlert();
  }
  generateValidateOtopPayload(): ValidateHieCustomOtpDto {
    const { sessionId, otp } = this.otpVerificationForm.value;
    return {
      sessionId: sessionId,
      otp: otp,
      locationUuid: this.currentUserLocation.uuid || ''
    };
  }
  validateHieOtp() {
    this.resetAlerts();
    const payload = this.generateValidateOtopPayload();
    if (this.isValidHieOtpValidatePayload(payload)) {
      this.requestOtpValidation(payload);
    }
  }
  requestOtpValidation(validateHieCustomOtpDto: ValidateHieCustomOtpDto) {
    this.displayLoader('Validating client OTP. Please wait....');
    this.hieService
      .validateCustomOtp(validateHieCustomOtpDto)
      .pipe(
        takeUntil(this.destroy$),
        map((res) => {
          if ('error' in res) {
            throw new Error(
              res.error ||
                'An error occurred while validating the otp, kindly request again'
            );
          }
          if ('data' in res) {
            this.displayLoader('OTP Successfully Validated!');
            return res;
          }
        }),
        tap((res) => {
          if (res.data) {
            this.hieOtpClientConsentService.validateOtp(res);
            this.hideDialog();
          }
        }),
        finalize(() => {
          this.hideLoader();
        }),
        catchError((error) => {
          this.handleErrorResponse(error);
          throw error;
        })
      )
      .subscribe();
  }
  hideDialog() {
    this.hideVerifyOtpDialog.emit(true);
  }

  requestCustomHieOtp() {
    this.resetAlerts();
    const payload = this.generateRequestOtpPayload();
    if (this.isValidRequestCustomOtpPayload(payload)) {
      this.getCustomHieOtp(payload);
    }
  }
  handleErrorResponse(error: any) {
    let errorMsg = '';
    if (error.error) {
      if (error.error.details) {
        errorMsg = error.error.details;
      } else {
        errorMsg = error.error;
      }
    } else {
      if (error.message) {
        errorMsg = error.message;
      }
    }
    this.displayErrorAlert(errorMsg);
  }
  getCustomHieOtp(requestCustomOtpDto: RequestCustomOtpDto) {
    this.displayLoader('Sending OTP to client. Please wait....');
    this.hieService
      .requestCustomOtp(requestCustomOtpDto)
      .pipe(
        takeUntil(this.destroy$),
        map((res) => {
          if ('error' in res) {
            throw new Error(res.error);
          }
          if (res && res.message) {
            return res;
          } else {
            throw new Error(
              'An error occurred while requesting OTP message, please try again'
            );
          }
        }),
        tap((res) => {
          this.hasOtp = true;
          this.sessionId = res.sessionId;
          this.setOtpSessionAndPhone(this.sessionId, res.maskedPhone);
        }),
        finalize(() => {
          this.hideLoader();
        }),
        catchError((error) => {
          this.handleErrorResponse(error);
          throw error;
        })
      )
      .subscribe();
  }
  setOtpSessionAndPhone(sessionId: string, phoneNumber: string) {
    this.otpVerificationForm.patchValue({
      sessionId: sessionId,
      phoneNumber: phoneNumber
    });
  }
  generateRequestOtpPayload(): RequestCustomOtpDto {
    const {
      identificationNumber,
      identificationType
    } = this.sendCustomOtpForm.value;
    return {
      identificationNumber: identificationNumber,
      identificationType: identificationType,
      locationUuid: this.currentUserLocation.uuid || ''
    };
  }
  isValidRequestCustomOtpPayload(payload: RequestCustomOtpDto) {
    if (!payload.identificationNumber) {
      this.displayErrorAlert(
        'Please ensure you have the correct identification number'
      );
      return false;
    }
    if (!payload.identificationType) {
      this.displayErrorAlert(
        'Please ensure you have the correct identification type'
      );
      return false;
    }
    if (!payload.locationUuid) {
      this.displayErrorAlert(
        'Please ensure you have selected a user default location'
      );
      return false;
    }
    return true;
  }
  displayLoader(msg: string) {
    this.showLoader = true;
    this.loadingMessage = msg;
  }
  hideLoader() {
    this.showLoader = false;
    this.loadingMessage = null;
  }
  registerOnAfyaYangu() {
    window.open('https://afyayangu.go.ke/', '_blank');
  }
  resendHieOtp() {
    this.requestCustomHieOtp();
  }
}
