import { Component, OnInit, ViewChild, Input, forwardRef, DoCheck, Output, EventEmitter, ChangeDetectorRef, ɵConsole } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
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
import { jsonpCallbackContext } from '@angular/common/http/src/module';



@Component({
  selector: 'app-procedure-orders',
  templateUrl: './procedure-orders.component.html',
  styleUrls: ['./procedure-orders.component.css'],

})
export class ProcedureOrdersComponent implements OnInit {
  private _sentData: any;
  @Input() OrderResultsConcept: any;
  @Input()
  set sentData(value: any) {
    this.proceduresOrdered = false;
    if (value && value.orders) {
      this._sentData = value;
    }
  }

  get sentData(): any {
    return this._sentData;
  }
  @Output() public fileChanged: EventEmitter<any> = new EventEmitter();
  public procedureOrders = [];
  public procedureOrdersWithResults = [];
  public procedureOrdersWithoutResults = [];
  public selectedOrders = [];
  public selectedOrdersWithObs = [];
  public orderStatus = [];
  public reviseOrders;
  public error: string;
  public selectedOrderStatus: string;
  public fetchingResults: boolean;
  public isBusy: boolean;
  public caresetting = '6f0c9a92-6f24-11e3-af88-005056821db0';
  public subscription: Subscription;
  public enterReportResults = false;
  public addOrders = false;
  public addOrderSet = false;
  public searchText: string;
  public column: string;
  public isDesc = false;
  public drug: string;
  public previousOrder: string;
  public concept: string;
  public obsPayload: any;
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
  public imageReportFindings: any;
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
  public message: string;
  public header2: string;
  public viewResults: string;
  public status = false;
  public showSuccessAlert = false;
  public codedAnswers = false;
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
  private procedure: any;
  public proceduresOrdered = true;
  public displayEditRequest = false;
  public procedureList = false;
  public procedureName: string;
  public imageServerId: any;
  public imageText: string;
  public files = false;
  public radiologyConceptAnswers = [];
  public selectedProcedureTests: any;
  public dataPayload: any;
  public imageStatusValue: any;
  public patientObs: any;
  public patientObsWithOrders: any;
  public selectedProc: any;
  public orderNumber: string;
  public obsGroup: any;
  public procedureConceptList = [];
  public obs = [];
  public pdf = /pdf/gi;
  public ObsImages = [];
  public dateRecieved: any;
  public imageControlButtons = false;
  public objectNumber = 0;
  public hasRights = false;
  public addRadiologyOrders = false;
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
    private changeDetectorRef: ChangeDetectorRef,
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
    this.getProcedures();
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
        }
      }
    );
  }
  public getProvider() {
    this.ProcedureOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.provider = data.providerUuid;
    });
  }
  public _ngDoCheck() {
    if (this.sentData.orders !== this.orders) {
      this.getProcedureOrders();
    }
  }
  public getProcedureOrders() {
    this.fetchingResults = true;
    const procedures = [];
    this.isBusy = true;
    const data = this.sentData.orders;
    if (data === '') {
    } else {
      this.orders = data;
      data.forEach((value) => {
        if (value.orderType.uuid === '53eb4768-1359-11df-a1f1-0026b9348838') {
          this.procedureConceptList = this.proc;
          for (const results of this.procedureConceptList) {
            if (results.uuid === value.concept.uuid) {
              if (!value.dateStopped) {
                procedures.push(value);
              }
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
      'picUrl': [],
      'findings': '',
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
    this.obsResourceService.getObsPatientObsByConcept(patientUuid, this.OrderResultsConcept.results).subscribe((result: any) => {
      this.patientObs = result.results;
      this.getProcedureOrders();
    },
      (error) => {
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
    const orderProcdure = this.OrderResultsConcept.list;
    this.conceptResourceService.getConceptByUuid(orderProcdure).subscribe((data) => {
      this.proc = data.setMembers;
      this.getCurrentlyLoadedPatient();
      this.personUuid = this.userService.getLoggedInUser().personUuid;
      this.getProvider();
      const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
      this.location = currentLocation.display;
      this.selectedLocation = currentLocation.uuid;
      this.currentDate = Date.now();
      this.proceduresOrdered = true;

    });
  }
  public  getConcept(concept, type) {
    this.conceptResourceService.getConceptByUuid(concept).subscribe((dataFound) => {
      if (type === 'members') {
        const dataIn = dataFound.setMembers;
        const value = this.proc.concat(dataIn);
          this.proc = value;
          console.log(this.proc);

      } else if (type === 'answers') {
        if (dataFound.answers) {
          this.codedAnswers = true;
          this.radiologyConceptAnswers = dataFound.answers;
        } else {
          console.log(this.OrderResultsConcept);
          this.codedAnswers = false;
        }
      }

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

  public addProc(show) {
    this.proceduresOrdered = false;
    this.displayNew = show;
    this.addOrders = true;
    this.procedure = this.proc[0].uuid;
    this.header = 'New' + this.OrderResultsConcept.name + 'Order';
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
    setTimeout(() => {
      this.getPatientObs(this.patient.uuid);
    }, 200);
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

  // public onFileChange(file, orderNumber) {
  //   this.fileUploadResourceService.upload(file).subscribe((result: any) => {
  //     this.imageServerId = result.image;
  //     const obsPayload = {
  //       obsDatetime: this.toDateString(new Date()),
  //       encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
  //       location: this.selectedLocation,
  //       concept: '9ab23532-40e4-4e98-85bd-bb9478d805ac',
  //       person: this.patient.uuid,
  //       value: this.imageServerId,
  //       order: orderNumber
  //     };
  //     this.displaySuccessAlert();
  //     this.saveObs(obsPayload);
  //     // image on ocr
  //   });

  // }
  private displaySuccessAlert() {
    this.imageSaved = true;
    setTimeout(() => {
      this.imageSaved = false;
    }, 3000);
  }

  public checkResults(orderNumber) {
    const patientObs: any = this.patientObs;
    let status = {
      'status': 0,
      'picUrl': [],
      'findings': '',
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
    let obsUuid: any;
    for (const value of patientObs) {
      const checkstatus = this.checkValue(value, orderNumber);
      if (checkstatus.status === 1) {
        const imageObs = {
          'obs': checkstatus.obsUuid,
          'imageUrl': checkstatus.picUrl
        };
        obsUuid = imageObs;
      } else {
      }
    }


    return obsUuid;


  }
  checkValue(value: any, orderUuid) {
    let imageStatus = {
      'status': 0,
      'picUrl': [],
      'obsUuid': '',
      'findings': '',
      'date': ''
    };
    if (value.order) {
      if (value.order.uuid === orderUuid) {
        imageStatus = this.assignValue(value);
      } else {
        imageStatus = {
          'status': 0,
          'picUrl': [],
          'findings': '',
          'obsUuid': '',
          'date': ''

        };
      }
    } else {
      imageStatus = {
        'status': 0,
        'picUrl': [],
        'findings': '',
        'obsUuid': '',
        'date': ''
      };
    }
    return imageStatus;
  }
  public assignValue(data) {

    // tslint:disable-next-line:prefer-const
    let resultsData = {
      'status': 0,
      'picUrl': [],
      'obsUuid': '',
      'findings': '',
      'date': ''
    };
    resultsData.date = data.obsDatetime;
    resultsData.obsUuid = data.uuid;
    const value = data.groupMembers;
    for (let b = 0; b < value.length; b++) {
      if (value) {
        if (value[b].concept.uuid === this.OrderResultsConcept.imageConcept) {
          const valData = JSON.parse(value[b].value);
          valData.forEach(element => {
            const answ = element.image;
            const dataVal = {
              image: '',
              type: ''

            };
            if (answ.search(this.pdf) !== -1) {
              this.fileUploadResourceService.getFile(answ, 'pdf').subscribe((file) => {
                  dataVal.image = file.changingThisBreaksApplicationSecurity;
                  dataVal.type = 'pdf';
                  console.log(dataVal);
               });
            } else {
              dataVal.type = 'image';
              dataVal.image = answ;
            }
            resultsData.picUrl.push(dataVal);
          });
          resultsData.status = 1;
        } else {
          resultsData.findings = value[b].value;
        }
      }
    }
    return resultsData;
  }
  public showResults(order) {
    this.header2 = order.orderNumber;
    this.imageLink = `${order.status.picUrl}`;
    this.dateRecieved = order.status.date;
    this.ObsImages = order.results.imageUrl.reverse();
    this.selectedProc  = order;
    if (this.ObsImages.length > 1) {
      this.imageControlButtons = true;
    }
    this.imageModal.show();

  }
  // actions done on individual procedures.


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
            this.changeDetectorRef.detectChanges();
            this.newProcedure = true;
            this.sentData.orders.push(this.submittedProcedureOrder);
            this.getPatientObs(this.patient.uuid);
            this.message = 'Order made Succesfully';
            setTimeout(() => {
              this.message = '';
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
  public uploadFile(event) {
    this.files = true;
    this.dataPayload = {
      file: event,
      orderNumber: this.orderNumber,
      concept: this.selectedProcedureTests.uuid,
      findings: '',
      imageLink: [],
      reportType: this.OrderResultsConcept.report

    };
  }
  public changeResults(order) {
    this.proceduresOrdered = false;
    this.displayEditRequest = true;
    this.header = 'Change Procedure Results';
    this.orderValue = order;
    this.orderNumber = order.orderNumber;
    this.obs = order.results;
    this.displayResultsChange = true;
  }
  public approveEdit() {
    this.displayResultsChange = false;
    this.displayEditRequest = false;
  }
  public onFileChangeResults(file, action, orderNumber) {
    console.log('test');
    const uploadBatch: Array<Observable<any>> = [];
    for (const data of file) {
      uploadBatch.push(this.fileUploadResourceService.upload(data));
    }
       forkJoin(uploadBatch).subscribe((value) => {
                 console.log(value);
     const imageLink = JSON.stringify(value);
      console.log(imageLink);
    });

    //   if (!this.orderNumber) {
    //     this.orderValue = orderNumber;
    //   }
    //   const obsPayload = {
    //     obsDatetime: this.toDateString(new Date()),
    //     encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
    //     location: this.selectedLocation,
    //     concept: this.OrderResultsConcept.imageConcept,
    //     person: this.patient.uuid,
    //     value: this.imageServerId,
    //     order: this.orderValue.orderNumber || orderNumber
    //   };

    //   this.saveObs(obsPayload);
    //   if (action === true) {
    //     for (let i = 0; i < this.obs.length; i++) {
    //       this.deleteResult(this.obs[i].obs);
    //     }
    //   } else {
    //     this.imageModal.hide();
    //   }
    // this.getPatientObs(this.patient.uuid);
    // this.getProcedureOrders();
    // setTimeout(() => {
    //   this.dismissDialog();
    // }, 3000);
  }
  public showOrder(order) {
    this.proceduresOrdered = false;
    this.resultView = true;
    this.voidOrderButton = true;
    this.resultsDisplay = true;
    this.viewResults = this.OrderResultsConcept.name + ':' + order.orderNumber;
    this.showDetails = true;
    this.selectedProc = order;
  }
  public defaultView() {
    this.resultsDisplay = false;
    this.proceduresOrdered = true;
    this.addOrders = false;
    this.imageReportFindings = '';
    this.enterReportResults = false;
    this.displayResultsChange = false;
  }
  public discard(selectedProc) {
    this.resultView = false;
    if (this.ProcedureOrderService.checkProcedureandResultDeletingRights() === true) {
      this.hasRights = true;
      this.resultsDisplay = true;
      this.viewResults = this.OrderResultsConcept.name + ':' + selectedProc.orderNumber;
      this.showDetails = true;
      this.selectedProc = selectedProc;
    }

  }
  public deleteResult(imageobs, image) {
    const uploadBatch: Array<Observable<any>> = [];
    console.log(imageobs);
    imageobs.forEach((element, index, object) => {
      if (element === image) {
        object.splice(index, 1);
      } else {
      }
    });
    if (imageobs.length === 0) {
      this.obsResourceService.voidObs(this.selectedProc.results.obs).subscribe(
        (success) => {
          this.message = 'Result deleted Succesfully';
            this.imageModal.hide();
            this.getPatientObs(this.patient.uuid);
        }
      );
    } else {
      const test = imageobs;
      imageobs.forEach(element => {
        delete element.type;
        uploadBatch.push(element);
      });
      // forkJoin(imageobs)
      forkJoin(uploadBatch).subscribe((value) => {
       const answ  = JSON.stringify(value);
        console.log(answ);
      });
        console.log(imageobs);
    }
    console.log(this.selectedProc);

  }
  public discardOrder(order) {
    if (!this.hasRights) {
      this.sendFeedBack();
    } else {
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
      this.proceduresOrdered = true;
    }
  }
  public sendFeedBack() {
    this.Slackpayload.name = this.userService.getLoggedInUser().person.display;
    const location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject()
      || {};
    this.Slackpayload.location = location.display || 'Default location not set';
    this.Slackpayload.department = 'Oncology';
    this.Slackpayload.message = 'requires rights to delete' + this.OrderResultsConcept.name + 'orders';
    this.subscription = this.feedBackService.postFeedback(this.Slackpayload).pipe(take(1)).subscribe((res) => {
      this.Slackpayload = {
        name: '',
        phone: '',
        message: '',
        location: '',
        department: ''
      };
    }, (error) => {
    });
  }
  public enterResults(order) {
    this.proceduresOrdered = false;
    this.enterReportResults = true;
    this.resultsDisplay = false;
    this.resultView = false;
    this.selectedProcedureTests = order.concept;
    this.orderNumber = order.orderNumber;
    this.getConcept(this.selectedProcedureTests.uuid, 'answers');

  }
  public sendResults() {

    this.dataPayload.findings = this.imageReportFindings;
    this.onFileChange(this.dataPayload);
    this.defaultView();
    this.codedAnswers = false;
    this.imageReportFindings = '';
    // this.getPatientObs(this.patient.uuid);
  }
  public onFileChange(incomingData) {
    const fileData = incomingData.file;
    const uploadBatch: Array<Observable<any>> = [];
    for (const data of fileData) {
      uploadBatch.push(this.fileUploadResourceService.upload(data));
    }
    forkJoin(uploadBatch).subscribe((value) => {
      incomingData.imageLink = JSON.stringify(value);
      console.log(incomingData.imageLink);
      this.determineObsPayload(incomingData);
    });

  }

  public determineObsPayload(data) {
    this.obsPayload = {
      obsDatetime: this.toDateString(new Date()),
      encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
      location: this.selectedLocation,
      concept: '',
      person: this.patient.uuid,
      order: data.orderNumber,
      groupMembers: ''
    };
    if (data.reportType === this.OrderResultsConcept.report) {
      // save parent obs and get obsgroup id
      this.obsPayload.order = data.orderNumber;
      this.obsPayload.concept = this.OrderResultsConcept.results;
      this.obsPayload.groupMembers = [
      {
        concept: this.OrderResultsConcept.imageConcept,
        value: data.imageLink,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      {
        concept: 'a8a06fc6-1350-11df-a1f1-0026b9348838',
        value: data.findings,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      ];
      this.saveObs(this.obsPayload, 'surgery');


    } else if (data.reportType === this.OrderResultsConcept.report) {
      this.obsPayload.order = data.orderNumber;
      this.obsPayload.concept = this.OrderResultsConcept.results;
      this.obsPayload.groupMembers = [{
        concept: 'bce26e1c-c65e-443a-b65f-118f699e1bd0',
        value: data.imageLink,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      {
        // concept: data.concept,
        concept: '312810e7-03b4-481d-bbdd-24919478dbb5',
        value: data.findings,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      ];
      this.saveObs(this.obsPayload, 'imaging');
    } else if (data.reportType === this.OrderResultsConcept.report) {
      this.obsPayload.order = data.orderNumber;
      this.obsPayload.concept = this.OrderResultsConcept.results;
      this.obsPayload.groupMembers = [{
        concept: this.OrderResultsConcept.imageConcept,
        value: data.imageLink,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      {
        concept: 'a8a06fc6-1350-11df-a1f1-0026b9348838',
        value: data.findings,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      ];
      this.saveObs(this.obsPayload, 'procedure');
    } else if (data.reportType === this.OrderResultsConcept.report) {
      // save parent obs and get obsgroup id
      this.obsPayload.order = data.orderNumber;
      this.obsPayload.concept = this.OrderResultsConcept.results;
      this.obsPayload.groupMembers = [{
        concept: this.OrderResultsConcept.imageConcept,
        value: data.imageLink,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      {
        concept: 'a8a06fc6-1350-11df-a1f1-0026b9348838',
        value: data.findings,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      ];
      this.saveObs(this.obsPayload, 'histology');


    }
    // this.displaySuccessAlert();
  }


  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }
  public saveObs(obsPayload, type) {
    let response: any;
    this.obsResourceService.saveObs(obsPayload).pipe(take(1)).subscribe(
      (success) => {
        if (success) {
          if (type === 'histology') {
            this.message = 'Histology Report saved';
          } else if (type === 'surgery') {
            this.message = 'Surgery Report saved';
          } else if (type === 'procedure') {
            this.message = 'Procedure Results Entered Successfully';
          } else if (type === 'imaging') {
            this.message = 'Radiology Imaging Results Entered Successfully';
          }
          this.getPatientObs(this.patient.uuid);
          // this.uploadingResults = true;
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
        response = success;
        if (!this.obsGroup) {
          this.obsGroup = response.uuid;
          this.obsPayload.obsGroup = response.uuid;
        }
      },
      (error) => {
        this.error = error.error.error.message + ': Results Cannot Be Saved!';
      }
    );
    return this.obsGroup;

  }

}

