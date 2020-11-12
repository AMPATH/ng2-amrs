
import {take} from 'rxjs/operators';
import { Component, OnInit, Input, Output,
  EventEmitter, OnChanges , SimpleChanges } from '@angular/core';

import * as _ from 'lodash';
import * as Moment from 'moment';

import { LabOrdersSearchHelperService } from './lab-order-search-helper.service';
import { Person } from '../models/person.model';
import { HivSummaryService } from '../patient-dashboard/hiv/hiv-summary/hiv-summary.service';
import { ConceptResourceService  } from '../openmrs-api/concept-resource.service';
import { LabOrderPostService } from './lab-order-post.service';

@Component({
  selector: 'lab-order-search-post',
  templateUrl: './lab-order-search-post.component.html',
  styleUrls: ['./lab-order-search-post.component.css']
})
export class LabOrderSearchPostComponent implements OnInit, OnChanges {
  public _order: any = null;
  @Input()
  set order(order: any) {
    this.selectedLabLocation = null;
    this.selectedIdentifier = null;
    this.selectedSampleType = null;
    this.dateReceived = Moment(new Date()).format('YYYY-MM-DD');
    this.orderPostSuccessful = false;
    this.isBusy = false;
    this._order = order;
  }
  get order() {
    return this._order;
  }

  @Input()
  public reset = false;

  @Input()
  public hasPDashLink = false;

  @Output()  public resetEvent = new EventEmitter();
  @Output()  public orderPostSuccessfulEvent = new EventEmitter();
  public orderType: any;
  public vlJustification: string;
  public patient: any;
  public person: Person;
  public searchIdentifiers: any;
  public hivSummary: any;
  public error: any;
  public hasDnaPcr = false;
  public dnaPcrData: any = {
    hivStatusOfMother: '',
    infantProphylaxis: '',
    infantFeeding: ''
  };

  public isPregnant = false;
  public isBreastfeeding = false;

   public labLocations: any;
   public patientIdentifers = [];
   public sampleTypes: any;
   public orderTypes: any;
   public isBusy = true;

   public selectedLabLocation: any;
   public selectedIdentifier: string;
   public selectedSampleType: any;
   public dateReceived: any = Moment(new Date()).format('YYYY-MM-DD');
   public orderPostSuccessful: boolean;

  constructor(
    private labOrdersSearchHelperService: LabOrdersSearchHelperService,
    private hivSummaryService: HivSummaryService,
    private conceptResourceService: ConceptResourceService,
    private labOrderPostService: LabOrderPostService) {
      this.labLocations = this.labOrdersSearchHelperService.labLocations;
      this.sampleTypes = this.labOrdersSearchHelperService.sampleTypes;
      this.orderTypes = this.labOrdersSearchHelperService.orderTypes;
  }

public ngOnInit() {
        // tslint:disable-next-line:no-console
        console.info('Init LabOrderSearchPostComponent');
}
   public ngOnChanges(changes: SimpleChanges) {
    this.clearErrorMessage();
    this.orderPostSuccessful = null;

    const reset: any = changes['reset'];
    const order: any = changes['order'];

    if (order && order.currentValue) {
      this.isBusy = true;
      this.displayOrder();
    }
  }

   public displayOrder() {
    this.processPatientIdentifiers().then((identifiers: any) => {
      this.patientIdentifers = identifiers;
    });
    this.patient = this.order.patient;
    this.person = new Person(this.order.patient.person);
    this.searchIdentifiers = this.labOrdersSearchHelperService
      .searchIdentifiers(this.order.patient.identifiers);
    this.orderType = this.labOrdersSearchHelperService.determineOrderType(this.order);
    this.setJustification();
   this.displayPregnancy();
    this.loadHivSummary(this.person.uuid);
    this.displayDnaPcrInputs();
    this.setDefaultLocation();
  }

