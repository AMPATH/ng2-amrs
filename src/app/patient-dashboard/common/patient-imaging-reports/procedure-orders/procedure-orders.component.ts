import { Component, OnInit, ViewChild, Input, forwardRef, DoCheck } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as _ from 'lodash';
import * as Moment from 'moment';

import { ModalDirective } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { ProcedureOrdersService } from './procedure-orders.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
import { FileUploadResourceService } from 'src/app/etl-api/file-upload-resource.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { FeedBackService } from 'src/app/feedback/feedback.service';



@Component({
  selector: 'app-procedure-orders',
  templateUrl: './procedure-orders.component.html',
  styleUrls: ['./procedure-orders.component.css'],

})
export class ProcedureOrdersComponent implements OnInit, DoCheck {
  @Input() sentData: any;
  public procedureOrders = [];
  public procedureOrdersWithResults = [];
  public procedureOrdersWithoutResults = [];
  public selectedOrders = [];
  public selectedOrdersWithObs = [];
  public orderStatus = [];
  public reviseOrders;
  public error: string;
  public selectedOrderStatus: string;
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
  public route: string;
  public frequency: string;
  public orderReasonNonCoded: string;
  public instructions: string;
  private personUuid: string;
  private provider: string;
  private patient: any;
  private patientIdentifer: any;
  public loadingProcedureOrderStatus = true;
  public orderSent: any;
  public orderValue: any;
  public display = false;
  public resultsDisplay = false;
  public voidOrderButton = false;
  public resultView = true;
  public deleteResultsButton = this.ProcedureOrderService.checkProcedureandResultDeletingRights();
  public uploadingResults = false;
  public showDetails = false;
  public displayResultsChange = false;
  public displayEdit = false;
  public displayRenew = false;
  public displayNew = false;
  public displayAddResults = false;
  public selectedProcedure: string;
  public header: string;
  public header2: string;
  public viewResults: string;
  public status = false;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public errorTitle: string;
  public errors: any = [];
  public proc = [];
  public any: string;
  public orders: any;
  public successAlert: any = '';
  public currentDate;
  public selectedLocation: string;
  public locationList = false;
  public location: string;
  public submittedProcedureOrder;
  public newProcedure = false;
  public subscriptions = [];
  public imageSaved = false;
  public imageDeleted = false;
  public deleteStatus = true;
  public imageDeletedFailed = false;
  public imageUploadFailed = false;
  private procedure: string;
  public proceduresOrdered = true;
  public displayEditRequest = false;
  public procedureList = false;
  public procedureName: string;
  public imageServerId: any;
  public imageText: string;
  public imageStatusValue: any;
  public patientObs: any;
  public patientObsWithOrders: any;
  public selectedProc: any;
  public orderNumber: string;
  public procedureConceptList = [];
  public obs = [];
  public ObsImages = [];
  public dateRecieved: any;
  public imageControlButtons = false;
  public objectNumber = 0;
  public Slackpayload = {
    name: '',
    phone: '',
    message: '',
    location: '',
    department: ''
};
  imageLink = '';
  @ViewChild('imageModal')
  public imageModal: ModalDirective;


  constructor(private patientService: PatientService,
    private userService: UserService,
    private feedBackService: FeedBackService,
    private orderResourceService: OrderResourceService,
    private ProcedureOrderService: ProcedureOrdersService,
    private encounterResourceService: EncounterResourceService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private fileUploadResourceService: FileUploadResourceService,
    private conceptResourceService: ConceptResourceService,
    private obsResourceService: ObsResourceService,
  ) { }

