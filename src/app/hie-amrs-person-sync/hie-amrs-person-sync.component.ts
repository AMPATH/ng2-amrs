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
import { ClientAmrsPatient } from './model';
import {
  HieAmrsObj,
  HieClientDependant,
  HieIdentificationType
} from '../models/hie-registry.model';
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
import { EMPTY, of, Subject } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HieClientAmrsPersonSyncService } from './hie-amrs-person-sync.service';

@Component({
  selector: 'app-hie-amrs-person-sync',
  templateUrl: './hie-amrs-person-sync.component.html',
  styleUrls: ['./hie-amrs-person-sync.component.scss']
})
export class HieToAmrsPersonSyncComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() clientPatient: ClientAmrsPatient;
  @Output() closeSyncModal = new EventEmitter<boolean>();
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
  hieIdentifiers = [
    HieIdentificationType.SHANumber,
    HieIdentificationType.NationalID,
    HieIdentificationType.HouseholdNumber,
    HieIdentificationType.Cr,
    HieIdentificationType.RefugeeID,
    HieIdentificationType.MandateNumber,
    HieIdentificationType.AlienID
  ];
  identifierLocation = '';
  syncColumns: string[] = [];
  errors: string[] = [];

  constructor(
    private hieToAmrsPersonAdapter: HieToAmrsPersonAdapter,
    private patientService: PatientService,
    private patientRelationshipService: PatientRelationshipService,
    private router: Router,
    private route: ActivatedRoute,
    private hieClientAmrsPersonSyncService: HieClientAmrsPersonSyncService
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
    this.syncColumns = this.hieAmrsData.map((d) => {
      return d.key;
    });
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
        })
      )
      .subscribe();
  }

  handleError(errorMessage: string) {
    this.showErrorAlert = true;
    this.errorAlert = errorMessage;
    this.errors.push(errorMessage);
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
    this.errors = [];
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
      this.hieDataToSync = [...this.hieDataToSync, d];
    } else {
      this.hieDataToSync = this.hieDataToSync.filter((v) => {
        return v !== d;
      });
    }
  }

  syncData() {
    this.resetMessages();
    if (this.isValidateSyncCols()) {
      this.syncPersonAttributes();
      this.syncPatientIdentifiers();
    }
  }
  isValidateSyncCols(): boolean {
    if (!this.hieDataToSync.includes('id')) {
      // check if patient has CR Number already
      const patient = this.clientPatient.patient || null;
      if (
        patient &&
        patient.searchIdentifiers &&
        patient.searchIdentifiers.cr
      ) {
      } else {
        this.handleError('Please ensure you have selected CR Number to sync');
        return false;
      }
    }

    return true;
  }
  syncPatientIdentifiers() {
    this.displayLoader('Syncing patient identifiers...');
    this.hieClientAmrsPersonSyncService
      .syncPatientIdentifiers(
        this.hieDataToSync,
        this.clientPatient.client,
        this.clientPatient.patient,
        this.identifierLocation
      )
      .pipe(
        takeUntil(this.destroy$),
        map((res) => {
          if (res) {
            this.handleSuccess('Patient Identifiers successfully set');
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
          throw EMPTY;
        }),
        finalize(() => {
          this.hideLoader();
        })
      )
      .subscribe();
  }

  syncPersonAttributes() {
    this.displayLoader('Syncing patient attributes...');
    this.hieClientAmrsPersonSyncService
      .syncPersonAttributes(
        this.hieDataToSync,
        this.clientPatient.client,
        this.clientPatient.patient
      )
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
  resetValues() {
    this.hideLoader();
    this.resetError();
    this.resetSuccess();
    this.hieDataToSync = [];
    this.hieAmrsData = [];
  }
  resetMessages() {
    this.resetSuccess();
    this.resetError();
  }
  navigateToPatientRelationships() {
    this.router
      .navigate(['./general/general/patient-info'], {
        relativeTo: this.route
      })
      .then(() => {
        this.closeSyncModal.emit(true);
      });
  }
  syncAllData(checked: boolean) {
    if (checked) {
      this.hieDataToSync = this.syncColumns;
    } else {
      this.hieDataToSync = [];
    }
  }
}
