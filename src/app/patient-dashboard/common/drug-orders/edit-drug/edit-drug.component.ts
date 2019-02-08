import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/openmrs-api/user.service';
import { DrugResourceService } from 'src/app/openmrs-api/drug-resource.service';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { DrugOrderService } from '../drug-order.service';
import { DrugOrdersComponent } from '../drug-orders/drug-orders.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { stringify } from '@angular/compiler/src/util';
import { AddDrugOrdersComponent } from '../add-drug-orders/add-drug-orders.component';

@Component({
  selector: 'app-edit-drug',
  templateUrl: './edit-drug.component.html',
  styleUrls: ['./edit-drug.component.css']
})
export class EditDrugComponent implements OnInit {
  @Input() selectedDrug: any;
  @Input() customDrug: any;
  @Input() draftedDrug: any;
  @Input() set: any;
  @Input() revisedOrder: any;
  @Output() searchingDrug = new EventEmitter();
  @Output() childEvent = new EventEmitter();
  @Output() drugChangeEvent = new EventEmitter();
  @Output() childRenewEvent = new EventEmitter();
  @Output() changeDraft = new EventEmitter();
  public patient: any;
  public error: string;
  public subscription: Subscription;
  public drugs = [];
  public title = 'Drug Search';
  public locations = [];
  public drugCartList = [];
  public frequencies = [];
  public unit = [];
  public quantityUnits = [];
  public hasConductedSearch = false;
  public isResetButton = true;
  public isLoading = false;
  public lastSearchString = '';
  public noMatchingResults = false;
  public addOrders = false;
  public adjustInputMargin = '240px';
  public freqs = [];
  public durationUnits: any;
  public durationUnit: any;
  public duration: any;
  public drugName: string;
  public location: string;
  public dose: number;
  public dosageForm: any;
  public doseStrength: string;
  public dosageFormv: string;
  public sentence: string;
  public routes = [];
  public routev: string;
  public frequency: any;
  public routed: any;
  public doseRatio: string;
  public asNeeded = false;
  public asNeededReason: string;
  public dosingInstructions: string;
  public renewReason: string;
  public refills: number;
  public encounter: string;
  public personUuid: string;
  public orderer: string;
  public ordererName: string;
  public startDate = new Date();
  public quantity: number;
  public dose1: number;
  public dose2: number;
  public quantityUnit: any;
  public selectedLocation: string;
  public drugList = false;
  public errors: any = [];
  public totalDrugs: number;
  public locationList = false;
  public currentDate;
  public caresetting = '6f0c9a92-6f24-11e3-af88-005056821db0';
  public action = 'NEW';
  public submittedDrugOrder;
  private patientIdentifer: any;
  public sentenceArray = [];
  public editDrug = true;
  public hideResults = true;
  public doseUnits = 'Mg';
  public successMessage: string;
  public previewOrderMade = false;
  public saveType: string;
  public renew = false;
  public buttonName = 'ORDER';
  public drugUuid: string;
  public revealEdit = true;
  public concept: string;
  public savedEncounter = [];
  public options: any;
  public changeSet = false;

  constructor(private drugResourceService: DrugResourceService,
    private userService: UserService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private encounterResourceService: EncounterResourceService,
    private conceptResourceService: ConceptResourceService,
    private patientService: PatientService,
    @Inject(DrugOrdersComponent) private drurOrder: DrugOrdersComponent,
    private drugOrderService: DrugOrderService,
    private orderResourceService: OrderResourceService) { }

