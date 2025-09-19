import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { ClientAmrsPatient } from './model';
import {
  HieAmrsObj,
  HieClient,
  HieClientDependant,
  HieClientSearchDto
} from '../models/hie-registry.model';
import { HealthInformationExchangeService } from '../hie-api/health-information-exchange.service';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import { PersonResourceService } from '../openmrs-api/person-resource.service';
import { HieToAmrsPersonAdapter } from '../utils/hei-to-amrs-patient.adapter';
import { PatientService } from '../patient-dashboard/services/patient.service';
import { Patient } from '../models/patient.model';
import { PatientRelationshipService } from '../patient-dashboard/common/patient-relationships/patient-relationship.service';
import {
  catchError,
  finalize,
  map,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { Relationship } from '../models/relationship.model';
import { EMPTY, forkJoin, Observable, Subject } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { IdentifierTypesUuids } from '../constants/identifier-types';

@Component({
  selector: 'app-hie-amrs-person-sync',
  templateUrl: './hie-amrs-person-sync.component.html',
  styleUrls: ['./hie-amrs-person-sync.component.css']
})
export class HieToAmrsPersonSyncComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() clientPatient: ClientAmrsPatient;
  hieAmrsData: HieAmrsObj[] = [];
  hieDataToSync: string[] = [];
  dependants: HieClientDependant[] = [];
  patientRelationships = [];
  dependantRelatonshipTypes = ['Child', 'Spouse'];
  private destroy$ = new Subject<boolean>();
  currentPatient: Patient;
  showSuccessAlert = false;
  successAlert = '';
  showErrorAlert = false;
  errorTitle = '';
  errorAlert = '';
  titleCasePipe = new TitleCasePipe();
  showLoader = false;
  loadingMessage = null;
  hieIdentifiers = ['SHA Number', 'National ID', 'Household Number', 'id'];
  identifierLocation = '';

  constructor(
    private hieService: HealthInformationExchangeService,
    private patientResourceService: PatientResourceService,
    private personResourceService: PersonResourceService,
    private hieToAmrsPersonAdapter: HieToAmrsPersonAdapter,
    private patientService: PatientService,
    private patientRelationshipService: PatientRelationshipService
  ) {}

  ngOnInit(): void {
    this.getCurrentlyLoadedPatient();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.clientPatient) {
      if (changes.clientPatient.currentValue) {
        this.generateAmrsPersonDataFromHieClient();
        this.getPatientRelationships();
        this.setDefaultIdentifierLocation();
      }
    }
  }
  getCurrentlyLoadedPatient() {
    this.patientService.currentlyLoadedPatient
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          if (res) {
            this.currentPatient = res;
          }
        })
      )
      .subscribe();
  }

  generateAmrsPersonDataFromHieClient() {
    this.hieAmrsData = this.hieToAmrsPersonAdapter.generateAmrsHiePatientData(
      this.clientPatient.client,
      this.clientPatient.patient
    );
    this.dependants = this.hieToAmrsPersonAdapter.generateHieDependantsArray(
      this.clientPatient.client.dependants
    );
  }
  getPatientRelationships() {
    this.patientRelationshipService
      .getRelationships(this.clientPatient.patient.uuid)
      .pipe(
        take(1),
        map((res) => {
          return res.filter((rel) => {
            return this.dependantRelatonshipTypes.includes(
              rel.relationshipType
            );
          });
        }),
        tap((res) => {
          this.patientRelationships = res;
          console.log({ res });
        })
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
    if (
      this.clientPatient.patient._identifier &&
      this.clientPatient.patient._identifier.length > 0
    ) {
      this.identifierLocation = this.clientPatient.patient._identifier[0].location.uuid;
    } else {
      // default to Aboloi if patient has no set identifier location
      this.identifierLocation = '291bdf8e-93ed-4898-a58f-7d9f7f74128e';
    }
  }

  ngOnDestroy(): void {
    this.resetValues();
    this.destroy$.next();
    this.destroy$.complete();
  }

  addToSyncData(d: string, checked: boolean) {
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
              this.clientPatient.client
            )
          )
        );
      } else if (d === 'SHA Number') {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.SHA_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(
              d,
              this.clientPatient.client
            )
          )
        );
      } else if (d === 'Household Number') {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(
              d,
              this.clientPatient.client
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
    return this.clientPatient.client.other_identifications.find((ident) => {
      return ident.identification_type === identifierType;
    });
  }
  handleIdentifierUpdate(identifierTypeUuid: string, identifier: string) {
    // check if patient has existing identifier
    if (this.getCommonIdentifier(identifierTypeUuid)) {
      const selectedIdentifier = this.getIdentifier(identifierTypeUuid);
      return this.updatePatientIdentifier(
        this.clientPatient.patient.uuid,
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
        patientUuid: this.clientPatient.patient.uuid,
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
      return this.clientPatient.patient.commonIdentifiers.cr !== undefined
        ? true
        : false;
    } else if (
      identifierTypeUuid === IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID
    ) {
      return this.clientPatient.patient.commonIdentifiers.hhNo !== undefined
        ? true
        : false;
    } else if (identifierTypeUuid === IdentifierTypesUuids.SHA_UUID) {
      return this.clientPatient.patient.commonIdentifiers.sha !== undefined
        ? true
        : false;
    } else {
      return false;
    }
  }
  getIdentifier(identifierTypeUuid: string) {
    const identifier = this.clientPatient.patient._identifier.find((id) => {
      return id.identifierType.uuid === identifierTypeUuid;
    });
    return identifier;
  }
  syncPersonAttributes() {
    this.displayLoader('Syncing patient attributes...');
    const attributePayload = this.hieToAmrsPersonAdapter.generateAmrsPersonAttributeData(
      this.clientPatient.client,
      this.clientPatient.patient,
      this.hieDataToSync
    );
    if (Object.keys(attributePayload).length > 0) {
      this.updatePersonAttributes({
        patientUuid: this.clientPatient.patient.uuid,
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
    this.hideLoader();
    this.resetError();
    this.resetSuccess();
    this.hieDataToSync = [];
    this.hieAmrsData = [];
  }
}