  ngOnInit() {
    console.log(this.sentData);
    this.getProcedures();
    this.getCurrentlyLoadedPatient();
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    this.getProvider();
    const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    this.location = currentLocation.display;
    this.selectedLocation = currentLocation.uuid;
    this.currentDate = Date.now();
  }
  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.getPatientObs(this.patient.uuid);
          const amrsId = _.find(this.patient.identifiers.openmrsModel,
            (identifer: any) => {
              if (identifer.identifierType.uuid === '58a4732e-135x9-11df-a1f1-0026b9348838') {
                return true;
              }
            });
          if (amrsId) {
            this.patientIdentifer = amrsId.identifier;
          }
          this.getProcedureOrders();
        }
      }
    );
  }
  public getProvider() {
    this.ProcedureOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.provider = data.providerUuid;
    });
  }
   public ngDoCheck() {
    if (this.sentData.orders !== this.orders) {
  this.getProcedureOrders();
    }
  }
  public getProcedureOrders() {
    this.fetchingResults = true;
    const procedures = [];
    this.isBusy = true;
    const patientUuId = this.patient.uuid;
       const data = this.sentData.orders;
       if (data === '') {

       } else {
        this.orders = data;
        data.forEach((value) => {
          if (value.orderType.uuid === '53eb4768-1359-11df-a1f1-0026b9348838') {
            this.procedureConceptList = this.proc;
            for (const results of this.procedureConceptList) {
              if (results.uuid === value.concept.uuid && !value.dateStopped) {
                procedures.push(value);
              }
            }
          }
        });
        if (procedures) {
          this.procedureOrders = procedures.reverse();
          this.selectedOrders = this.procedureOrders;

          this.assignOrdersResultsObs(this.selectedOrders);

          this.selectedOrdersWithObs = this.selectedOrders;
          this.fetchingResults = false;
          this.loadingProcedureOrderStatus = false;
          this.isBusy = false;
        }
        return Observable.of(this.selectedOrders);
       }
  }

  public assignOrdersResultsObs(selectedOrders) {
    const status = {
      'status': 0,
      'picUrl': '',
      'obsUuid': '',
      'date': ''
    };
    // check if procedure has results
    // if so change  results to be viewable and add  edit  ability to actions column
    for (let i = 0; i < this.selectedOrders.length; i++) {
      this.selectedOrders[i].status = status;
      this.procedureOrdersWithoutResults = [];
      this.procedureOrdersWithResults = [];
      setTimeout(() => {
        this.selectedOrders[i].status = this.checkResults(this.selectedOrders[i].uuid);
        if (this.selectedOrders[i].status.status === 0) {
          this.procedureOrdersWithoutResults.push(this.selectedOrders[i]);
        } else if (this.selectedOrders[i].status.status === 1) {
          this.procedureOrdersWithResults.push(this.selectedOrders[i]);
        }
        this.selectedOrders[i].results = this.searchObs(this.selectedOrders[i].uuid);
        this.filterOrders(this.selectedOrders);
      }, 200);

    }

  }
  public getPatientObs(patientUuid) {
    const OrderResultsConcept = '9ab23532-40e4-4e98-85bd-bb9478d805ac';
    this.obsResourceService.getObsPatientObsByConcept(patientUuid, OrderResultsConcept).subscribe((result: any) => {
      this.patientObs = result.results;
    },
      (error) => {
        console.error('error', error);
      });

  }
  private filterOrders(orders) {
    const orderStatus = [];
    orders.forEach((value) => {
      if (value.status.status === 0) {
        orderStatus.push('NO RESULTS');
      } else if (value.status.status === 1) {
        orderStatus.push('RESULTS AVAILABLE');
      }
    });
    if (orderStatus.length > 0) {
      this.orderStatus = this.getUniqueNames(orderStatus);
    }
  }

  public onOrderStatuChange(status) {
    if (status === 'NO RESULTS') {
      this.selectedOrders = this.procedureOrdersWithoutResults;
    } else if (status === 'RESULTS AVAILABLE') {
      this.selectedOrders = this.procedureOrdersWithResults;
    } else {
      this.selectedOrders = this.selectedOrdersWithObs;
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
  private getProcedures() {
    const orderProcdure = '2012a1c5-3be4-4ba7-a76d-22db951296ed';
    this.conceptResourceService.getConceptByUuid(orderProcdure).subscribe((data) => {
      this.proc = data.setMembers;

    });
  }
  public getConceptsClass(searchText) {
    this.procedureList = true;
    let ProcedureResults: any[];
    const conceptClassesUuidArray = '8d490bf4-c2cc-11de-8d13-0010c6dffd0f';
    ProcedureResults = this.conceptResourceService.getConceptByConceptClassesUuid(searchText, conceptClassesUuidArray);

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

  public addProc(show) {
    this.proceduresOrdered = false;
    this.displayNew = show;
    this.addOrders = true;
    this.procedure = this.proc[0].uuid;
    this.header = 'New Procedure Order';
    this.proceduresOrdered = true;
  }
  public dismissDialog() {
    this.display = false;
    this.displayRenew = false;
    this.resultsDisplay = false;
    this.displayAddResults = false;
    this.displayNew = false;
    this.displayResultsChange = false;
  }


  public saveOrder() {
    const procedureOrderPayload = this.createPayload();
    this.saveProcedureOrder(procedureOrderPayload);
    this.defaultView();

  }

  public createPayload() {
    let procedureOrderPayload;

    if (!this.procedure) {
      this.errors.push({
        message: 'Please Select A procedure'
      });
      setTimeout(() => {
        this.errors = false;
      }, 1000);
    } else {
      procedureOrderPayload = {
        patient: this.patient.uuid,
        careSetting: this.caresetting,
        orderer: this.provider,
        encounter: '',
        concept: this.procedure,
        type: 'testorder'
      };
      this.error = '';
    }
    return procedureOrderPayload;
  }

  public onFileChange(file, orderNumber) {
    this.fileUploadResourceService.upload(file).subscribe((result: any) => {
      this.imageServerId = result.image;
      const obsPayload = {
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        concept: '9ab23532-40e4-4e98-85bd-bb9478d805ac',
        person: this.patient.uuid,
        value: this.imageServerId,
        order: orderNumber
      };
      this.displaySuccessAlert();
      this.saveObs(obsPayload);
      // image on ocr
    });

  }
  private displaySuccessAlert() {
    this.imageSaved = true;
    setTimeout(() => {
      this.imageSaved = false;
    }, 3000);
  }
  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

  public checkResults(orderNumber) {
    const patientObs: any = this.patientObs;
    let status = {
      'status': 0,
      'picUrl': '',
      'obsUuid': ''
    };

    for (const value of patientObs) {

      const checkstatus = this.checkValue(value, orderNumber);
      if (checkstatus.status === 1) {
        status = checkstatus;
        break;
      } else {
        status = checkstatus;
      }
    }

    return status;
  }
  // find all images for a particular order
  searchObs(orderNumber) {
    const patientObs: any = this.patientObs;
    const obsUuid = [];
    for (const value of patientObs) {
      const checkstatus = this.checkValue(value, orderNumber);
      if (checkstatus.status === 1) {
        const imageObs = {
          'obs': checkstatus.obsUuid,
          'imageUrl': checkstatus.picUrl
        };
        obsUuid.push(imageObs);
      } else {
      }
    }


    return obsUuid;


  }
  checkValue(value: any, orderNumber) {
    let imageStatus = {
      'status': 0,
      'picUrl': '',
      'obsUuid': '',
      'date': ''
    };
    if (value.order) {
      if (value.order.uuid === orderNumber) {
        imageStatus = {
          'status': 1,
          'picUrl': value.value,
          'obsUuid': value.uuid,
          'date': value.obsDatetime
        };
      } else {
        imageStatus = {
          'status': 0,
          'picUrl': '',
          'obsUuid': '',
          'date': ''

        };
      }
    } else {
      imageStatus = {
        'status': 0,
        'picUrl': '',
        'obsUuid': '',
        'date': ''
      };
    }
    return imageStatus;
  }
  showResults(order) {
    this.header2 = order.orderNumber;
    this.imageLink = `${order.status.picUrl}`;
    this.dateRecieved = order.status.date;
    this.ObsImages = order.results.reverse();
    this.orderNumber = order;
    if (this.ObsImages.length > 1) {
      this.imageControlButtons = true;
    }
    this.imageModal.show();

  }
  // actions done on individual procedures.

  public renewOrder(order) {
    this.display = true;
    this.displayResultsChange = false;
    this.displayNew = false;
    this.displayRenew = true;
    this.displayAddResults = false;
    this.header = 'Order Similar Procedure';
    this.orderValue = order;
  }
  public saveProcedureOrder(procedureOrderPayload) {
    const encounterPayLoad = {
      patient: this.patient.uuid,
      encounterType: '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
      // encounterType: '6a664732-560c-4ad4-ac38-b59ebe330897',
      location: this.selectedLocation,
      encounterProviders: [{
        provider: this.provider,
        encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66'
      }]
    };

    if (this.error) {
      this.error = 'There was an error getting creating the Procedure Order';
    } else {

      this.encounterResourceService.saveEncounter(encounterPayLoad).subscribe((response: any) => {
        if (response) {
          procedureOrderPayload.encounter = response.uuid;
          this.orderResourceService.saveProcedureOrder(procedureOrderPayload).subscribe((res) => {
            this.submittedProcedureOrder = res;
            this.newProcedure = true;
            setTimeout(() => {
              this.getProcedureOrders();
            }, 500);
            this.display = false;
            this.newProcedure = false;
          });
        } else {
          this.error = 'Error creating Encounter';
        }
      });
    }
  }
  public changeResults(order) {
    this.proceduresOrdered = false;
    this.displayEditRequest = true;
    this.header = 'Change Procedure Results';
    this.orderValue = order.orderNumber;
    this.orderNumber = order.orderNumber;
    this.obs = order.results;
    this.displayResultsChange = true;
  }
  public approveEdit() {
    this.displayResultsChange = false;
    this.displayEditRequest = false;
  }
  public onFileChangeResults(file, action, orderNumber) {
    this.fileUploadResourceService.upload(file).subscribe((result: any) => {
      if (!this.orderNumber) {
        this.orderValue = orderNumber;
      }
      this.imageServerId = result.image;
      const obsPayload = {
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        concept: '9ab23532-40e4-4e98-85bd-bb9478d805ac',
        person: this.patient.uuid,
        value: this.imageServerId,
        order: this.orderValue || orderNumber
      };

      this.saveObs(obsPayload);
      if (action === true) {
        for (let i = 0; i < this.obs.length; i++) {
          this.deleteResult(this.obs[i].obs);
        }
      } else {
        this.imageModal.hide();
      }
    },
      (error) => {
        console.error('error', error);
      });
    this.getPatientObs(this.patient.uuid);
    this.getProcedureOrders();
    setTimeout(() => {
      this.dismissDialog();
    }, 3000);
  }
  public saveObs(obsPayload) {
    this.obsResourceService.saveObs(obsPayload).pipe(take(1)).subscribe(
      (success) => {
        if (success) {
          this.uploadingResults = true;
          this.getPatientObs(this.patient.uuid);
          setTimeout(() => {
            this.getProcedureOrders();
          }, 500);
          this.uploadingResults = false;
        }
      },
      (error) => {
        console.error('error', error);
      }
    );

  }
  public showOrder(order) {
    this.proceduresOrdered = false;
    this.resultView = true;
    this.voidOrderButton = this.ProcedureOrderService.checkProcedureandResultDeletingRights();
    this.resultsDisplay = true;
    this.viewResults = 'PROCEDURE:' + order.orderNumber;
    this.showDetails = true;
    this.selectedProc = order;
  }
  public defaultView() {
    this.resultsDisplay = false;
    this.proceduresOrdered = true;
    this.addOrders = false;
    this.displayResultsChange = false;
  }
  public discard(selectedProc) {
    this.resultView = false;
    this.resultsDisplay = true;
    this.viewResults = 'PROCEDURE:' + selectedProc.orderNumber;
    this.showDetails = true;
    this.selectedProc = selectedProc;
  }
  public deleteResult(imageobs) {
    this.obsResourceService.voidObs(imageobs).subscribe(
      (success) => {
        if (success) {
          this.imageDeleted = false;
          this.deleteStatus = true;
          this.getPatientObs(this.patient.uuid);
          this.imageModal.hide();
          setTimeout(() => {
            this.getProcedureOrders();
          }, 2000);
          this.getProcedureOrders();
        }
      },
      (error) => {
        this.imageDeletedFailed = true;
      }
    );
    setTimeout(() => {
      this.imageDeleted = false;
      this.imageDeletedFailed = false;
      this.imageModal.hide();
      this.getPatientObs(this.patient.uuid);
      this.getProcedureOrders();
    }, 3000);

  }
  public discardOrder(order) {
    this.sendFeedBack();
    const procedureDiscardOrderPayload = {
      patient: this.patient.uuid,
      careSetting: this.caresetting,
      orderer: this.provider,
      encounter: '',
      concept: order.concept.uuid,
      type: 'testorder',
      previousOrder: order.uuid,
      orderReasonNonCoded: 'test done',
      action: 'DISCONTINUE'
    };
    this.saveProcedureOrder(procedureDiscardOrderPayload);
    this.resultsDisplay = false;
  }
  public sendFeedBack() {
    // this.validatePhoneNumberField(this.payload.phone);
    // this.Slackpayload.phone = '0700000000';
    this.Slackpayload.name = 'test Developer';
    // this.userService.getLoggedInUser().person.display;
    const location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject()
        || {};
    this.Slackpayload.location = location.display || 'Default location not set';
    this.Slackpayload.department = 'Oncology';
    this.Slackpayload.message = 'requires rights to delete procedure orders';
    this.subscription = this.feedBackService.postFeedback(this.Slackpayload).pipe(take(1)).subscribe((res) => {
        console.log('this.payload', this.Slackpayload.phone);
        this.Slackpayload = {
            name: '',
            phone: '',
            message: '',
            location: '',
            department: ''
        };
    }, (error) => {
        console.log('Error');
    });
}

}

