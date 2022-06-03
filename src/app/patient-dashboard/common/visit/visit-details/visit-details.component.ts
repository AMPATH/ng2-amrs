import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import * as moment from 'moment';

import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';
import { EncounterResourceService } from '../../../../openmrs-api/encounter-resource.service';
import { Encounter } from '../../../../models/encounter.model';
import { RetrospectiveDataEntryService } from '../../../../retrospective-data-entry/services/retrospective-data-entry.service';
import { PatientProgramResourceService } from 'src/app/etl-api/patient-program-resource.service';
@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.css']
})
export class VisitDetailsComponent implements OnInit {
  public completedEncounterTypesUuids = [];
  public allowedEncounterTypesUuids = [];
  public isBusy = false;
  public error = '';
  public showDeleteEncountersButton = false;
  public showConfirmationDialog = false;
  public confirmingCancelVisit = false;
  public confirmingEndVisit = false;
  public editingLocation = false;
  public editingProvider = false;
  public editingVisitType = false;
  public hideButtonNav = false;
  public message: any = {
    title: '',
    message: ''
  };
  public covidScreeningUuid = '466d6707-8429-4e61-b5a0-d63444f5ad35';
  public retrospectiveAttributeTypeUuid =
    '3bb41949-6596-4ff9-a54f-d3d7883a69ed';
  public qualifiesForCovidScreening = false;
  public isRetrospectiveVisit = false;

