import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, EMPTY, forkJoin, Observable, Subject } from 'rxjs';
import { catchError, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { HealthInformationExchangeService } from '../../../../../hie-api/health-information-exchange.service';
import {
  HieAmrsObj,
  HieClient,
  HieClientSearchDto
} from '../../../../../models/hie-registry.model';
import { TitleCasePipe } from '@angular/common';
import { Patient } from '../../../../../models/patient.model';
import { PatientResourceService } from '../../../../../openmrs-api/patient-resource.service';
import { PersonResourceService } from '../../../../../openmrs-api/person-resource.service';
import { HieToAmrsPersonAdapter } from 'src/app/utils/hei-to-amrs-patient.adapter';
import { IdentifierTypesUuids } from '../../../../../constants/identifier-types';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';

@Component({
  selector: 'app-verify-hie-dialog',
  templateUrl: './verify-hie-identifier.dialog.component.html',
  styleUrls: ['./verify-hie-identifier.dialog.component.css']
})
export class VerifyHieIdentifierDialogComponent implements OnInit, OnDestroy {
  @Input() show = false;
  @Output() hideVerifyDialog = new EventEmitter<boolean>();
  @Input() patient: Patient = new Patient({});
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

  constructor(
    private hieService: HealthInformationExchangeService,
    private patientResourceService: PatientResourceService,
    private personResourceService: PersonResourceService,
    private hieToAmrsPersonAdapter: HieToAmrsPersonAdapter,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.setFormDefaultValues();
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
    this.displayLoader('Fetching patient data from HIE...');
    this.hieService
      .fetchClient(hieClientSearchDto)
      .pipe(
        tap((res) => {
          this.hieCleint = res.length > 0 ? res[0] : null;
          this.hieAmrsData = this.hieToAmrsPersonAdapter.generateAmrsHiePatientData(
            this.hieCleint,
            this.patient
          );
          this.setDefaultIdentifierLocation();
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
  setDefaultIdentifierLocation() {
    if (this.patient._identifier && this.patient._identifier.length > 0) {
      this.identifierLocation = this.patient._identifier[0].location.uuid;
    } else {
      // default to Aboloi if patient has no set identifier location
      this.identifierLocation = '291bdf8e-93ed-4898-a58f-7d9f7f74128e';
    }
  }

  generatePayload(): HieClientSearchDto {
    const { identifierType, identifierValue } = this.verifyForm.value;
    return {
      identificationNumbeType: identifierType,
      identificationNumber: identifierValue
    };
  }
  ngOnDestroy(): void {
    this.resetValues();
    this.destroy$.next();
    this.destroy$.complete();
  }

  addToSyncData(d: HieAmrsObj, checked: boolean) {
    if (checked) {
      this.hieDataToSync.push(d);
    } else {
      this.hieDataToSync = this.hieDataToSync.filter((v) => {
        return v !== d;
      });
    }
  }

  syncData() {
    this.syncPersonAttributes();
    this.syncPatientIdentifiers();
  }
  syncPatientIdentifiers() {
    this.displayLoader('Syncing patient identifiers...');
    const reqObs$: Observable<any>[] = [];
    const dataToSync = this.hieDataToSync.filter((d) => {
      return this.hieIdentifiers.includes(d);
    });

    for (const d of dataToSync) {
      if (d === 'id') {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(
              d,
              this.hieCleint
            )
          )
        );
      } else if (d === 'SHA Number') {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.SHA_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(
              d,
              this.hieCleint
            )
          )
        );
      } else if (d === 'Household Number') {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(
              d,
              this.hieCleint
            )
          )
        );
      }
    }

    forkJoin(reqObs$)
      .pipe(
        map((res) => {
          if (res) {
            this.handleSuccess('Patient Identifiers successfully set');
            return res;
          } else {
            throw new Error(
              'An error occurred while syncing patient identifiers'
            );
          }
        }),
        takeUntil(this.destroy$),
        catchError((error) => {
          this.handleError(
            error.error.message ||
              'An error occurred while syncing the patient identifiers'
          );
          throw EMPTY;
        }),
        finalize(() => {
          this.hideLoader();
        })
      )
      .subscribe();
  }
  getHieOtherIdentifier(identifierType: string) {
    return this.hieCleint.other_identifications.find((ident) => {
      return ident.identification_type === identifierType;
    });
  }
  handleIdentifierUpdate(identifierTypeUuid: string, identifier: string) {
    // check if patient has existing identifier
    if (this.getCommonIdentifier(identifierTypeUuid)) {
      const selectedIdentifier = this.getIdentifier(identifierTypeUuid);
      return this.updatePatientIdentifier(
        this.patient.uuid,
        selectedIdentifier.uuid,
        {
          identifier: identifier,
          location: selectedIdentifier.location.uuid || '',
          identifierType: identifierTypeUuid
        }
      );
    } else {
      // if not create a new one
      return this.createPatientIdentifier({
        patientUuid: this.patient.uuid,
        identifier: {
          identifier: identifier,
          location: this.identifierLocation,
          identifierTypeUuid: identifierTypeUuid
        }
      });
    }
  }
  getCommonIdentifier(identifierTypeUuid: string) {
    if (identifierTypeUuid === IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID) {
      return this.patient.commonIdentifiers.cr !== undefined ? true : false;
    } else if (
      identifierTypeUuid === IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID
    ) {
      return this.patient.commonIdentifiers.hhNo !== undefined ? true : false;
    } else if (identifierTypeUuid === IdentifierTypesUuids.SHA_UUID) {
      return this.patient.commonIdentifiers.sha !== undefined ? true : false;
    } else {
      return false;
    }
  }
  getIdentifier(identifierTypeUuid: string) {
    const identifier = this.patient._identifier.find((id) => {
      return id.identifierType.uuid === identifierTypeUuid;
    });
    return identifier;
  }
  syncPersonAttributes() {
    this.displayLoader('Syncing patient attributes...');
    const attributePayload = this.hieToAmrsPersonAdapter.generateAmrsPersonAttributeData(
      this.hieCleint,
      this.patient,
      this.hieDataToSync
    );
    if (Object.keys(attributePayload).length > 0) {
      this.updatePersonAttributes({
        patientUuid: this.patient.uuid,
        payload: attributePayload
      });
    }
  }
  updatePersonAttributes(updatePersonAttributePayload: {
    patientUuid: string;
    payload: any;
  }) {
    const { patientUuid, payload } = updatePersonAttributePayload;
    this.personResourceService
      .saveUpdatePerson(patientUuid, payload)
      .pipe(
        takeUntil(this.destroy$),
        map((res) => {
          if (res) {
            this.handleSuccess('Patient Attributes successfully set');
            return res;
          } else {
            throw new Error(
              'An error occurred while syncing patient attributes'
            );
          }
        }),
        catchError((error) => {
          this.handleError(
            error.error.message ||
              'An error occurred while syncing the patient attributes'
          );
          throw EMPTY;
        }),
        finalize(() => {
          this.hideLoader();
        })
      )
      .subscribe();
  }
  updatePatientIdentifier(
    patientUuid: string,
    identifierUuid: string,
    identifierPayload: {
      identifier: string;
      location: string;
      identifierType: string;
    }
  ) {
    return this.patientResourceService
      .saveUpdatePatientIdentifier(
        patientUuid,
        identifierUuid,
        identifierPayload
      )
      .pipe(takeUntil(this.destroy$));
  }
  createPatientIdentifier(createIdentifierPayload: {
    patientUuid: string;
    identifier: {
      identifier: string;
      location: string;
      identifierTypeUuid: string;
    };
  }) {
    const identifierPayload = {
      identifier: createIdentifierPayload.identifier.identifier,
      location: createIdentifierPayload.identifier.location,
      identifierType: createIdentifierPayload.identifier.identifierTypeUuid
    };
    return this.patientResourceService
      .saveUpdatePatientIdentifier(
        createIdentifierPayload.patientUuid,
        '',
        identifierPayload
      )
      .pipe(
        takeUntil(this.destroy$),
        map((res) => {
          if (res) {
            this.handleSuccess('Patient Attributes successfully set');
            return res;
          } else {
            throw new Error(
              'An error occurred while syncing patient attributes'
            );
          }
        }),
        catchError((error) => {
          this.handleError(
            error.error.message ||
              'An error occurred while syncing the patient attributes'
          );
          throw EMPTY;
        }),
        finalize(() => {
          this.hideLoader();
        })
      );
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
