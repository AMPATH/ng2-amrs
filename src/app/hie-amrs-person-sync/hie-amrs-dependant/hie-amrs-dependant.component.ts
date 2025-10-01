import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
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
import { EMPTY, of, Subject } from 'rxjs';
import { IdentifierTypesUuids } from 'src/app/constants/identifier-types';
import { PersonResourceService } from 'src/app/openmrs-api/person-resource.service';
import { PatientRelationshipService } from 'src/app/patient-dashboard/common/patient-relationships/patient-relationship.service';
import { CreateRelationshipDto } from 'src/app/interfaces/relationship.interface';
import { CreatePersonDto } from 'src/app/interfaces/person.interface';
import { HieClientAmrsPersonSyncService } from '../hie-amrs-person-sync.service';
import { PatientIdentifier } from 'src/app/models/patient-identifier.model';

@Component({
  selector: 'app-hie-dependant',
  templateUrl: './hie-amrs-dependant.component.html',
  styleUrls: ['./hie-amrs-dependant.component.scss']
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
  private destroy$ = new Subject();
  identifierLocation = '';
  dependantPersonCreated = false;
  syncColumns: string[] = [];
  errors: string[] = [];
  sucessMsgs: string[] = [];
  selectedColMap = new Map<string, string>();

  constructor(
    private hieToAmrsPersonAdapter: HieToAmrsPersonAdapter,
    private patientResourceService: PatientResourceService,
    private personResourceService: PersonResourceService,
    private patientRelationshipService: PatientRelationshipService,
    private hieClientAmrsPersonSyncService: HieClientAmrsPersonSyncService
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
    this.syncColumns = this.hieAmrsData.map((d) => {
      return d.key;
    });
  }
  addToSyncData(d: string, checked: boolean) {
    if (checked) {
      this.selectedColMap.set(d, d);
    } else {
      if (this.selectedColMap.has(d)) {
        this.selectedColMap.delete(d);
      }
    }
    this.generateHieDataToSyncFromMap();
  }
  generateHieDataToSyncFromMap() {
    this.hieDataToSync = Array.from(this.selectedColMap.keys());
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
        takeUntil(this.destroy$),
        tap((res) => {
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
    this.resetMsgs();
    if (this.isValidateSyncCols()) {
      this.syncPersonAttributes();
      this.syncPatientIdentifiers();
    }
  }
  isValidateSyncCols(): boolean {
    if (!this.hieDataToSync.includes('id')) {
      // check if patient has CR Number already
      const patient = this.patient || null;
      if (!patient) {
        return true;
      }
      const hasCr = this.hasCrIdentifier(patient.identifiers as any);
      if (patient && !hasCr) {
        this.handleError('Please ensure you have selected CR Number to sync');
        return false;
      }
    }

    return true;
  }
  hasCrIdentifier(patientIdentifiers: PatientIdentifier[]) {
    return patientIdentifiers.some((id) => {
      return (
        id.identifierType.uuid === IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID
      );
    });
  }
  syncPatientIdentifiers() {
    this.displayLoader('Syncing patient identifiers...');
    this.hieClientAmrsPersonSyncService
      .syncPatientIdentifiers(
        this.hieDataToSync,
        this.hieDependant,
        this.patient,
        this.identifierLocation
      )
      .pipe(
        takeUntil(this.destroy$),
        map((res) => {
          if (res) {
            return res;
          } else {
            return EMPTY;
          }
        }),
        tap((res: PatientIdentifier[]) => {
          if (res && res.length > 0) {
            res.forEach((r) => {
              this.handleSuccess(
                `Done! Successfully updated patient identifier ${r.display}`
              );
            });
          }
        }),
        catchError((err: Error) => {
          const errMsg = this.hieClientAmrsPersonSyncService.getErrorMsgFromErrorResponseMsg(
            err
          );
          this.handleError(errMsg);
          return of(null);
        }),
        finalize(() => {
          this.hideLoader();
        })
      )
      .subscribe();
  }
  syncPersonAttributes() {
    this.displayLoader('Syncing patient attributes...');
    const attributePayload: CreatePersonDto = this.hieToAmrsPersonAdapter.generateAmrsPersonPayload(
      this.hieDependant,
      this.hieDataToSync
    );
    this.hieClientAmrsPersonSyncService
      .syncPersonAttributes(this.hieDataToSync, this.hieDependant, this.patient)
      .pipe(
        takeUntil(this.destroy$),
        map((res) => {
          if (res) {
            this.handleSuccess('Done! Successfully updated patient attributes');
            return res;
          } else {
            return EMPTY;
          }
        }),
        catchError((error) => {
          const errMsg = this.hieClientAmrsPersonSyncService.getErrorMsgFromErrorResponseMsg(
            error
          );
          this.handleError(errMsg);
          return of(null);
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
  handleError(errorMessage: string) {
    this.errors.push(errorMessage);
  }
  handleSuccess(mgs: string) {
    this.sucessMsgs.push(mgs);
  }
  resetSuccess() {
    this.sucessMsgs = [];
  }
  resetError() {
    this.errors = [];
  }
  resetMsgs() {
    this.resetSuccess();
    this.resetError();
  }
  resetValues() {
    this.patient = null;
    this.hideLoader();
    this.resetError();
    this.resetSuccess();
    this.hieDataToSync = [];
    this.hieAmrsData = [];
    this.selectedColMap.clear();
  }
  createDependant() {
    this.resetMsgs();
    const createPersonPayload: CreatePersonDto = this.hieToAmrsPersonAdapter.generateAmrsPersonPayload(
      this.hieDependant,
      null
    );
    this.createPerson(createPersonPayload)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((res) => {
          if (res) {
            const relationshipPayload: CreateRelationshipDto = this.hieToAmrsPersonAdapter.getPatientRelationshipPayload(
              this.hieDependant.relationship,
              this.currentPatient.uuid,
              res.uuid
            );
            return this.createRelationship(relationshipPayload);
          } else {
            return EMPTY;
          }
        }),
        tap((res) => {
          if (res) {
            this.handleSuccess('Dependant Created in AMRS');
            this.dependantPersonCreated = true;
          }
        }),
        catchError((error) => {
          const errMsg = this.hieClientAmrsPersonSyncService.getErrorMsgFromErrorResponseMsg(
            error
          );
          this.handleError(errMsg);
          return of(null);
        })
      )
      .subscribe();
  }

  createPerson(createPersonPayload: CreatePersonDto) {
    return this.personResourceService.createPerson(createPersonPayload).pipe(
      take(1),
      map((res) => {
        if (res) {
          this.handleSuccess('Person has been successfully created');
          return res;
        } else {
          return EMPTY;
        }
      }),
      catchError((error) => {
        const errMsg = this.hieClientAmrsPersonSyncService.getErrorMsgFromErrorResponseMsg(
          error
        );
        this.handleError(errMsg);
        return of(null);
      })
    );
  }

  createRelationship(relationshipPayload: CreateRelationshipDto) {
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
            err.message || 'An error occurred while creating the relationship'
          );
          throw err;
        })
      );
  }
  syncAllData(checked: boolean) {
    if (checked) {
      this.syncColumns.forEach((c) => {
        this.selectedColMap.set(c, c);
      });
    } else {
      this.selectedColMap.clear();
    }
    this.generateHieDataToSyncFromMap();
  }
}
