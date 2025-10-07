import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FhirBundle } from '../../../../models/hie-shr.model';
import { HealthInformationExchangeService } from '../../../../hie-api/health-information-exchange.service';
import { HieOtpClientConsentService } from '../../../../otp-verification/hie-otp-verification/patient-otp-verification.service';
import { Subject } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-shr-encounters',
  templateUrl: './shr-encounters.component.html',
  styleUrls: ['./shr-encounters.component.scss']
})
export class ShrEncountersComponent implements OnInit, OnDestroy {
  @Input() public crNo = '';
  public clientConsentGiven = false;
  public patientFhirBundle: FhirBundle;
  public showOtpVericationDialog = false;
  private destroy$ = new Subject<boolean>();
  public source = 'shr';
  public showLoader = false;
  public loadingMessage: string;
  public messageObj: { message: string; type: 'Error' | 'Success' } = {
    message: '',
    type: null
  };

  constructor(
    private hieService: HealthInformationExchangeService,
    private hieOtpClientConsentService: HieOtpClientConsentService
  ) {}

  public ngOnInit(): void {
    this.listenToHieOtpConsentChanges();
  }
  public ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public displayHieOtpDialog() {
    this.showOtpVericationDialog = true;
  }
  public hideHieOtpDialog() {
    this.showOtpVericationDialog = false;
  }
  listenToHieOtpConsentChanges() {
    this.hieOtpClientConsentService.otpValidation$
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          if (
            res &&
            res.data &&
            res.data.status === 'valid' &&
            res.source === this.source
          ) {
            this.clientConsentGiven = true;
          }
        })
      )
      .subscribe();
  }
  fetchShrData() {
    this.resetErrors();
    if (!this.crNo) {
      this.handleError("The patient doesn't have a CR Number");
      return;
    }
    this.displayLoader('Fetching client SHR Records, please wait...');
    this.hieService
      .getPatientShrSummary(this.crNo)
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          if (res) {
            this.patientFhirBundle = res;
            this.handleSuccess('Client SHR data successfully fetched!');
          }
        }),
        finalize(() => {
          this.hideLoader();
        }),
        catchError((error: Error) => {
          this.handleError(
            error.message ||
              'An error ocurred while fetching patient Shared Health Records'
          );
          throw error;
        })
      )
      .subscribe();
  }
  displayLoader(message: string) {
    this.showLoader = true;
    this.loadingMessage = message;
  }
  hideLoader() {
    this.showLoader = false;
    this.loadingMessage = null;
  }
  handleError(message: string) {
    this.messageObj = {
      message: message,
      type: 'Success'
    };
  }
  handleSuccess(message: string) {
    this.messageObj = {
      message: message,
      type: 'Success'
    };
  }
  resetErrors() {
    this.messageObj = {
      message: '',
      type: null
    };
  }
}