  ngOnInit() {
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    this.getProvider();
    this.getCurrentlyLoadedPatient();
    const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    this.location = currentLocation.display;
    this.selectedLocation = currentLocation.uuid;
    this.currentDate = Date.now();
    if (!this.customDrug) { this.getOrderEntryConfigs(); }
    setTimeout(() => {
      if (this.revisedOrder) {
        this.revealEdit = false;
        this.drugUuid = this.revisedOrder.drug.uuid;
        this.getDrugStrength(this.drugUuid);
        this.setReviseOrderValues(this.revisedOrder);
      } else if (this.selectedDrug) {
        this.setOrderValues(this.selectedDrug);
      } else if (this.customDrug) {
        this.editDrug = true;
        this.setCustomOrderValues(this.customDrug.orderTemplate);
      } else if (this.draftedDrug) {
        this.editDrug = true;
        this.revealEdit = false;
        if (this.draftedDrug.drug) {
          this.editDrug = true;
          this.setOrderValues(this.draftedDrug);
        } else if (this.draftedDrug.concept) {
          this.editDrug = true;
          this.customDrug = this.draftedDrug;
          this.setCustomOrderValues(this.customDrug);
        }
      }
    }, 1000);
  }
  public setReviseOrderValues(reviseOrders) {
    this.saveType = 'DISCONTINUE';
    this.concept = reviseOrders.concept.uuid;
    if (reviseOrders.dateStopped) {
      // do nothing
    } else if (!reviseOrders.dateStopped) {
      const discontinuePayload = this.createPayload();

      const encounterPayLoad = this.createEncounterPayload();
      this.encounterResourceService.saveEncounter(encounterPayLoad).subscribe((response: any) => {
        if (response) {
          this.encounter = response.uuid;
          this.savedEncounter.push(this.encounter);
          discontinuePayload.encounter = this.encounter;
          const dis = this.drugOrderService.saveOrder(discontinuePayload).subscribe((success) => {
            return true;
          }, (err) => {
            return false;
          });
          if (dis) {
            this.buttonName = 'RENEW';
          } else {

          }

        } else {
          this.errors.push({
            id: 'encounter',
            message: 'Error Creating Encounter'
          });
        }
      });

    }
    this.renew = true;
    this.drugName = reviseOrders.drug.display;
    this.sentenceArray.push(this.drugName);
    this.createSentence();
    this.dosageForm = reviseOrders.doseUnits.display;
    this.dosageFormv = reviseOrders.doseUnits.uuid;
    this.routed = reviseOrders.route.uuid;
    this.frequency = reviseOrders.frequency.uuid;
    this.asNeeded = reviseOrders.asNeeded;
    this.asNeededReason = reviseOrders.asNeededCondition;
    this.dosingInstructions = reviseOrders.dosingInstructions;
    this.refills = reviseOrders.numRefills;
    this.action = 'RENEW';
    this.quantity = reviseOrders.quantity;
    this.quantityUnit = reviseOrders.quantityUnits.uuid;
  }
  public setOrderValues(selectedDrug) {
    if (!this.draftedDrug) {
      this.drugName = selectedDrug.name;
      this.sentenceArray.push(this.drugName);
      this.createSentence();
      this.dosageForm = selectedDrug.dosageForm.display;
      this.quantityUnit = selectedDrug.dosageForm.answers[0];
      this.dosageFormv = selectedDrug.dosageForm.uuid;
      this.doseStrength = selectedDrug.strength;
      this.autoPopulateDrugLogic();
      if (selectedDrug.orderTemplate) {
        this.options = selectedDrug.orderTemplate.options;
        this.frequency = selectedDrug.orderTemplate.frequency[0];
        this.routed = this.options.route[0];
        this.startDate = new Date();
        this.quantityUnit = this.options.quantityUnits[0].uuid;
        this.dosageFormv = this.options.doseForm[0].uuid;
        this.quantity = 1;
        this.refills = 2;
      }
    } else {
      this.selectedDrug = selectedDrug.drug;
      this.drugName = selectedDrug.drug.name;
      this.sentenceArray.push(this.drugName);
      this.createSentence();
      this.dose = selectedDrug.dose;
      this.routed = selectedDrug.route;
      this.dosageForm = selectedDrug.doseUnits.display;
      this.dosageFormv = selectedDrug.doseUnits.uuid;
      this.frequency = selectedDrug.frequency;
      this.doseStrength = selectedDrug.strength;
      this.quantityUnit = selectedDrug.quantityUnits;
      this.dosingInstructions = selectedDrug.instructions;
      this.quantity = selectedDrug.quantity;
      this.refills = selectedDrug.numRefills;
      if (selectedDrug.asNeededCondition) {
        this.asNeeded = true;
        this.asNeededReason = selectedDrug.asNeededCondition;
      }
    }

  }
  public autoPopulateDrugLogic () {
    this.routed = this.routes[0];
  }
  compareFn(item1, item2): boolean {
    return item1 && item2 ? item1.uuid === item2.uuid : item1 === item2;
  }
  public getDrugStrength(drugUuid) {
    this.drugOrderService.findDrugByUuid(drugUuid).subscribe((data) => {
      this.doseStrength = data.value;
    });
  }
  public setCustomOrderValues(template) {
    if (this.set) {
      this.drugName = this.customDrug.name;
      this.sentenceArray.push(this.drugName);
      this.createSentence();
      this.options = template.options;
      this.dosageForm = template.options.doseForm;
      this.durationUnits = template.durationUnits;
      this.frequencies = template.frequency;
      this.routes = this.options.route;
      this.quantityUnits = this.options.quantityUnits;

    } else {
      this.drugName = template.concept.name;
      this.sentenceArray.push(this.drugName);
      this.customDrug = template;
      this.createSentence();
      this.dosageForm = template.orderTemplate.options.doseForm;
      this.dose = template.dose;
      if (template.asNeededCondition) {
        this.asNeeded = true;
        this.asNeededReason = template.asNeededCondition;
      }
      this.routed = template.route.uuid;
      this.frequency = template.frequency;
      this.quantityUnit = template.quantityUnits;
      this.dosingInstructions = template.instructions;
      this.quantity = template.quantity;
      this.refills = template.numRefills;


    }
  }

  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          const amrsId = _.find(this.patient.identifiers.openmrsModel,
            (identifer: any) => {
              if (identifer.identifierType.uuid === '58a4732e-1359-11df-a1f1-0026b9348838') {
                return true;
              }
            });
          if (amrsId) {
            this.patientIdentifer = amrsId.identifier;
          }
        }
      }
    );
  }

  public getProvider() {
    this.drugOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.orderer = data.providerUuid;
      this.ordererName = data.label;
    });
  }
  public findLocation(searchText) {
    this.locationList = true;
    this.drugOrderService.findLocation(searchText).subscribe((data) => {
      this.locations = data;
    });
  }
  public drugChanged() {
    if (this.selectedDrug) {
      if (!this.selectedDrug.orderTemplate) {
        this.editDrug = false;
        this.searchingDrug.emit(true);
      } else {
        if (this.set) {
          this.drugChangeEvent.emit(this.set);
        }
      }
    } else {
      this.editDrug = false;
      if (this.set) {
        this.editDrug = true;
        this.drugChangeEvent.emit(this.set);
      }
    }

  }
  public locationChanged(location) {
    this.locationList = false;
    this.location = location.label;
    this.selectedLocation = location.value;
  }
  public createSentence() {
    this.sentence = this.sentenceArray.toString();
  }
  public calculateQuantity(value) {
    if (!this.customDrug) {
      let doseValue = 0;
      let dosesAvailable = [];
      let d1: number, d2: number;

      // tslint:disable-next-line:radix
      // doseValue = parseFloat(this.doseStrength);
      dosesAvailable = this.doseStrength.match(/[-+]?[0-9]*\.?[0-9]+/g);
      if (dosesAvailable.length === 1) {
        doseValue = dosesAvailable[0];
        this.quantity = 0;
        this.quantity = this.dose / doseValue;
      } else if (dosesAvailable.length === 2) {
        this.dose1 = parseFloat(dosesAvailable[0]);
        this.dose2 = parseFloat(dosesAvailable[1]);
        doseValue = this.dose1 + this.dose2;
        d1 = (this.dose1 / doseValue) * this.dose;
        d2 = this.dose * this.dose2 / doseValue;
        this.doseRatio = d1 + '/' + d2;
        this.quantity = this.dose / doseValue;
      }
    }
  }
  public calculateDose(value) {
    if (!this.customDrug) {
      let doseValue = 0;
      let dosesAvailable = [];
      let d1: number, d2: number;
      dosesAvailable = this.doseStrength.match(/[-+]?[0-9]*\.?[0-9]+/g);
      if (dosesAvailable.length === 1) {
        doseValue = dosesAvailable[0];
        this.dose = 0;
        this.dose = value * doseValue;
      } else if (dosesAvailable.length === 2) {
        this.dose1 = parseFloat(dosesAvailable[0]);
        this.dose2 = parseFloat(dosesAvailable[1]);
        doseValue = this.dose1 + this.dose2;
        this.dose = value * doseValue;
        d1 = (this.dose1 / doseValue) * this.dose;
        d2 = this.dose * this.dose2 / doseValue;
        this.doseRatio = d1 + '/' + d2;
      }
    }
  }

  public getOrderEntryConfigs() {
    this.orderResourceService.getOrderEntryConfig().subscribe((data) => {
      this.durationUnits = data.durationUnits;
      this.frequencies = data.orderFrequencies;
      this.routes = data.drugRoutes;
      this.quantityUnits = data.drugDispensingUnits;
    });
  }

  public createPayload() {
    let drugOrderPayload;
    if (this.saveType === 'DISCONTINUE') {
      drugOrderPayload = {
        orderer: this.orderer,
        patient: this.patient.uuid,
        careSetting: this.caresetting,
        concept: this.concept,
        encounter: '',
        action: 'DISCONTINUE',
        type: 'drugorder'
      };
    } else {
      if (!this.frequency) {
        this.errors.push({
          id: 'frequency',
          message: 'Frequency is Required Drug Order'
        });
      } else if (!this.quantity || !this.quantityUnit) {
        this.errors.push({
          id: 'quantity',
          message: 'Quantity and Quantity Unit are both required'
        });
      } else if (!this.refills) {
        this.errors.push({
          id: 'refills',
          message: 'Please Provide Number of Refills'
        });
      } else if (!this.dose) {
        this.errors.push({
          id: 'dose',
          message: 'Please Provide The Dose'
        });
      } else if (!this.routes) {
        this.errors.push({
          id: 'route',
          message: 'Route and Dosage Units are Required'
        });
      } else {
        if (this.saveType === 'new' && !this.customDrug) {
          drugOrderPayload = {
            patient: this.patient.uuid,
            careSetting: this.caresetting,
            orderer: this.orderer,
            encounter: '',
            drug: this.selectedDrug.uuid,
            dose: this.dose,
            doseUnits: this.dosageFormv,
            route: this.routed.uuid,
            frequency: this.frequency.uuid,
            asNeeded: this.asNeeded,
            duration: this.duration,
            durationUnits: this.durationUnit.uuid,
            asNeededCondition: this.asNeededReason,
            instructions: this.dosingInstructions,
            numRefills: this.refills,
            action: this.action,
            quantity: this.quantity,
            quantityUnits: this.quantityUnit.uuid,
            type: 'drugorder'
          };
        } else if (this.saveType === 'new' && this.customDrug) {
          drugOrderPayload = {
            patient: this.patient.uuid,
            startDate: this.startDate,
            careSetting: this.caresetting,
            orderer: this.orderer,
            encounter: '',
            concept: this.customDrug.uuid,
            dose: this.dose,
            doseUnits: this.dosageForm[0].uuid,
            route: this.routed.uuid,
            frequency: this.frequency.uuid,
            asNeeded: this.asNeeded,
            asNeededCondition: this.asNeededReason,
            instructions: this.dosingInstructions,
            numRefills: this.refills,
            action: this.action,
            quantity: this.quantity,
            quantityUnits: this.quantityUnit.uuid,
            duration : this.duration,
            durationUnits : this.durationUnit,
            type: 'drugorder'
          };
        } else if (this.saveType === 'draft') {
          if (this.customDrug) {
            drugOrderPayload = {
              patient: this.patient.uuid,
              careSetting: this.caresetting,
              orderer: this.orderer,
              startDate: this.startDate,
              encounter: '',
              dose: this.dose,
              name: this.customDrug.name,
              concept: {
                name: this.customDrug.name,
                uuid: this.customDrug.uuid,
              },
              doseUnits: {
                units: 'mg',
                name: this.dosageForm[0].name,
                uuid: this.dosageForm[0].uuid
              },
              numRefills: this.refills,
              route: {
                display: this.routed.name,
                uuid: this.routed.uuid
              },
              frequency: {
                display: this.frequency.display,
                uuid: this.frequency.uuid
              },
              action: this.action,
              quantity: this.quantity,
              orderTemplate: this.customDrug.orderTemplate,
              quantityUnits: {
                name: this.quantityUnit.name,
                uuid: this.quantityUnit.uuid
              },
              asNeededCondition: this.asNeededReason,
              instructions: this.dosingInstructions,
              strength: this.doseStrength,
              type: 'drugorder'
            };
          } else if (!this.customDrug) {

            drugOrderPayload = {
              patient: this.patient.uuid,
              careSetting: this.caresetting,
              orderer: this.orderer,
              encounter: '',
              startDate: this.startDate,
              dose: this.dose,
              numRefills: this.refills,
              route: {
                display: this.routed.display,
                uuid: this.routed.uuid
              },
              frequency: {
                display: this.frequency.display,
                uuid: this.frequency.uuid
              },
              action: this.action,
              quantity: this.quantity,
              quantityUnits: {
                display: this.quantityUnit.display,
                uuid: this.quantityUnit.uuid
              },
              asNeededCondition: this.asNeededReason,
              instructions: this.dosingInstructions,
              type: 'drugorder'
            };
            if (!this.draftedDrug) {
              const  drug = {
                  name: this.sentence,
                  uuid: this.selectedDrug.uuid
                };
                const doseUnits = {
                  units: 'mg',
                  display: this.selectedDrug.dosageForm.display,
                  uuid: this.dosageFormv
                };
                drugOrderPayload.drug = drug;
                drugOrderPayload.doseUnits = doseUnits;

              } else {
                const  drug = {
                  name: this.sentence,
                  uuid: this.selectedDrug.uuid
                };
                const doseUnits = {
                  units: 'mg',
                  display: this.dosageForm,
                  uuid: this.dosageFormv
                };
                drugOrderPayload.drug = drug;
                drugOrderPayload.doseUnits = doseUnits;
              }

          }
        } else if (this.saveType === 'RENEW') {

          drugOrderPayload = {
            patient: this.patient.uuid,
            careSetting: this.caresetting,
            orderer: this.orderer,
            encounter: '',
            drug: this.drugUuid,
            dose: this.dose,
            doseUnits: this.dosageFormv,
            route: this.routed,
            frequency: this.frequency,
            asNeeded: this.asNeeded,
            asNeededCondition: this.asNeededReason,
            instructions: this.dosingInstructions,
            duration : this.duration,
            durationUnits : this.durationUnit,
            orderReasonNonCoded: this.renewReason,
            numRefills: this.refills,
            action: 'RENEW',
            quantity: this.quantity,
            quantityUnits: this.quantityUnit,
            type: 'drugorder'
          };
        }
        this.error = '';
      }
    }
    return drugOrderPayload;
  }
  public previewOrder() {
    this.editDrug = false;
    this.previewOrderMade = true;
  }

  public saveOrder(action) {
    if (action === true && !this.saveType) {
      this.saveType = 'new';
    } else if (action === false) {
      this.saveType = 'draft';
    } else if (this.saveType === 'DISCONTINUE' && action === true) {
      this.saveType = 'RENEW';
    }
    const drugOrderPayload = this.createPayload();
    if (action === true) {
      const encounterPayLoad = this.createEncounterPayload();
      if (this.error) {
        this.error = 'There was an error getting creating the Drug Order';
      } else {

        this.encounterResourceService.saveEncounter(encounterPayLoad).subscribe((response: any) => {
          if (response) {
            drugOrderPayload.encounter = response.uuid;
            this.saveOrderFinal(drugOrderPayload);
          } else {
            this.errors.push({
              id: 'encounter',
              message: 'Error Creating Encounter'
            });
          }
        });
      }

    } else {
      this.postToDraft(drugOrderPayload);
    }

  }
  public saveOrderFinal(drugOrderPayload) {
    this.orderResourceService.saveDrugOrder(drugOrderPayload).subscribe((res) => {
      this.submittedDrugOrder = res;
      if (this.submittedDrugOrder.orderNumber) {
        setTimeout(() => {
          let name;
          if (this.saveType === 'RENEW') {
            name = 'renewal';
          } else if (this.saveType === 'new') {
            name = 'Order New*';
          } else {
            name = 'Order';
          }
          this.successMessage = 'Drug' + '' + name + '' + 'Successful as Order No:' + this.submittedDrugOrder.orderNumber;
        }, 1000);
        setTimeout(() => {
          this.editDrug = false;
          this.successMessage = '';
          this.drurOrder.closeRenewal();
        }, 4000);
      }
    },
      (error) => {
        this.errors.push({
          id: 'similar drug',
          message: 'Patient is under similar medication. Discontinue the other order'
        });
      }
    );
  }
  public createEncounterPayload() {
    return {
      patient: this.patient.uuid,
      encounterType: 'e481dcd3-e9f4-49ee-9612-db8d2ea6abac',
      location: this.selectedLocation,
      encounterDatetime: this.startDate,
      encounterProviders: [{
        provider: this.orderer,
        encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66'
      }]
    };

  }
  public addDraft() {
    this.drugCartList = [];
    this.errors = [];
    const error = {
      message: 'Drug already on Draft: ',
    };
    let status = 1;
    if (localStorage.getItem('drug') !== null) {
      const drugList: any = JSON.parse(localStorage.getItem('drug'));
      this.drugCartList = drugList;
      let item: any = '';
      if (drugList[0] !== null) {
        for (let i = 0; i < drugList.length; i++) {
          if (drugList[i].concept) {
            item = drugList[i].concept.uuid;
            if (this.customDrug) {
              if (item === this.customDrug.uuid) {
                this.errors.push(error);
                status = 0;
                break;
              }
            }
          } else if (drugList[i].drug) {
            item = drugList[i].drug.uuid;
            if (!this.customDrug) {
              if (item === this.selectedDrug.uuid) {
                this.errors.push(error);
                status = 0;
                break;
              }
            }
          }

        }
      }
      if (status === 1) {
        this.saveOrder(false);
      }
    } else {
      this.saveOrder(false);
    }
  }
  public postToDraft(payload) {
    this.drugCartList.push(payload);
    const initialSize = JSON.parse(localStorage.getItem('drug'));
    localStorage.setItem('drug', JSON.stringify(this.drugCartList));
    const dataToParent = JSON.parse(localStorage.getItem('drug')).length;
    let size;
    if (initialSize) {
      size = initialSize.length;
    } else {
      size = 0;
    }
    if (dataToParent > size) {
      this.successMessage = 'Drug added to Draft';
      setTimeout(() => {
        this.drugChanged();
      }, 6000);

    }
    if (this.childEvent) {
      this.childEvent.emit(true);
    } else {
      this.childRenewEvent.emit(true);
      this.changeDraft.emit(dataToParent);
      this.drugChanged();
    }
  }
  public updateStartingDate(startDate) {
    this.startDate = startDate;
  }

}
