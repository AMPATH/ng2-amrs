import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';


import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModalDirective } from 'ngx-bootstrap';

import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { DrugOrderService } from '../drug-order.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';


@Component({
  selector: 'app-drug-orders',
  templateUrl: './drug-orders.component.html',
  styleUrls: ['./drug-orders.component.css']
})
export class DrugOrdersComponent implements OnInit {

  @ViewChild('modal')
  public modal: ModalComponent;
  @ViewChild('imageModal') public imageModal: ModalDirective;

  public drugOrders = [];
  public activeDrugOrders = [];
  public inactiveDrugOrders = [];
  public selectedOrders = [];
  public orderStatus = [];
  public reviseOrders;
  public frequencies: string;
  public error: string;
  public page = 1;
  public fetchingResults: boolean;
  public isBusy: boolean;
  public caresetting = '6f0c9a92-6f24-11e3-af88-005056821db0';
  public subscription: Subscription;
  public addOrders = false;
  public addOrderSet = false;
  public searchText: string;
  public column: string;
  public isDesc = false;
  public drug: string;
  public previousOrder: string;
  public concept: string;
  public encounter: string;
  public dose: DoubleRange;
  public doseUnits: string;
  public route: string;
  public frequency: string;
  public orderReasonNonCoded: string;
  public instructions: string;
  public numRefills: number;
  public quantity: number;
  public quantityUnits: string;
  private personUuid: string;
  private provider: string;
  private patient: any;
  private patientIdentifer: any;
  public loadingDrugOrderStatus = true;
  public orderSent: any;
  public orderValue: any;
  public display = false;
  public drugDraft = false;
  public displayStop = false;
  public displayEdit = false;
  public displayRenew = false;
  public header: string;
  public status = false;
  public revealPatientOrders = true;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public errorTitle: string;
  public errors: any = [];
  public successAlert: any = '';
  public durationUnits;
  public routes = [];
  public quantityUnit = [];
  public durationunit = [];
  public dosingUnits = [];
  public startDate = new Date();
  public duration: any;
  public durationunits: any;
  public pdfSrc: any;
  public drugsNoInDraft: any;
  public viewDraft = false;
  public drugOrdersUuid = '53eb466e-1359-11df-a1f1-0026b9348838';
  public drugInDraft: any = JSON.parse(localStorage.getItem('drug'));

  constructor(
    private patientService: PatientService,
    private userService: UserService,
    public datepipe: DatePipe,
    private encounterService: EncounterResourceService,
    private orderResourceService: OrderResourceService,
    private drugOrderService: DrugOrderService
  ) { }

