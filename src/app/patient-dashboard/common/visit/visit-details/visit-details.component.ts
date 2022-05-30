import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import * as moment from 'moment';

import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';
import { EncounterResourceService } from '../../../../openmrs-api/encounter-resource.service';
import { Encounter } from '../../../../models/encounter.model';
import { RetrospectiveDataEntryService } from '../../../../retrospective-data-entry/services/retrospective-data-entry.service';

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
  public screenedForCovidToday = false;
  public isRetrospectiveVisit = false;
  public isTreatmentSupprterVisit = false;
  public retrospectiveAttributeTypeUuid =
    '3bb41949-6596-4ff9-a54f-d3d7883a69ed';
  public ADULT_INITIAL = '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f';
  public ADULT_RETURN = '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f';
  public PEDS_RETURN = '8d5b3108-c2cc-11de-8d13-0010c6dffd0f';
  public YOUTH_RETURN = '4e7553b4-373d-452f-bc89-3f4ad9a01ce7';
  public YOUTH_INITIAL = 'fc8c1694-90fc-46a8-962b-73ce9a99a78f';
  public PEDS_INITIAL = '8d5b2dde-c2cc-11de-8d13-0010c6dffd0f';
  public DRUG_PICKUP = '987009c6-6f24-43f7-9640-c285d6553c63';
  public LAB_ORDER = '5ef97eed-18f5-40f6-9fbf-a11b1f06484a';
  public POC_LAB = '5544894d-8add-4521-a0ea-c124c5886c8b';
  public TREATMENT_SUPPORTER_VISIT = 'fcc9a836-0200-45f2-81b4-b4a687a10247';
  public PMTCT_TREATMENT_SUPPORTER_VISIT =
    '18f59064-961e-4d51-9ccf-e950f04b4c66';
  public DC_TREATMENT_SUPPORTER_VISIT = '0bcccab0-59ce-4a25-a158-cc722427ff3f';
  public VIREMIA_TREATMENT_SUPPORTER_VISIT =
    '52fddd42-f9ea-4946-8733-f0e584360780';
  public HEI_TREATMENT_SUPPORTER_VISIT = '015af4d4-67cb-45a3-9929-8dbd53b1e47c';
  public PHARMACY_VISIT = '30003687-44e5-4861-bd9c-d58e2fe81b8f';
  public ONCOLOGYVIA = '238625fc-8a25-44b2-aa5a-8bf48fa0e18d';
  public qualifiesForCovidScreenig = false;
  public hivPrograms = [
    'Standard HIV TREATMENT',
    'PREVENTION OF MOTHER-TO-CHILD TRANSMISSION OF HIV(pMTCT)',
    'OVC PROGRAM',
    'HIV DIFFERENTIATED CARE PROGRAM',
    'RESISTANCE CLINIC PROGRAM',
    'VIREMIA PROGRAM'
  ];
  public isHivVisit = false;

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
    this.checkForRestrospectiveVisit();
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

  private _programVisitTypesConfig: any;
  public get programVisitTypesConfig(): any {
    return this._programVisitTypesConfig;
  }

  @Input()
  public set programVisitTypesConfig(v: any) {
    this._programVisitTypesConfig = v;
  }

  constructor(
    private visitResourceService: VisitResourceService,
    private retrospectiveDataEntryService: RetrospectiveDataEntryService,
    private encounterResService: EncounterResourceService
  ) {}

  public ngOnInit() {
    this.getPatientEncounters();
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

  public getPatientEncounters(): void {
    this.encounterResService
      .getEncountersByPatientUuid(this.patient.uuid)
      .subscribe((encounters: any) => {
        if (encounters) {
          this.checkForTodaysCovidAssessment(encounters);
          this.extractAllowedEncounterTypesForVisit();
          this.evaluateCovidScreeningQualifications();
        }
      });
  }

  public extractCompletedEncounterTypes() {
    this.completedEncounterTypesUuids = [];
    if (this.visit && Array.isArray(this.visit.encounters)) {
      this.completedEncounterTypesUuids = this.visit.encounters.map((a) => {
        return a.encounterType.uuid;
      });
    }
  }

  public checkForTodaysCovidAssessment(encounters: any): void {
    const today = moment().format('YYYY-MM-DD');
    const covidAssessment = encounters.some((a: any) => {
      const encounterDate = moment(a.encounterDatetime).format('YYYY-MM-DD');
      return (
        a.encounterType.uuid === this.covidScreeningUuid &&
        today === encounterDate
      );
    });
    this.screenedForCovidToday = covidAssessment;
  }

  public checkForRestrospectiveVisit(): void {
    let isRetrospective = false;
    if (this.visit && this.visit.hasOwnProperty('attributes')) {
      isRetrospective = this.visit.attributes.some((a: any) => {
        return a.attributeType.uuid === this.retrospectiveAttributeTypeUuid;
      });
    }
    this.isRetrospectiveVisit = isRetrospective;
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

  public extractAllowedEncounterTypesForVisit() {
    this.allowedEncounterTypesUuids = [];
    if (
      this.visit &&
      this.visit.visitType &&
      this.programVisitTypesConfig &&
      Array.isArray(this.programVisitTypesConfig.visitTypes)
    ) {
      let visitType: any;
      this.programVisitTypesConfig.visitTypes.forEach((element) => {
        if (element.uuid === this.visit.visitType.uuid) {
          visitType = element;
        }
      });

      if (visitType && Array.isArray(visitType.encounterTypes)) {
        this.allowedEncounterTypesUuids = this.validateAllowedEncounterTypes(
          visitType,
          this._programVisitTypesConfig.name
        );
      }
    }
  }

  public validateAllowedEncounterTypes(
    visitType: any,
    programName: string
  ): Array<String> {
    const visitTypeUuid = visitType.uuid;
    const allowedEncounters = [];
    const qualifiesForCervicalScreeningForHiv = this.qualifiesForHivOncologyScreening(
      this.patient,
      programName
    );
    this.isTreatmentSupporterVisit(visitTypeUuid);
    this.isHivProgramVisit(programName);
    for (const a of visitType.encounterTypes) {
      if (a.uuid === this.ONCOLOGYVIA) {
        if (!qualifiesForCervicalScreeningForHiv) {
          continue;
        } else {
          allowedEncounters.push(a.uuid);
        }
      } else if (this.isHivClinicalEncounter(a)) {
        if (
          this.screenedForCovidToday ||
          this.isTreatmentSupprterVisit ||
          this.isRetrospectiveVisit
        ) {
          allowedEncounters.push(a.uuid);
        } else {
          continue;
        }
      } else {
        allowedEncounters.push(a.uuid);
      }
    }
    return allowedEncounters;
  }

  public qualifiesForHivOncologyScreening(
    person: { age: number; gender: string },
    programName: string
  ): boolean {
    if (
      (person.age < 25 || person.age > 49 || person.gender === 'M') &&
      programName === 'Standard HIV TREATMENT'
    ) {
      return false;
    } else {
      return true;
    }
  }

  public isHivClinicalEncounter(encounter: { uuid: string }): boolean {
    if (
      encounter.uuid === this.ADULT_RETURN ||
      encounter.uuid === this.PEDS_RETURN ||
      encounter.uuid === this.YOUTH_RETURN ||
      encounter.uuid === this.YOUTH_INITIAL ||
      encounter.uuid === this.ADULT_INITIAL ||
      encounter.uuid === this.PEDS_INITIAL ||
      encounter.uuid === this.DRUG_PICKUP ||
      encounter.uuid === this.LAB_ORDER ||
      encounter.uuid === this.POC_LAB
    ) {
      return true;
    } else {
      return false;
    }
  }

  public isTreatmentSupporterVisit(visitTypeUuid: string): void {
    if (
      visitTypeUuid === this.TREATMENT_SUPPORTER_VISIT ||
      visitTypeUuid === this.PMTCT_TREATMENT_SUPPORTER_VISIT ||
      visitTypeUuid === this.DC_TREATMENT_SUPPORTER_VISIT ||
      visitTypeUuid === this.VIREMIA_TREATMENT_SUPPORTER_VISIT ||
      visitTypeUuid === this.HEI_TREATMENT_SUPPORTER_VISIT ||
      visitTypeUuid === this.PHARMACY_VISIT
    ) {
      this.isTreatmentSupprterVisit = true;
    } else {
      this.isTreatmentSupprterVisit = false;
    }
  }

  public evaluateCovidScreeningQualifications(): void {
    if (
      !this.screenedForCovidToday &&
      !this.isRetrospectiveVisit &&
      !this.isTreatmentSupprterVisit &&
      this.isHivVisit
    ) {
      this.qualifiesForCovidScreenig = true;
    } else {
      this.qualifiesForCovidScreenig = false;
    }
  }

  public isHivProgramVisit(programName: string): void {
    const isHivVisit = this.hivPrograms.some((program: string) => {
      return program === programName;
    });
    this.isHivVisit = isHivVisit;
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
            this.extractAllowedEncounterTypesForVisit();
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
}
