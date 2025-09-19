import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  HieAmrsObj,
  HieClientDependant
} from '../../models/hie-registry.model';
import { HieToAmrsPersonAdapter } from '../../utils/hei-to-amrs-patient.adapter';
import {
  catchError,
  finalize,
  map,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { Patient } from 'src/app/models/patient.model';
import { EMPTY, forkJoin, Observable, of, Subject } from 'rxjs';
import { IdentifierTypesUuids } from 'src/app/constants/identifier-types';
import { PersonResourceService } from 'src/app/openmrs-api/person-resource.service';
import { error } from 'jquery';
import { PatientRelationshipService } from 'src/app/patient-dashboard/common/patient-relationships/patient-relationship.service';

@Component({
  selector: 'app-hie-dependant',
  templateUrl: './hie-amrs-dependant.component.html',
  styleUrls: ['./hie-amrs-dependant.component.css']
})
export class HieAmrsDependantComponent implements OnChanges, OnDestroy {
  @Input() hieDependant: HieClientDependant;
  @Input() personRelationships;
  @Input() currentPatient: Patient;
  public hieAmrsData: HieAmrsObj[] = [];

  selectedRelation = '';
  amrsRelationExists = false;
  hieDataToSync: string[] = [];
  showLoader = false;
  loadingMessage = '';
  hieIdentifiers = ['SHA Number', 'National ID', 'Household Number', 'id'];
  patient: Patient;
  showErrorAlert = false;
  errorAlert = null;
  showSuccessAlert = false;
  successAlert = null;
  private destroy$ = new Subject();
  identifierLocation = '';

  constructor(
    private hieToAmrsPersonAdapter: HieToAmrsPersonAdapter,
    private patientResourceService: PatientResourceService,
    private personResourceService: PersonResourceService,
    private patientRelationshipService: PatientRelationshipService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hieDependant) {
      if (changes.hieDependant.currentValue) {
        this.processDependant();
      }
    }
  }

  ngOnDestroy(): void {
    this.resetValues();
    this.destroy$.next();
    this.destroy$.complete();
  }

  processDependant() {
    this.hieAmrsData = this.hieToAmrsPersonAdapter.generateAmrsHiePatientData(
      this.hieDependant as any,
      null
    );
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
  onSelectAmrsDependant($event) {
    if ($event.length > 0) {
      this.getPatientByPersonUuid($event);
    } else {
      this.amrsRelationExists = false;
      this.updateHieAmrsData(null);
      this.hieDataToSync = [];
    }
  }
  getPatientByPersonUuid(personUuid: string) {
    this.patientResourceService
      .getPatientByUuid(personUuid)
      .pipe(
        take(1),
        tap((res) => {
          console.log(res);
          if (res) {
            this.updateHieAmrsData(res);
            this.amrsRelationExists = true;
            this.patient = res;
            this.setDefaultIdentifierLocation();
          } else {
            this.amrsRelationExists = false;
            this.patient = null;
          }
        })
      )
      .subscribe();
  }
  updateHieAmrsData(patient: Patient) {
    this.hieAmrsData = this.hieToAmrsPersonAdapter.generateAmrsHiePatientData(
      this.hieDependant as any,
      patient
    );
  }
  setDefaultIdentifierLocation() {
    if (this.patient._identifier && this.patient._identifier.length > 0) {
      this.identifierLocation = this.patient._identifier[0].location.uuid;
    } else {
      // default to Aboloi if patient has no set identifier location
      this.identifierLocation = '291bdf8e-93ed-4898-a58f-7d9f7f74128e';
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
              this.hieDependant
            )
          )
        );
      } else if (d === 'SHA Number') {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.SHA_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(
              d,
              this.hieDependant
            )
          )
        );
      } else if (d === 'Household Number') {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(
              d,
              this.hieDependant
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
        catchError((err: Error) => {
          this.handleError(
            err.message ||
              'An error occurred while syncing the patient identifiers'
          );
          throw error;
        }),
        finalize(() => {
          this.hideLoader();
        })
      )
      .subscribe();
  }
  syncPersonAttributes() {
    this.displayLoader('Syncing patient attributes...');
    const attributePayload = this.hieToAmrsPersonAdapter.generateAmrsPersonAttributeData(
      this.hieDependant,
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
        catchError((err) => {
          this.handleError(
            error.message ||
              'An error occurred while syncing the patient attributes'
          );
          throw error;
        }),
        finalize(() => {
          this.hideLoader();
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
  handleIdentifierUpdate(identifierTypeUuid: string, identifier: string) {
    // check if patient has existing identifier
    if (this.hasCommonIdentifier(identifierTypeUuid)) {
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
        catchError((err: Error) => {
          this.handleError(
            error.message ||
              'An error occurred while syncing the patient attributes'
          );
          throw error;
        }),
        finalize(() => {
          this.hideLoader();
        })
      );
  }
  hasCommonIdentifier(identifierTypeUuid: string) {
    if (identifierTypeUuid === IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID) {
      return (
        this.patient.commonIdentifiers && this.patient.commonIdentifiers.cr
      );
    } else if (
      identifierTypeUuid === IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID
    ) {
      return (
        this.patient.commonIdentifiers && this.patient.commonIdentifiers.hhNo
      );
    } else if (identifierTypeUuid === IdentifierTypesUuids.SHA_UUID) {
      return (
        this.patient.commonIdentifiers && this.patient.commonIdentifiers.sha
      );
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
  resetValues() {
    this.patient = null;
    this.hideLoader();
    this.resetError();
    this.resetSuccess();
    this.hieDataToSync = [];
    this.hieAmrsData = [];
  }
  createDependant() {
    const attributes = [
      'first_name',
      'middle_name',
      'last_name',
      'gender',
      'date_of_birth',
      'is_alive',
      'deceased_datetime',
      'country',
      'place_of_birth',
      'county',
      'sub_county',
      'ward',
      'village_estate',
      'longitude',
      'latitude',
      'phone',
      'email',
      'civil_status',
      'kra_pin',
      'id'
    ];
    const createPersonPayload = this.hieToAmrsPersonAdapter.generateAmrsPersonAttributeData(
      this.hieDependant,
      this.patient,
      attributes
    );
    console.log({ createPersonPayload });
    this.createPerson(createPersonPayload)
      .pipe(
        switchMap((res) => {
          if (res) {
            const relationshipPayload = this.hieToAmrsPersonAdapter.getPatientRelationshipPayload(
              this.hieDependant.relationship,
              this.currentPatient.uuid,
              res.uuid
            );
            console.log({ relationshipPayload });
            return this.createRelationship(relationshipPayload);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe();
    console.log('hieDependant', this.hieDependant);
  }

  createPerson(createPersonPayload) {
    return this.personResourceService.createPerson(createPersonPayload).pipe(
      take(1),
      map((res) => {
        if (res) {
          this.handleSuccess('Person has been successfully created');
          return res;
        } else {
          throw new Error('An error occurred while creating person');
        }
      }),
      catchError((err: Error) => {
        this.handleError(
          error.message ||
            'An error occurred while creating the dependant person'
        );
        throw error;
      })
    );
  }

  createRelationship(relationshipPayload) {
    return this.patientRelationshipService
      .saveRelationship(relationshipPayload)
      .pipe(
        take(1),
        map((res) => {
          if (!res) {
            throw new Error(
              'An error occurred while creating the relationship'
            );
          } else {
            this.handleSuccess('Relationship has been successfully created');
            return res;
          }
        }),
        catchError((err: Error) => {
          this.handleError(
            error.message || 'An error occurred while creating the relationship'
          );
          throw error;
        })
      );
  }
}
