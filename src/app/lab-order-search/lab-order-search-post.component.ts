import { Component, OnInit, Input, Output,
  EventEmitter, OnChanges , SimpleChanges } from '@angular/core';

import * as _ from 'underscore';
import * as Moment from 'moment';

import { LabOrdersSearchHelperService } from './lab-order-search-helper.service';
import { Person } from '../models/person.model';
import { HivSummaryService } from '../patient-dashboard/hiv-summary/hiv-summary.service';
import { ConceptResourceService  } from '../openmrs-api/concept-resource.service';
import { LabOrderPostService } from './lab-order-post.service';

@Component({
  selector: 'lab-order-search-post',
  templateUrl: './lab-order-search-post.component.html',
  styleUrls: ['./lab-order-search-post.component.css']
})
export class LabOrderSearchPostComponent implements OnInit, OnChanges {

  @Input()
  order: any = null;

  @Input()
  reset: boolean = false;

  @Input()
  hasPDashLink: boolean = false;

  @Output() resetEvent = new EventEmitter();

  orderType: any;
  vlJustification: string;
  patient: any;
  person: Person;
  searchIdentifiers: any;
  hivSummary: any;
  error: any;
  hasDnaPcr = false;
  dnaPcrData: any = {
    hivStatusOfMother: '',
    infantProphylaxis: '',
    infantFeeding: ''
  };

  labLocations: any;
  sampleTypes: any;
  orderTypes: any;
  isBusy: boolean = true;

  selectedLabLocation: any;
  selectedSampleType: any;
  dateReceived: any;
  orderPostSuccessful: boolean;

  constructor(
    private labOrdersSearchHelperService: LabOrdersSearchHelperService,
    private hivSummaryService: HivSummaryService,
    private conceptResourceService: ConceptResourceService,
    private labOrderPostService: LabOrderPostService) {
      this.labLocations = this.labOrdersSearchHelperService.labLocations;
      this.sampleTypes = this.labOrdersSearchHelperService.sampleTypes;
      this.orderTypes = this.labOrdersSearchHelperService.orderTypes;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.clearErrorMessage();
    this.orderPostSuccessful = null;

    let reset: any = changes['reset'];
    let order: any = changes['order'];

    if (order && order.currentValue) {
      this.isBusy = true;
      this.displayOrder();
    }
  }

  displayOrder() {
    this.patient = this.order.patient;
    this.person = new Person(this.order.patient.person);
    this.searchIdentifiers = this.labOrdersSearchHelperService
      .searchIdentifiers(this.order.patient.identifiers);
    this.orderType = this.labOrdersSearchHelperService.determineOrderType(this.order);
    this.setJustification();

    this.loadHivSummary(this.person.uuid);
    this.displayDnaPcrInputs();
  }

  setJustification() {
    let ot = this.orderType.type;

    if (ot === 'VL') {
      return;
    }

    this.vlJustification = this.labOrdersSearchHelperService
      .getViralLoadJustification(this.order.encounter.obs);
  }

  get isVisible() {
    return this.order && this.reset !== true;
  }

  loadHivSummary(patientUuid) {

    this.hivSummaryService.getHivSummary(patientUuid, 0, 1, false)
      .subscribe((data) => {
        this.hivSummary = data && data.length > 0 ? data[0] : null;
        this.isBusy = false;
      }, (err) => {
        this.error = 'An error occured while loading Hiv Summary. Please try again.';
        this.isBusy = false;
      }
    );
  }

