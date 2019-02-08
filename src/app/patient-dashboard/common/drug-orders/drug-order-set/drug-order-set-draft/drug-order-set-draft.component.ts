import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DrugOrdersComponent } from '../../drug-orders/drug-orders.component';
import { UserService } from 'src/app/openmrs-api/user.service';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { DrugOrderService } from '../../drug-order.service';
import * as _ from 'lodash';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';

@Component({
  selector: 'app-drug-order-set-draft',
  templateUrl: './drug-order-set-draft.component.html',
  styleUrls: ['./drug-order-set-draft.component.css']
})
export class DrugOrderSetDraftComponent implements OnInit {
  @Output() changeDraft = new EventEmitter();
  public drugList = [];
  public selectedOrders: any;
  public submittedDrugOrder: any;
  public subscription: Subscription;
  public drugName: any;
  public sentence = [];
  public successMessage: string;
  public error: string ;
  public selectedLocation: string;
  public location: string;
  public personUuid: string;
  public ordererName: string;
 public encounter: string;
public orderer: string;
public viewCart = true;
public editDrug = false;
public patient: any;
public locations = [];
public draftData: any;
public locationList = false;
  constructor(private orderResourceService: OrderResourceService,
    private userService: UserService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private encounterResourceService: EncounterResourceService,
    private drugOrderService: DrugOrderService,
    private patientService: PatientService) { }

  ngOnInit() {
    this.getCurrentlyLoadedPatient();
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    this.getProvider();
    const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    this.location = currentLocation.display;
    this.selectedLocation = currentLocation.uuid;
    this.getDraftDrugList();
  }
  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
        }
      }
    );
  }
  public findLocation(searchText) {
    this.locationList = true;
    this.drugOrderService.findLocation(searchText).subscribe((data) => {
      this.locations = data;
    });
  }
  public locationChanged(location) {
    this.locationList = false;
    this.location = location.label;
    this.selectedLocation = location.value;
  }
  public getProvider() {
    this.drugOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.orderer = data.providerUuid;
      this.ordererName = data.label;
    });
  }
  public getDraftDrugList() {
    this.drugList = JSON.parse(localStorage.getItem('drug'));
    // adding the ordersentence on array
    if (this.drugList != null) {
    for (let i = 0; i < this.drugList.length; i++) {
      const drug = this.drugList[i];
      let sentense;
      sentense = [ drug.dose, drug.doseUnits.units, drug.doseUnits.display,
        drug.route.display, drug.frequency.display, drug.quantityUnits.display, drug.quantity
        ];
      if (drug.drug) {
      sentense.unshift(drug.drug.name);
      } else if (drug.concept) {
        sentense.unshift(drug.concept.name);
      }
      this.drugList[i].displayName = sentense.toString();
    }
  }

    this.selectedOrders = this.drugList;
    console.log(this.selectedOrders);
  }
  public placeOrder(selectedOrders) {
    const encounterPayLoad = this.createEncounterPayload();
    this.encounterResourceService.saveEncounter(encounterPayLoad).subscribe((response: any) => {
      if (response) {
      this.encounter = response.uuid;
      console.log(this.encounter);
      }
    });
    let drugPayload;
    setTimeout(() => {
      for (let i = 0; i <= selectedOrders.length; i++) {
        // delete selectedOrders[i].displayName;
        drugPayload = {
          patient: selectedOrders[i].patient,
          careSetting: selectedOrders[i].careSetting,
          orderer: selectedOrders[i].orderer,
          encounter:  this.encounter,
          dose: selectedOrders[i].dose,
          doseUnits: selectedOrders[i].doseUnits.uuid,
          numRefills: selectedOrders[i].numRefills,
          route: selectedOrders[i].route.uuid,
          frequency: selectedOrders[i].frequency.uuid,
          action: selectedOrders[i].action,
          quantity: selectedOrders[i].quantity,
          quantityUnits: selectedOrders[i].quantityUnits.uuid,
          // duration: selectedOrders[i].duration,
          // durationUnits: 'a8a05e82-1350-11df-a1f1-0026b9348838',
          type: 'drugorder'
        };
        console.log(drugPayload);
        if (selectedOrders[i].concept) {
          drugPayload.concept = selectedOrders[i].concept.uuid;
            } else {
              drugPayload.drug =  selectedOrders[i].drug.uuid;
            }
        console.log(drugPayload);
        this.saveDrugOrder(drugPayload);
      }
    }, 1000);

  }
  public saveDrugOrder(payload) {
    this.orderResourceService.saveDrugOrder(payload).subscribe((res) => {
      this.submittedDrugOrder = res;
      setTimeout(() => {
        this.successMessage = 'Drug order Successful as order No:' + this.submittedDrugOrder.orderNumber;
      }, 1000);
      if (payload.concept) {
        this.removeFromCart(payload, true);
      } else {
        this.removeFromCart(payload, true);
      }
    }, (error) => {
      console.log(error);
      this.error = 'Failed: order already exists: you will have to stop the active or renew' + '' + error.error.error.message;

    });
  }
  public removeFromCart(order, status): void {
    console.log(status);
    let id;
    if (order.drug) {
     id = order.drug.uuid;
    } else if (order.concept) {
      id = order.concept.uuid;
    }
    const drug: any = JSON.parse(localStorage.getItem('drug'));
    for (let i = 0; i < drug.length; i++) {
      if (drug.length > 1) {
        const item = drug[i];
        if (item.drug) {
          if (item.drug.uuid === id) {
            drug.splice(i, 1);
            console.log(drug);
            const data = drug;
            setTimeout(() => {
            localStorage.setItem('drug', JSON.stringify(data));
          }, 1000);
            if (status === true) {
              this.successMessage = 'Drug succesfully removed:' + item.drug.name;
            }
            break;
          }
        } else if (item.concept) {
          if (item.concept.uuid === id) {
            drug.splice(i, 1);
            console.log(drug);
            setTimeout(() => {
              const data = drug;
            localStorage.setItem('drug', JSON.stringify(data));
          }, 1000);
            if (status === true) {
            this.successMessage = 'Custom drug succesfully removed:' + item.concept.name;
            }
            break;
          }
        }
      } else {
     this.clearDraft();
      }
    }
    this.getDraftDrugList();
    this.viewCart = false;
    this.viewCart = true;
    this.changeDraftData();
    this.getDraftDrugList();
    this.viewCart = false;
    this.viewCart = true;
    if (status === false) {
      this.viewCart = false;
    this.editDrug = true;
    }
  }
  public changeDraftData () {
    this.changeDraft.emit(true);
  }
  public editOrder (order) {
    this.viewCart = false;
    this.editDrug = true;
    this.draftData = order;
   console.log(this.draftData, 'sekete');
   this.removeFromCart(order, false);
  }
  public clearDraft () {
    localStorage.removeItem('drug');
    this.getDraftDrugList();
    this.viewCart = false;
    this.viewCart = true;
    this.changeDraftData();
    this.getDraftDrugList();
    this.viewCart = false;
    this.viewCart = true;
    this.changeDraftData();
  }
  public createEncounterPayload () {
    return {
       patient: this.patient.uuid,
       encounterType: '59febb70-9eb5-4e09-a822-6fa52e569fce',
       location: this.selectedLocation,
       encounterProviders: [{
         provider: this.orderer,
         encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66'
       }]
     };

   }

}
