import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/openmrs-api/user.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { DrugOrderService } from '../drug-order.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { OderSetResourceService } from 'src/app/openmrs-api/oder-set-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';

@Component({
  selector: 'app-drug-order-set',
  templateUrl: './drug-order-set.component.html',
  styleUrls: ['./drug-order-set.component.css']
})
export class DrugOrderSetComponent implements OnInit {
  @Output() childEvent = new EventEmitter();
  @Output() changeDraft = new EventEmitter();
  panelOpenState = false;

  public drugOrderSets = [];
  public errors: any = [];
  public activeDrugOrderSets = [];
  public inactiveDrugOrderSets = [];
  public selectedOrderSets = [];
  public orderStatus = [];
  public templateDoses = [];
  public templateDosingForm = [];
  public durationUnits = [];
  public quantityUnits = [];
  public routes = [];
  public frequencies = [];
  public dosingUnits = [];
  public drugCartList = [];
  public template: any;
  public options: any;
  public fetchingResults: boolean;
  public isBusy: boolean;
  public drugSets = [];
  public drugDraft = false;
  public loadingDrugOrderSetStatus = true;
  public drugSetName: string;
  public orderSentenceArray: any;
  public displaySetDetails = false;
  public allList = false;
  public selectedList = false;
  public routeName: string;
  public doseForm: any;
  public newSentence = [];
  public finalSentence: string;
  public setHeader: string;
  public setMembers = [];
  public set: any;
  public viewSets = true;
  public viewSingleSet = false;
  public caresetting = '6f0c9a92-6f24-11e3-af88-005056821db0';

  private personUuid: string;
  public doseUnits: any;
  public frequency: any;
  public error: string;
  public route: any;
  public action = 'NEW';
  public quantity: number;
  public quantityUnit: any;
  public locationList = false;
  public concept: string;
  public location: string;
  public selectedLocation: string;
  public locations = [];
  public duration: number;
  public durationUnit: any;
  public drug: string;
  public drugs = [];
  public selectedDrug: any;
  public customDrug: any;
  public drugId: string;
  public refills: number;
  public dose: string;
  private provider: string;
  private patient: any;
  public subscription: Subscription;
  private patientIdentifer: any;
  public drugSetList = false;
  public addSet = false;
  public parentVisible = true;

  public display = false;
  public displayEdit = false;
  public startDate: any;
  public header: string;

  constructor(private _formBuilder: FormBuilder, private patientService: PatientService,
    private userService: UserService, private drugOrderService: DrugOrderService,
    private encounterResourceService: EncounterResourceService,
    private orderSetResourceService: OderSetResourceService,
    private localStorageService: LocalStorageService,
    private conceptResourceService: ConceptResourceService) { }