  public ngOnInit() {
    this.getCurrentlyLoadedPatient();
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    this.getProvider();
  }

  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          const prefferedId = _.find(this.patient.identifiers.openmrsModel,
            (identifer: any) => {
              if (identifer.preferred) {
                return true;
              }
            });
          if (prefferedId) {
            this.patientIdentifer = prefferedId.identifier;
          }
          this.getDrugOrders();
          this.handleDraftData(this.patient.uuid);
        }
      }
    );
  }
  public handleDraftData(patient) {
    if (localStorage.getItem('drug') !== null) {
      if (this.drugInDraft) {
        this.drugsNoInDraft = this.drugInDraft.length;
      } else {
        this.drugsNoInDraft = 0;
      }
      this.drugDraft = false;
      this.drugDraft = true;
      for (let i = 0; i < this.drugInDraft.length; i++) {
        const item = this.drugInDraft[i];
        if (item.patient !== patient) {
          this.drugInDraft.splice(i, 1);
          localStorage.setItem('drug', JSON.stringify(this.drugInDraft));
          if (this.drugInDraft.length === 0) {
            localStorage.removeItem('drug');
            this.drugDraft = false;
          }

          break;
        }
      }
      if (this.drugInDraft.length === 0) {
        localStorage.removeItem('drug');
        this.handleDraftData(this.patient.uuid);
      }
    } else {
      this.drugDraft = false;
    }

  }
  public getProvider() {
    this.drugOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.provider = data.providerUuid;
    });
  }

  public getDrugOrders() {
    this.fetchingResults = true;
    const drugs = [];
    this.inactiveDrugOrders = [];
    this.activeDrugOrders = [];
    this.isBusy = true;
    const patientUuId = this.patient.uuid;
    this.orderResourceService.getAllOrdersByPatientUuuid(patientUuId, this.caresetting)
      .subscribe((data) => {
        data = data.results;
        data.forEach((value) => {
          if (value.orderType.uuid === this.drugOrdersUuid) {
            drugs.push(value);
          }
        });
        if (drugs) {
          this.drugOrders = drugs.reverse();
          setTimeout(() => {
            this.selectedOrders = this.drugOrders;
          }, 3000);
          this.filterOrders(this.drugOrders);
          this.drugOrders.forEach((value) => {
            if (value.dateStopped) {
              this.inactiveDrugOrders.push(value);
            } else if (!value.dateStopped) {
              this.activeDrugOrders.push(value);
            }
          });
          this.fetchingResults = false;
          this.loadingDrugOrderStatus = false;
          this.isBusy = false;
        }
      });
    setTimeout(() => {
      this.loadingDrugOrderStatus = false;
    }, 3000);
  }

  public addOrder(show) {
    this.addOrders = show;
    this.viewDraft = false;
    this.addOrderSet = false;


    if (show === false) {
      this.revealPatientOrders = true;
      this.addOrderSet = false;
      this.viewDraft = false;
      this.displayEdit = false;
      this.addOrders = false;
      this.getDrugOrders();
      this.revealPatientOrders = false;
      this.revealPatientOrders = true;
      this.handleDraftData(this.patient.uuid);
    } else if (show === 'draft') {
      this.revealPatientOrders = false;
      this.addOrderSet = false;
      this.viewDraft = true;
      this.displayEdit = false;
      this.addOrders = false;
      this.getDrugOrders();
    } else {
      this.revealPatientOrders = false;
    }
    setTimeout(() => {
      this.getDrugOrders();
    }, 3000);
  }
  public addOrderset(show) {
    this.addOrderSet = show;
    this.addOrders = false;
    this.viewDraft = false;
    this.revealPatientOrders = false;
  }

  public onOrderStatuChange(status) {
    if (status === 'INACTIVE') {
      this.selectedOrders = this.inactiveDrugOrders;
    } else if (status === 'ACTIVE') {
      this.selectedOrders = this.activeDrugOrders;
    } else {
      this.selectedOrders = this.drugOrders;
    }
  }
  public discontinueOrder(order) {
    this.display = true;
    this.displayStop = true;
    this.displayEdit = false;
    this.displayRenew = false;
    this.header = 'Stop Drug Order';
    this.orderValue = order;


  }
  public processStopValue() {
    this.display = false;
    this.orderResourceService.getOrderByUuid(this.orderValue.uuid).subscribe((data) => {
      if (!data.dateStopped) {
        const discontinuePayload = this.createPayload(data, 'DISCONTINUE');
        if (window.confirm('Are You Sure You Want To Discontnue This Drug?')) {
          this.drugOrderService.saveOrder(discontinuePayload).subscribe((success) => {
            window.alert('The Order was Successfully Discontinued');
            this.getDrugOrders();
          });
        }
      }
    });
  }

  public renewOrder(order) {
    this.display = true;
    this.displayStop = false;
    this.displayEdit = false;
    this.displayRenew = true;
    this.header = 'Renew Drug Order';
    this.orderValue = order;
  }
  public processRenewOrder(orderValue) {
    this.status = true;
    this.orderResourceService.getOrderByUuid(orderValue).subscribe((data) => {

      if (data.dateStopped) {
        const renewPayload = this.createPayload(data, 'RENEW');
        this.drugOrderService.saveOrder(renewPayload).subscribe((success) => {
          this.displaySuccessAlert('The Order was Successfully Renewed');
          this.getDrugOrders();
        }, (err) => {
          err = err.json();
          this.errors.push({
            message: 'There was an error: ' + err.error.message
          });
        });
      } else if (!data.dateStopped) {

        const discontinuePayload = this.createPayload(data, 'DISCONTINUE');
        const dis = this.drugOrderService.saveOrder(discontinuePayload).subscribe((success) => {
          return true;
        }, (err) => {
          return false;
        });

        if (dis) {
          const payload = this.createPayload(data, 'RENEW');
          if (this.status === true) {
            this.drugOrderService.saveOrder(payload).subscribe((response) => {
              this.displaySuccessAlert('The Order was Successfully Renewed');

              this.getDrugOrders();
            });
          }
        } else {
          this.displaySuccessAlert('The Order was Successfully Renewed');
          this.getDrugOrders();
        }

      }
    });
    this.status = false;
    this.getDrugOrders();
    this.orderValue = '';
  }

  public reviseOrder(order) {
    this.header = 'Edit Drug Order';
    this.orderValue = order;
    this.orderResourceService.getOrderByUuid(this.orderValue.uuid).subscribe((data2) => {
      this.reviseOrders = data2;
      this.display = false;
      this.displayStop = false;
      this.displayRenew = false;
      this.displayEdit = true;
      this.revealPatientOrders = false;
      this.addOrders = false;
      this.addOrderSet = false;
      this.viewDraft = false;
    });

  }

  public sort(property) {
    this.isDesc = !this.isDesc;
    this.column = property;
    const direction = this.isDesc ? 1 : -1;

    this.selectedOrders.sort((a, b) => {
      if (a[property] < b[property]) {
        return -1 * direction;
      } else if (a[property] > b[property]) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
  }

  private filterOrders(orders) {
    const orderStatus = [];
    orders.forEach((value) => {
      if (value.dateStopped) {
        orderStatus.push('INACTIVE');
      } else if (!value.dateStopped) {
        orderStatus.push('ACTIVE');
      }
    });
    if (orderStatus.length > 0) {
      this.orderStatus = this.getUniqueNames(orderStatus);
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

  private createPayload(order, action) {
    if (action === 'DISCONTINUE') {
      return {
        orderer: this.provider,
        patient: order.patient.uuid,
        careSetting: order.careSetting.uuid,
        concept: order.concept.uuid,
        encounter: order.encounter.uuid,
        action: 'DISCONTINUE',
        type: 'drugorder'
      };
    } else if (action === 'RENEW') {
      if (!this.frequency) {
        this.error = 'Frequency is required';
      } else if (!this.dose) {
        this.error = 'Dose is required';
      } else if (!this.quantity) {
        this.error = 'Quantity is required';
      } else if (!this.numRefills) {
        this.error = 'Refills is required';
      } else {
        return {
          previousOrder: this.reviseOrders.uuid,
          patient: this.patient.uuid,
          careSetting: this.reviseOrders.careSetting.uuid,
          orderer: this.provider,
          concept: this.reviseOrders.concept.uuid,
          encounter: this.reviseOrders.encounter.uuid,
          drug: this.reviseOrders.drug.uuid,
          dose: this.dose,
          doseUnits: this.doseUnits,
          route: this.route,
          frequency: this.frequency,
          asNeeded: this.reviseOrders.asNeeded,
          orderReasonNonCoded: this.orderReasonNonCoded,
          asNeededCondition: this.reviseOrders.asNeededReason,
          instructions: this.instructions,
          numRefills: this.numRefills,
          action: 'RENEW',
          quantity: this.quantity,
          quantityUnits: this.quantityUnits,
          type: 'drugorder'
        };
      }
    }

    this.showSuccessAlert = true;
    // this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 1000);
  }
  public dismissDialog() {
    this.display = false;
  }
  public displaySuccessAlert(message) {

  }
  public updateStartDate(startDate) {
    this.startDate = startDate;
  }
  public viewDrugCart() {
    this.viewDraft = true;
    this.addOrder('draft');
    this.displayEdit = false;
    this.revealPatientOrders = false;
  }
  public closeDraft () {
    this.viewDraft = false;
    this.revealPatientOrders = false;
  }
  public calculateDraftList(status) {
    if (status === true) {
      this.getCurrentlyLoadedPatient();
      this.handleDraftData(this.patient.uuid);
    }
  }
  public closeRenewal() {
    this.displayEdit = false;
    this.addOrderSet = false;
    this.viewDraft = false;
    this.displayEdit = false;
    this.addOrders = false;
    this.getDrugOrders();
    this.revealPatientOrders = false;
    this.revealPatientOrders = true;
    this.getCurrentlyLoadedPatient();
    this.handleDraftData(this.patient.uuid);

  }
  public viewOrder(order) {
   const payload = {
      name: this.patient.person.display,
      opno: this.patientIdentifer,
      other_id: '',
      telno: this.patient.person.patientPhoneNumber,
      diagnosis: 'Ductal Carnicoma',
      age: order.patient.person.age,
      date_of_birth: this.dateTransformation(order.patient.person.birthdate),
      cycle: 2,
      height: 150,
      weight: 60,
      bsa: 3.12,
      sex: order.patient.person.gender,
      regimen: 'nleomyciun',
      goal: (_.isObject(order.orderReason) ? order.orderReason.display.display : order.orderReason),
      // goal: 'test',
      provider: order.orderer.display,
      drugs: [],
     laboratory_studies: []

  };
  const identities = [];
  order.patient.identifiers.forEach(identifier => {
    identities.push(identifier.display);
  });
  payload.other_id = identities.toString();
  order.encounter.orders.forEach(drug => {
    const drugPayLoad = {
      name : drug.display,
      dosage: JSON.stringify(drug.dose)
    };
    payload.drugs.push(drugPayLoad);
  });
  this.encounterService.getEncountersByPatientUuid(this.patient.uuid).subscribe((encounter) => {
  encounter.forEach(encounterSelected => {
    if (this.dateTransformation(encounterSelected.encounterDatetime) === this.dateTransformation(order.dateActivated)) {
      if (encounterSelected.encounterType.uuid === '2cd62224-5507-48ee-a7b3-55f66162b148' || '5fa823ce-7592-482f-a0aa-361abf326ade') {
        this.encounterService.getEncounterByUuid(encounterSelected.uuid).subscribe((encounterDetails) => {
          if (encounterSelected.encounterType.uuid === '2cd62224-5507-48ee-a7b3-55f66162b148') {
            encounterDetails.obs.forEach(group => {
              const labPayload = {
                name: group.concept.name.display,
                value: JSON.stringify((_.isObject(group.value) ? group.value.display : group.value))
             };
             payload.laboratory_studies.push(labPayload);
             });
          } else if (encounterSelected.encounterType.uuid === '5fa823ce-7592-482f-a0aa-361abf326ade') {
            encounterDetails.obs.forEach(ob => {
              const obsNeeded = ob.concept.uuid ;
              if (obsNeeded === 'a8a6619c-1350-11df-a1f1-0026b9348838') {
                payload.height = ob.value;
              } else if (obsNeeded === 'a898c87a-1350-11df-a1f1-0026b9348838') {
                payload.bsa = ob.value;
              } else if ( obsNeeded === 'a8a660ca-1350-11df-a1f1-0026b9348838') {
               payload.weight = ob.value;
              }
            });
          }
        });
      }
    }

  });
  });
  setTimeout(() => {
    this.drugOrderService.printPdf(payload).subscribe((file) => {
      this.pdfSrc = file.changingThisBreaksApplicationSecurity;
      this.imageModal.show();
    });
  }, 3000);
  }
  public dateTransformation (dateReceived) {
   const date = this.datepipe.transform(dateReceived, 'dd-MM-yyyy');
   return date;
  }
  public download (src) {
    window.open(src, '_blank');
  }
}
