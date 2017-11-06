import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { VisitResourceService } from
  '../../../../openmrs-api/visit-resource.service';
import { EncounterResourceService } from
  '../../../../openmrs-api/encounter-resource.service';

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
  public editingLocation = false;
  public editingVisitType = false;
  public message: any = {
     'title': '',
     'message': ''
  };

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
  public formsCollapsed: boolean = false;

  private _visit: any;
  @Input()
  public get visit(): any {
    return this._visit;
  }
  public set visit(v: any) {
    this._visit = v;
    this.extractCompletedEncounterTypes();
  }

  public get isVisitEnded(): boolean {
    return moment(this.visit.stopDatetime).isValid();
  }

  public get visitWithNoEncounters(): boolean {
    return !(this.visit &&
      Array.isArray(this.visit.encounters) &&
      this.visit.encounters.length > 0);
  }


  private _programVisitTypesConfig: any;
  public get programVisitTypesConfig(): any {
    return this._programVisitTypesConfig;
  }
  @Input()
  public set programVisitTypesConfig(v: any) {
    this._programVisitTypesConfig = v;
    this.extractAllowedEncounterTypesForVisit();
  }

  constructor(
    private visitResourceService: VisitResourceService,
    private encounterResService: EncounterResourceService) { }

  public ngOnInit() {
  }

  public extractCompletedEncounterTypes() {
    this.completedEncounterTypesUuids = [];
    if (this.visit && Array.isArray(this.visit.encounters)) {
      this.completedEncounterTypesUuids = this.visit.encounters.map((a) => {
        return a.encounterType.uuid;
      });
    }
  }

  public extractAllowedEncounterTypesForVisit() {
    this.allowedEncounterTypesUuids = [];
    if (this.visit && this.visit.visitType
      && this.programVisitTypesConfig &&
      Array.isArray(this.programVisitTypesConfig.visitTypes)) {
      let visitType: any;
      this.programVisitTypesConfig.visitTypes.forEach((element) => {
        if (element.uuid === this.visit.visitType.uuid) {
          visitType = element;
        }
      });

      if (visitType && Array.isArray(visitType.encounterTypes)) {
        this.allowedEncounterTypesUuids = visitType.encounterTypes.map((a) => {
          return a.uuid;
        });
      }
    }
  }

  public reloadVisit() {
    if (this.visit && this.visit.uuid) {
      this.isBusy = true;
      this.error = '';
      let visitUuid = this.visit.uuid;
      this.visit = undefined;
      let custom = 'custom:(uuid,encounters:(uuid,encounterDatetime,' +
        'form:(uuid,name),location:ref,' +
        'encounterType:ref,provider:ref),patient:(uuid,uuid),' +
        'visitType:(uuid,name),location:ref,startDatetime,' +
        'stopDatetime)';
      this.visitResourceService.getVisitByUuid(visitUuid,
        { v: custom })
        .subscribe((visit) => {
          this.isBusy = false;
          this.visit = visit;
          this.extractAllowedEncounterTypesForVisit();
        },
        (error) => {
          this.isBusy = false;
          this.error = 'An error occured while reloading the visit. Refresh page and retry';
          console.error('Error loading visit', error);
        });
    }
  }

  public endCurrentVisit() {
    this.isBusy = true;
    this.error = '';
    this.visitResourceService.updateVisit(this.visit.uuid, {
      stopDatetime: new Date()
    }).subscribe(
      (udpatedVisit) => {
        this.isBusy = false;
        this.visitChanged.next(udpatedVisit);
        this.reloadVisit();
      },
      (error) => {
        this.isBusy = false;
        this.error = 'An error occured while saving visit changes. Refresh page and retry';
        console.error('Error saving visit changes', error);
      }
      );

  }

  public cancelCurrenVisit() {
    this.isBusy = true;
    this.error = '';
    this.visitResourceService.updateVisit(this.visit.uuid, {
      voided: true
    }).subscribe(
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
        this.error = 'An error occured while cancelling visit. Refresh page and retry';
        console.error('Error saving visit changes', error);
      }
      );
  }

  public voidVisitEncounters() {
    if (Array.isArray(this.visit.encounters) && this.visit.encounters.length > 0) {
      let observableBatch: Array<Observable<any>> = [];
      for (let encounter of this.visit.encounters) {
        observableBatch.push(
          this.encounterResService.voidEncounter(encounter.uuid)
        );
      }

      // forkjoin all requests
      this.isBusy = true;
      Observable.forkJoin(
        observableBatch
      ).subscribe(
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

  public confirmAction(action) {
    switch (action) {
      case 'cancel-visit':
        this.message.title = 'Cancelling a visit deletes all encounters associated with it.';
        this.message.message = 'Please confirm you wish to cancel this visit:';
        this.confirmingCancelVisit = true;
        break;
      case 'end-visit':
        this.message.title =
        'Ending a visit will not allow you to fill another current encounter form for this patient';
        this.message.message = 'Are you sure you want to end this visit?';
        this.confirmingCancelVisit = true;
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

}