  public displayPregnancy() {
      const pmtctCategory = this.findObs(this.order.encounter.obs, 'a89eea66-1350-11df-a1f1-0026b9348838');
      if (pmtctCategory) {
        if (pmtctCategory.value.uuid === 'a89d109c-1350-11df-a1f1-0026b9348838') {
          this.isPregnant = true;
        }
        if (pmtctCategory.value.uuid === 'a8a18208-1350-11df-a1f1-0026b9348838') {
          this.isBreastfeeding = true;
        }
      }
  }

  public findObs(obs: Array<any>, uuid: string) {
    for (let i = 0; i < obs.length; i++) {
      if (obs[i].concept.uuid === uuid) {
        return obs[i];
      }
      if (
        Array.isArray(obs[i].groupMembers) &&
        obs[i].groupMembers.length > 0
      ) {
        const conceptObs = this.findObsInGroupMember(obs[i].groupMembers, uuid);
        if (conceptObs.length > 0) {
          return conceptObs[0];
        }
      }
    }
  }
  public findObsInGroupMember(groupMember: any, conceptUuid: string) {
    const conceptObs = groupMember.filter((obs: any) => {
      return obs.concept.uuid === conceptUuid;
    });
    return conceptObs;
  }

   public setJustification() {
    const ot = this.orderType.type;

    if (ot === 'VL') {
      return;
    }

    this.vlJustification = this.labOrdersSearchHelperService
      .getViralLoadJustification(this.order.encounter.obs);
  }

  get isVisible() {
    return this.order && this.reset !== true;
  }

   public loadHivSummary(patientUuid) {

    this.hivSummaryService.getHivSummary(patientUuid, 0, 1, false).subscribe((data) => {
        this.hivSummary = data && data.length > 0 ? data[0] : null;
        this.isBusy = false;
      }, (err) => {
        this.error = 'An error occured while loading Hiv Summary. Please try again.';
        this.isBusy = false;
      }
    );
  }

   public displayDnaPcrInputs() {

    const ot = this.orderType.type;
    if (ot !== 'DNAPCR') {
      return;
    }

    const order = this.order;
    const obs = order.encounter.obs;
    const locationUuid = order.encounter.location.uuid;
    const patientIdentifier = this.searchIdentifiers.ampathMrsUId ?
      this.searchIdentifiers.ampathMrsUId : this.searchIdentifiers.default;
    const patientName = this.person.display;
    const dateReceived = this.dateReceived ? this.dateReceived : new Date();

    const data: any = this.labOrdersSearchHelperService
      .createDnaPcrPayload(order, obs, locationUuid, patientIdentifier,
        patientName, this.person.gender, this.person.birthdate, dateReceived);

    if (data.motherHivStatusUuid || data.infantProphylaxisUuid || data.feedingTypeUuid) {
      this.hasDnaPcr = true;
      this.getDnaPcrConcepts(data.motherHivStatusUuid, 'hivStatusOfMother');
      this.getDnaPcrConcepts(data.infantProphylaxisUuid, 'infantProphylaxis');
      this.getDnaPcrConcepts(data.feedingTypeUuid, 'infantFeeding');
    }
  }

   public getDnaPcrConcepts(uuid, property) {

    if (uuid) {
      this.conceptResourceService.getConceptByUuid(uuid).pipe(take(1)).subscribe((data) => {
          if (data) {
              this.dnaPcrData[property] = data.name.display;
          }
      }, (error) => {
          console.error('Failed to load concepts ', error);
      });
    }
  }

  public postOrder() {

    if (this.isBusy) { return; }
    if (!this.isUserInputValid()) { return; }
    if (!this.hasLoadingTimeRequiredInputs()) { return; }
    const payload = this.getPayload();

    const location = this.selectedLabLocation;
    this.isBusy = true;
    this.labOrderPostService.postOrderToEid(location, payload).pipe(
      take(1)).subscribe((resp) => {
        this.selectedLabLocation = null;
        this.selectedIdentifier = null;
        this.selectedSampleType = null;
        this.dateReceived = undefined;
        this.orderPostSuccessful = true;
        this.orderPostSuccessfulEvent.emit(true);
        this.order = null;
        this.reset = null;
        this.resetEvent.emit(true);
        this.isBusy = false;
      },
      (err) => {
        this.isBusy = false;
        this.error = err.error.message;

        if (err._body) {
          const json = JSON.parse(err._body);
          if (json && json.message) {
            this.error = json.message;
          }
        }
      });
  }