  public get visitEncounters(): any[] {
    const mappedEncounters: Encounter[] = new Array<Encounter>();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.visit.encounters.length; i++) {
      mappedEncounters.push(new Encounter(this.visit.encounters[i]));
    }
    return mappedEncounters;
  }

  @Output()
  public formSelected = new EventEmitter<any>();

  @Output()
  public encounterSelected = new EventEmitter<any>();

  @Output()
  public visitCancelled = new EventEmitter<any>();

  @Output()
  public visitChanged = new EventEmitter<any>();

  @Input() public programUuid: any;
  @Input() public programEnrollmentUuid: any;
  public formsCollapsed = false;

  private _patient: any;
  @Input()
  public get patient(): any {
    return this._patient;
  }
  public set patient(v: any) {
    this._patient = v;
  }

  private _visit: any;
  @Input()
  public get visit(): any {
    return this._visit;
  }

  public set visit(v: any) {
    this._visit = v;
    this.extractCompletedEncounterTypes();
    if (v != null) {
      this.checkForRetrospectiveVisit();
    }
  }

  public get isVisitEnded() {
    return moment(this.visit.stopDatetime).isValid();
  }

  public get visitWithNoEncounters() {
    return !(
      this.visit &&
      Array.isArray(this.visit.encounters) &&
      this.visit.encounters.length > 0
    );
  }

  public hasValidatedEncounters = false;
  private _programVisitTypesConfig: any;
  public get programVisitTypesConfig(): any {
    return this._programVisitTypesConfig;
  }

  @Input()
  public set programVisitTypesConfig(obj: any) {
    if (
      obj &&
      Object.keys(obj).length !== 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    ) {
      this.hasValidatedEncounters = true;
      this.extractAllowedEncounterTypesForVisit(obj);
    }
    this._programVisitTypesConfig = obj;
  }

  constructor(
    private visitResourceService: VisitResourceService,
    private retrospectiveDataEntryService: RetrospectiveDataEntryService,
    private encounterResService: EncounterResourceService,
    private patientProgramResourceService: PatientProgramResourceService
  ) {}

  public ngOnInit() {
    this.retrospectiveDataEntryService.retroSettings.subscribe(
      (retroSettings) => {
        if (retroSettings && retroSettings.enabled) {
          this.hideButtonNav = true;
          if (this.modalHasChanges(retroSettings)) {
            const visitPayload: any = {
              location: retroSettings.location.value,
              visitType: this.visit.visitType.uuid,
              startDatetime: new Date(
                retroSettings.visitDate + ', ' + retroSettings.visitTime
              )
            };
            this.updateRetroVisitSettings(visitPayload);
          }
        } else {
          this.hideButtonNav = false;
        }
      }
    );
  }

  public extractCompletedEncounterTypes() {
    this.completedEncounterTypesUuids = [];
    if (this.visit && Array.isArray(this.visit.encounters)) {
      this.completedEncounterTypesUuids = this.visit.encounters.map((a) => {
        return a.encounterType.uuid;
      });
    }
  }

  public updateRetroVisitSettings(payload) {
    this.visitResourceService.updateVisit(this.visit.uuid, payload).subscribe(
      (udpatedVisit) => {
        // this.isBusy = false;
        this.voidVisitEncounters();
        if (udpatedVisit.encounters.length === 0) {
          this.visitCancelled.next(this.visit);
        }
      },
      (error) => {
        this.isBusy = false;
        this.showDeleteEncountersButton = true;
        this.error =
          'An error occured while cancelling visit. Refresh page and retry';
        console.error('Error saving visit changes', error);
      }
    );
  }

  public getCurrentProgramEnrollmentConfig(
    patientUuid,
    locationUuid,
    startDatetime
  ) {
    this.programVisitTypesConfig = {};
    this.patientProgramResourceService
      .getPatientProgramVisitTypes(
        patientUuid,
        this.programUuid,
        this.programEnrollmentUuid,
        locationUuid,
        this.isRetrospectiveVisit.toString(),
        moment(startDatetime).format('YYYY-MM-DD')
      )
      .take(1)
      .subscribe(
        (progConfig) => {
          this.programVisitTypesConfig = progConfig;
          this.extractAllowedEncounterTypesForVisit(progConfig);
        },
        (error) => {
          console.error('Error loading the program visit configs', error);
        }
      );
  }

  public extractAllowedEncounterTypesForVisit(programConfig) {
    this.allowedEncounterTypesUuids = [];
    if (
      this.visit &&
      this.visit.visitType &&
      programConfig &&
      Object.keys(programConfig).length !== 0 &&
      Object.getPrototypeOf(programConfig) === Object.prototype
    ) {
      if (this.hasValidatedEncounters) {
        let visitType: any;
        programConfig.visitTypes.allowed.forEach((element) => {
          if (element.uuid === this.visit.visitType.uuid) {
            visitType = element;
          }
        });

        if (
          visitType &&
          Array.isArray(visitType.encounterTypes.disallowedEncounters)
        ) {
          visitType.encounterTypes.disallowedEncounters.forEach((e) => {
            if (e.errors.covidError != null) {
              this.qualifiesForCovidScreening = true;
            }
          });
        }

        if (
          visitType &&
          Array.isArray(visitType.encounterTypes.allowedEncounters)
        ) {
          this.allowedEncounterTypesUuids = visitType.encounterTypes.allowedEncounters.map(
            (a) => {
              return a.uuid;
            }
          );
        }
      }
    }
  }

  public reloadVisit() {
    if (this.visit && this.visit.uuid) {
      this.isBusy = true;
      this.error = '';
      const visitUuid = this.visit.uuid;
      this.visit = undefined;
      const custom =
        'custom:(uuid,encounters:(uuid,encounterDatetime,' +
        'form:(uuid,name),location:ref,' +
        'encounterType:ref,provider:ref),patient:(uuid,uuid),' +
        'visitType:(uuid,name),location:ref,startDatetime,' +
        'stopDatetime,attributes:(uuid,value,attributeType))';
      this.visitResourceService
        .getVisitByUuid(visitUuid, { v: custom })
        .subscribe(
          (visit) => {
            this.isBusy = false;
            this.visit = visit;
            this.getCurrentProgramEnrollmentConfig(
              this.visit.patient.uuid,
              this.visit.location.uuid,
              this.visit.startDatetime
            );
          },
          (error) => {
            this.isBusy = false;
            this.error =
              'An error occured while reloading the visit. Refresh page and retry';
            console.error('Error loading visit', error);
          }
        );
    }
  }

  public endCurrentVisit() {
    this.isBusy = true;
    this.error = '';
    this.visitResourceService
      .updateVisit(this.visit.uuid, {
        stopDatetime: new Date()
      })
      .subscribe(
        (udpatedVisit) => {
          this.isBusy = false;
          this.visitChanged.next(udpatedVisit);
          this.reloadVisit();
        },
        (error) => {
          this.isBusy = false;
          this.error =
            'An error occured while saving visit changes. Refresh page and retry';
          console.error('Error saving visit changes', error);
        }
      );
  }

  public cancelCurrenVisit() {
    this.isBusy = true;
    this.error = '';
    this.visitResourceService
      .updateVisit(this.visit.uuid, {
        voided: true
      })
      .subscribe(
        (udpatedVisit) => {
          // this.isBusy = false;
          this.voidVisitEncounters();
          if (udpatedVisit.encounters.length === 0) {
            this.visitCancelled.next(this.visit);
          }
        },
        (error) => {
          this.isBusy = false;
          this.showDeleteEncountersButton = true;
          this.error =
            'An error occured while cancelling visit. Refresh page and retry';
          console.error('Error saving visit changes', error);
        }
      );
  }

  public voidVisitEncounters() {
    if (
      Array.isArray(this.visit.encounters) &&
      this.visit.encounters.length > 0
    ) {
      const observableBatch: Array<Observable<any>> = [];
      for (const encounter of this.visit.encounters) {
        observableBatch.push(
          this.encounterResService.voidEncounter(encounter.uuid)
        );
      }

      // forkjoin all requests
      this.isBusy = true;
      forkJoin(observableBatch).subscribe(
        (data) => {
          this.isBusy = false;
          this.visitCancelled.next(this.visit);
        },
        (err) => {
          this.isBusy = false;
          this.error = 'An error occured while deleting visit encounters.';
          console.error('Error saving visit changes', err);
          this.showDeleteEncountersButton = true;
        }
      );
    }
  }

  public toggleEditLocation() {
    this.editingLocation = !this.editingLocation;
  }

  public toggleEditVisitType() {
    this.editingVisitType = !this.editingVisitType;
  }

  public toggleEditVisitProvider() {
    this.editingProvider = !this.editingProvider;
  }

  public confirmAction(action) {
    switch (action) {
      case 'cancel-visit':
        this.message.title =
          'Cancelling a visit deletes all encounters associated with it.';
        this.message.message = 'Please confirm you wish to cancel this visit:';
        this.confirmingCancelVisit = true;
        break;
      case 'end-visit':
        this.message.title =
          'Ending a visit will not allow you to fill another current encounter ' +
          ' form for this patient';
        this.message.message = 'Are you sure you want to end this visit?';
        this.confirmingEndVisit = true;
        break;

      default:
        break;
    }
    this.showConfirmationDialog = true;
  }

  public onFormSelected(form) {
    this.formSelected.next({
      form: form,
      visit: this.visit
    });
  }

  public onEncounterSelected(encounter) {
    this.encounterSelected.next(encounter);
  }

  public onVisitLocationEditted(location) {
    this.toggleEditLocation();
    this.reloadVisit();
    this.visitChanged.next(this.visit);
  }

  public onVisitProviderChanged(updatedVisit) {
    this.editingProvider = false;
    this.reloadVisit();
    this.visitChanged.next(this.visit);
  }

  public onVisitTypeEditted(visit) {
    this.toggleEditVisitType();
    this.reloadVisit();
    this.visitChanged.next(this.visit);
  }

  public onYesDialogConfirmation() {
    this.showConfirmationDialog = false;
    if (this.confirmingCancelVisit) {
      this.cancelCurrenVisit();
    } else {
      this.endCurrentVisit();
    }
  }

  public onNoDialogConfirmation() {
    this.showConfirmationDialog = false;
    // Do Nothing
  }

  private modalHasChanges(settings) {
    const visitDate = moment(this.visit.startDatetime).format('YYYY-MM-DD');
    return (
      this.visit.location.uuid !== settings.location.value ||
      visitDate !== settings.visitDate
    );
  }

  public checkForRetrospectiveVisit(): void {
    let isRetrospective = false;
    if (this.visit.hasOwnProperty('attributes')) {
      isRetrospective = this.visit.attributes.some((a: any) => {
        return a.attributeType.uuid === this.retrospectiveAttributeTypeUuid;
      });
    }
    this.isRetrospectiveVisit = isRetrospective;
  }
}