  ngOnInit() {
    this.getCurrentlyLoadedPatient();
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    this.getProvider();
    this.getDrugOrdersSet();
  }

  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          const amrsId = _.find(this.patient.identifiers.openmrsModel,
            (identifer: any) => {
              if (identifer.identifierType.uuid === '58a4732e-135x9-11df-a1f1-0026b9348838') {
                return true;
              }
            });
          if (amrsId) {
            this.patientIdentifer = amrsId.identifier;
          }
          this.getDrugOrdersSet();
        }
      }
    );
  }

  public getProvider() {
    this.drugOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.provider = data.providerUuid;
    });
  }
  public getDrugOrdersSet() {
    this.fetchingResults = true;
    const orderSets = [];
    this.isBusy = true;
    const patientUuId = this.patient.uuid;
    this.orderSetResourceService.getAllOrderSets()
      .subscribe((data) => {
        data = data.results;
        data.forEach((value) => {
          orderSets.push(value);
        });
        if (orderSets) {
          this.drugOrderSets = orderSets.reverse();
          console.dir(this.drugOrderSets);
          this.selectedOrderSets = this.drugOrderSets;
          console.log(this.selectedOrderSets, 'selected');
          this.orderSetTemplateConverter();
          this.drugOrderSets.forEach((value) => {
            if (value.dateStopped) {
              this.inactiveDrugOrderSets.push(value);
            } else if (!value.dateStopped) {
              this.activeDrugOrderSets.push(value);
            }
          });
          this.fetchingResults = false;
          this.loadingDrugOrderSetStatus = false;
          this.isBusy = false;
        }
      });
  }
  public orderSetTemplateConverter() {

    for (let i = 0; i < this.selectedOrderSets.length; i++) {
      const orderTemplate = this.selectedOrderSets[i].orderSetMembers;

      for (let b = 0; b < orderTemplate.length; b++) {
        this.selectedOrderSets[i].concept = orderTemplate[b].concept;
        const jsonTemplate = JSON.parse(orderTemplate[b].orderTemplate);
        this.selectedOrderSets[i].template = jsonTemplate;
      }
      setTimeout(() => {
        this.filterOrders(this.selectedOrderSets);
      }, 200);

    }
    console.log('orderset', this.selectedOrderSets);

  }
  private filterOrders(orderSets) {
    const orderSetStatus = [];
    orderSets.forEach((value) => {
      if (value.dateStopped) {
        orderSetStatus.push('INACTIVE');
      } else if (!value.dateStopped) {
        orderSetStatus.push('ACTIVE');
      }
    });
    if (orderSetStatus.length > 0) {
      this.orderStatus = this.getUniqueNames(orderSetStatus);
    }
  }
  private getUniqueNames(originArr) {
    const newArr = [];
    const originLength = originArr.length;
    let found, x, y;
    for (x = 0; x < originLength; x++) {
      found = undefined;
      for (y = 0; y < newArr.length; y++) {
        if (originArr[x] === newArr[y]) {
          found = true;
          break;
        }
      }
      if (!found) {
        newArr.push(originArr[x]);
      }
    }
    return newArr;
  }
  public findDrugSets(searchText) {
    this.drugSetList = true;
    this.drugOrderService.findDrugSets(searchText).subscribe((data) => {
      this.drugSets = data;
    });
  }
  public addOrderSet(data) {
    this.addSet = true;
    this.parentVisible = false;
  }
  public viewDrugTemplateSelected(drug) {
    console.log(drug);
    this.drug = drug.name;
    this.drugId = drug.uuid;
    console.log('template', this.drug);
    const jsonTemplate = JSON.parse(drug.orderTemplate);
    this.template = jsonTemplate[0].template;
    drug.orderTemplate = this.template;
    if (drug.concept) {
      this.selectedDrug = drug;
    } else {
      this.customDrug = drug;
    }
    // this.assignTemplateValues(this.template);

    // display values
    this.errors = [];
    this.displaySetDetails = false;
    this.displayEdit = true;
  }
  public viewSetDetails(orderSet) {
    if (orderSet.name) {
      console.log(orderSet);
      this.viewSets = false;
      this.selectedList = false;
      this.displaySetDetails = true;
      this.setHeader = orderSet.name;
      this.setMembers = orderSet;
      this.allList = true;
    } else {
     this.returnToSets();
    }

  }
  public returnToSets () {
    this.getDrugOrdersSet();
    this.viewSets = true;
    this.displaySetDetails = false;
    this.allList = false;
    this.selectedList = false;
  }
  public viewDrugDetails(orderTemplate, concept, name) {
    this.displayEdit = false;
    console.log(orderTemplate, 'sakode');
    if (!this.setHeader) {
      this.setHeader = name;
    }
    if (orderTemplate.name) {
      concept = orderTemplate.concept;
      orderTemplate = orderTemplate.orderTemplate;
    }
    this.allList = false;
    this.viewSets = false;
    this.displaySetDetails = true;
    this.selectedList = true;
    console.log(concept);
    this.drugOrderService.findDrug(concept.display).subscribe((data) => {
      const custom = {
        name: '(custom)-' + concept.display,
        uuid: concept.uuid
      };
      data.push(custom);
      data.forEach(element => {
        element.orderTemplate = orderTemplate;
      });
      this.drugs = data;
      this.set = {
        name: this.setHeader,
        orderTemplate: orderTemplate,
        concept: concept

      };
    });


  }



}
