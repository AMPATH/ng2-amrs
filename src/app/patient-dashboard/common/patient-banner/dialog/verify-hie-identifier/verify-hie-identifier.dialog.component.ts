import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { catchError, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { HealthInformationExchangeService } from '../../../../../hie-api/health-information-exchange.service';
import {
  HieAmrsObj,
  HieClient,
  HieClientSearchDto,
  ValidateHieCustomOtpResponse
} from '../../../../../models/hie-registry.model';
import { TitleCasePipe } from '@angular/common';
import { Patient } from '../../../../../models/patient.model';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { ClientAmrsPatient } from 'src/app/hie-amrs-person-sync/model';

@Component({
  selector: 'app-verify-hie-dialog',
  templateUrl: './verify-hie-identifier.dialog.component.html',
  styleUrls: ['./verify-hie-identifier.dialog.component.scss']
})
export class VerifyHieIdentifierDialogComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() show = false;
  @Output() hideVerifyDialog = new EventEmitter<boolean>();
  @Input() patient: Patient = new Patient({});
  @Input() otpConsent: ValidateHieCustomOtpResponse;
  verifyForm = new FormGroup({
    identifierType: new FormControl('National ID', Validators.required),
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

  constructor(
    private hieService: HealthInformationExchangeService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.setFormDefaultValues();
  }
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
  setFormDefaultValues() {
    this.verifyForm.patchValue({
      identifierType: 'National ID'
    });
  }
  hideDialog() {
    this.resetValues();
    this.show = false;
    this.hideVerifyDialog.emit(true);
    this.patientService.reloadCurrentPatient();
  }
  searchRegistry() {
    const payload = this.generatePayload();
    this.fetchClient(payload);
  }
  fetchClient(hieClientSearchDto: HieClientSearchDto) {
    this.resetError();
    this.displayLoader('Fetching patient data from Client Registry...');
    this.hieService
      .fetchClient(hieClientSearchDto)
      .pipe(
        tap((res) => {
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
          this.handleError(
            error.error.details ||
              'An error occurred while fetching the patient'
          );
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

  generatePayload(): HieClientSearchDto {
    const { identifierType, identifierValue } = this.verifyForm.value;
    return {
      identificationType: identifierType,
      identificationNumber: identifierValue
    };
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
    this.resetError();
    this.resetSuccess();
    this.hieDataToSync = [];
    this.hieAmrsData = [];
  }
}
