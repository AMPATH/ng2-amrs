import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { HealthInformationExchangeService } from '../../../../../hie-api/health-information-exchange.service';
import {
  HieAmrsObj,
  HieClient,
  HieClientSearchDto,
  ValidateHieCustomOtpResponse
} from '../../../../../models/hie-registry.model';
import { TitleCasePipe } from '@angular/common';
import { Patient } from '../../../../../models/patient.model';
import { ClientAmrsPatient } from '../../../../../hie-amrs-person-sync/model';

@Component({
  selector: 'app-verify-hie-dialog',
  templateUrl: './verify-hie-identifier.dialog.component.html',
  styleUrls: ['./verify-hie-identifier.dialog.component.scss']
})
export class VerifyHieIdentifierDialogComponent
  implements OnDestroy, OnChanges {
  @Input() show = false;
  @Output() hideVerifyDialog = new EventEmitter<boolean>();
  @Input() patient: Patient = new Patient({});
  @Input() otpConsent: ValidateHieCustomOtpResponse;
  verifyForm = new FormGroup({
    identifierType: new FormControl(null, Validators.required),
    identifierValue: new FormControl(null, Validators.required)
  });
  showSuccessAlert = false;
  successAlert = '';
  showErrorAlert = false;
  errorTitle = '';
  errorAlert = '';
  private destroy$ = new Subject();
  hieCleint: HieClient;
  hieAmrsData: HieAmrsObj[] = [];
  titleCasePipe = new TitleCasePipe();
  showLoader = false;
  loadingMessage = null;

  hieDataToSync = [];

  hieIdentifiers = ['SHA Number', 'National ID', 'Household Number', 'id'];
  identifierLocation = '';

  clientPatient: ClientAmrsPatient;

  constructor(private hieService: HealthInformationExchangeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.otpConsent) {
      if (changes.otpConsent.currentValue) {
        const res: ValidateHieCustomOtpResponse =
          changes.otpConsent.currentValue;
        this.verifyForm.patchValue({
          identifierType: res.data.identification_type,
          identifierValue: res.data.identification_number
        });
      }
    }
  }
  hideDialog() {
    this.resetValues();
    this.show = false;
    this.hideVerifyDialog.emit(true);
  }
  searchClientRegistry() {
    const payload = this.generatePayload();
    if (this.isValidPayload(payload)) {
      this.fetchClient(payload);
    }
  }

  fetchClient(hieClientSearchDto: HieClientSearchDto) {
    this.resetError();
    this.displayLoader('Fetching patient data from Client Registry...');
    this.hieService
      .fetchClient(hieClientSearchDto)
      .pipe(
        tap((res: any) => {
          this.hieCleint = res.length > 0 ? res[0] : null;
          this.clientPatient = {
            client: this.hieCleint,
            patient: this.patient
          };
        }),
        finalize(() => {
          this.hideLoader();
        }),
        catchError((error) => {
          this.handleErrorResponse(error);
          throw error;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
  handleError(errorMessage: string) {
    this.showErrorAlert = true;
    this.errorAlert = errorMessage;
  }
  handleErrorResponse(error: any) {
    let errorMsg = '';
    if (error.message) {
      errorMsg = error.message;
    } else if (error.error) {
      errorMsg = error.error;
    }
    this.handleError(errorMsg);
  }
  handleSuccess(mgs: string) {
    this.showSuccessAlert = true;
    this.successAlert = mgs;
  }
  resetSuccess() {
    this.showSuccessAlert = false;
    this.successAlert = null;
  }
  resetError() {
    this.showErrorAlert = false;
    this.errorAlert = null;
  }
  resetAlerts() {
    this.resetSuccess();
    this.resetError();
  }

  generatePayload(): HieClientSearchDto {
    this.resetAlerts();
    const { identifierType, identifierValue } = this.verifyForm.value;
    return {
      identificationType: identifierType,
      identificationNumber: identifierValue
    };
  }
  isValidPayload(payload: HieClientSearchDto): boolean {
    if (!payload.identificationNumber) {
      this.handleError('Please ensure to provide the identification number');
      return false;
    }
    if (!payload.identificationType) {
      this.handleError('Please ensure to provide the identification type');
      return false;
    }
    return true;
  }
  ngOnDestroy(): void {
    this.resetValues();
    this.destroy$.next();
    this.destroy$.complete();
  }
  displayLoader(message: string) {
    this.showLoader = true;
    this.loadingMessage = message;
  }
  hideLoader() {
    this.showLoader = false;
    this.loadingMessage = null;
  }
  resetValues() {
    this.hieCleint = null;
    this.hideLoader();
    this.resetAlerts();
    this.hieDataToSync = [];
    this.hieAmrsData = [];
  }
  closeSyncModal() {
    this.hideDialog();
  }
}