  displayDnaPcrInputs() {

    let ot = this.orderType.type;
    if (ot !== 'DNAPCR') {
      return;
    }

    let order = this.order;
    let obs = order.encounter.obs;
    let locationUuid = order.encounter.location.uuid;
    let patientIdentifier = this.searchIdentifiers.ampathMrsUId ?
      this.searchIdentifiers.ampathMrsUId : this.searchIdentifiers.default;
    let patientName = this.person.display;
    let dateReceived = this.dateReceived ? this.dateReceived : new Date();

    let data: any = this.labOrdersSearchHelperService
      .createDnaPcrPayload(order, obs, locationUuid, patientIdentifier,
        patientName, this.person.gender, this.person.birthdate, dateReceived);

    if (data.motherHivStatusUuid || data.infantProphylaxisUuid || data.feedingTypeUuid) {
      this.hasDnaPcr = true;
      this.getDnaPcrConcepts(data.motherHivStatusUuid, 'hivStatusOfMother');
      this.getDnaPcrConcepts(data.infantProphylaxisUuid, 'infantProphylaxis');
      this.getDnaPcrConcepts(data.feedingTypeUuid, 'infantFeeding');
    }
  }

  getDnaPcrConcepts(uuid, property) {

    if (uuid) {
      this.conceptResourceService.getConceptByUuid(uuid).subscribe((data) => {
          if (data) {
              this.dnaPcrData[property] = data.name.display;
          }
      }, (error) => {
          console.log('Failed to load concepts ', error);
      });
    }
  }

  public postOrder() {

    if (this.isBusy) return;
    if (!this.isUserInputValid()) return;
    if (!this.hasLoadingTimeRequiredInputs()) return;

    let payload = this.getPayload();

    let location = this.selectedLabLocation;
    this.isBusy = true;
    this.labOrderPostService.postOrderToEid(location, payload)
      .subscribe((resp) => {
        this.orderPostSuccessful = true;
        this.order = null;
        this.reset = null;
        this.isBusy = false;
      },
      (err) => {
        this.isBusy = false;
        this.error = err.statusText;

        if (err._body) {
          let json = JSON.parse(err._body);
          if (json && json.message) {
            this.error = json.message;
          }
        }
      });
  }

  getPayload() {

    let payload: any = null;

    if (this.orderType === null || this.orderType === undefined) {
      this.error = 'Unknown order type.';
      return null;
    }

    if (this.orderType.type === 'Other') {
      this.error = 'Unsupported order type.';
      return null;
    }

    let order = this.order;
    let obs = order.encounter.obs;
    let locationUuid = order.encounter.location.uuid;
    let patientIdentifier = this.searchIdentifiers.ampathMrsUId ?
      this.searchIdentifiers.ampathMrsUId : this.searchIdentifiers.default;
    let patientName = this.person.display;
    let dateReceived = this.dateReceived ? this.dateReceived : new Date();
    let gender = this.person.gender;
    let birthdate = this.person.birthdate;

    if (this.orderType.type === 'DNAPCR')
      payload =
        this.labOrdersSearchHelperService.createDnaPcrPayload(this.order, obs, locationUuid,
          patientIdentifier, patientName, gender, birthdate, this.dateReceived);

    if (this.orderType.type === 'VL') {

      let artStartDateInitial = this.hivSummary.arv_first_regimen_start_date;
      let artStartDateCurrent = this.hivSummary.arv_start_date;
      let currentArtRegimenId = this.hivSummary.cur_arv_meds_id;

      payload =
        this.labOrdersSearchHelperService.createViralLoadPayload(order, obs, locationUuid,
          patientIdentifier, patientName, gender, birthdate, this.dateReceived,
          artStartDateInitial, artStartDateCurrent, this.selectedSampleType, currentArtRegimenId);
    }

      if (this.orderType.type === 'CD4')
        payload =
          this.labOrdersSearchHelperService.createCD4Payload(order, obs, locationUuid,
            patientIdentifier, patientName, gender, birthdate, this.dateReceived);

      return payload;
  }

  clearErrorMessage() {
    this.error = null;
  }

  isUserInputValid() {

    this.clearErrorMessage();
    if (_.isEmpty(this.selectedLabLocation)) {
      this.error = 'Lab Location is required.';
      return false;
    }

    let selectedSampleType = this.selectedSampleType + '';
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

  hasLoadingTimeRequiredInputs() {

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

  resetOrder() {
    this.resetEvent.emit(true);
    this.order = null;
    this.reset = true;
  }
}