  public getPayload() {

    let payload: any = null;
    if (this.orderType === null || this.orderType === undefined) {
      this.error = 'Unknown order type.';
      return null;
    }

    if (this.orderType.type === 'Other') {
      this.error = 'Unsupported order type.';
      return null;
    }

    const order = this.order;
    const obs = order.encounter.obs;
    const locationUuid = order.encounter.location.uuid;
    const patientIdentifier = this.selectedIdentifier;
    const patientName = this.person.display;
    const dateReceived = this.dateReceived ? this.dateReceived : new Date();
    const gender = this.person.gender;
    const birthdate = this.person.birthdate;

    if (this.orderType.type === 'DNAPCR') {payload =
        this.labOrdersSearchHelperService.createDnaPcrPayload(this.order, obs, locationUuid,
          patientIdentifier, patientName, gender, birthdate, this.dateReceived);
        }

    if (this.orderType.type === 'VL') {

      const artStartDateInitial = this.hivSummary.arv_first_regimen_start_date;
      const artStartDateCurrent = this.hivSummary.arv_start_date;
      const currentArtRegimenId = this.hivSummary.cur_arv_meds_id;

      payload =
        this.labOrdersSearchHelperService.createViralLoadPayload(order, obs, locationUuid,
          patientIdentifier, patientName, gender, birthdate, this.dateReceived,
          artStartDateInitial, artStartDateCurrent, this.selectedSampleType, currentArtRegimenId,
          this.isPregnant ? 1 : 0, this.isBreastfeeding ? 1 : 0);
    }

    if (this.orderType.type === 'CD4') {
       payload =
          this.labOrdersSearchHelperService.createCD4Payload(order, obs, locationUuid,
            patientIdentifier, patientName, gender, birthdate, this.dateReceived);
    }

    return payload;
  }

  public clearErrorMessage() {
    this.error = null;
  }

   public isUserInputValid() {

    this.clearErrorMessage();
    if (_.isEmpty(this.selectedLabLocation)) {
      this.error = 'Lab Location is required.';
      return false;
    }

    if (_.isEmpty(this.selectedIdentifier)) {
      this.error = 'Patient identifier is required.';
      return false;
    }

    const selectedSampleType = this.selectedSampleType + '';
    if (this.orderType.type === 'VL' && _.isEmpty(selectedSampleType)) {
      this.error = 'Sample type is required.';
      return false;
    }

    if (!Moment(this.dateReceived).isValid()) {
      this.error = 'Date Received is required.';
      return false;
    }

    return true;
  }

   public hasLoadingTimeRequiredInputs() {

    if (_.isEmpty(this.order)) {
      this.error = 'Order information is required. Please try again.';
      return false;
    }

    if (_.isEmpty(this.hivSummary) && this.orderType.type === 'VL') {
      this.error = 'Hiv Summary Information is required. Please try again.';
      return false;
    }

    return true;
  }

   public processPatientIdentifiers() {
    const identifiers = [];
    return new Promise((resolve, reject) => {
      _.each(this.order.patient.identifiers, (identifier: any) => {
        this.setDefaultIdentifier(identifier);
        if (_.indexOf(identifier.display, '=') > 0) {
          identifiers.push((identifier.display.split('=')[1]).trim());
        } else {
          identifiers.push((identifier.identifier));
        }
      });
      resolve(identifiers);
    });
  }

   public resetOrder() {
    this.resetEvent.emit(true);
    this.order = null;
    this.reset = true;
  }

  private setDefaultIdentifier(identifier: any) {
    if (identifier.preferred) {
     this.selectedIdentifier = identifier.identifier;
    }
  }

  private setDefaultLocation() {
    this.selectedLabLocation = 'ampath';
  }
}
