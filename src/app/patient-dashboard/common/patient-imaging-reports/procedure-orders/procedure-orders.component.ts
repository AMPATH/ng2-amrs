import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import * as _ from 'lodash';
import * as Moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
import { forkJoin, of, Observable, Subscription } from 'rxjs';

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
  styleUrls: ['./procedure-orders.component.css']
})

export class ProcedureOrdersComponent implements OnInit, OnDestroy {
  @Output() public fileChanged: EventEmitter<any> = new EventEmitter();
  @Input() orderResultsConcept: any;
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
  private _sentData: any;
  private provider: string;
  private patient: any;
  private patientIdentifier: any;
  public loadingProcedureOrderStatus = true;
  public orderSent: any;
  public orderValue: any;
  public display = false;
  public resultsDisplay = false;
  public voidOrderButton = false;
  public resultView = true;
  public imageReportFindings: any;
  public deleteResultsButton = this.procedureOrderService.determineIfUserHasVoidingPrivileges();
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
  public procedures = [];
  public any: string;
  public orders: any;
  public successAlert: any = '';
  public locationUuid: string;
  public locationList = false;
  public locationName: string;
  public submittedProcedureOrder;
  public newProcedure = false;
  public subscriptions: any[] = [];
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
  public obs = [];
  public pdf = /pdf/gi;
  public ObsImages = [];
  public dateReceived: any;
  public imageControlButtons = false;
  public objectNumber = 0;
  public hasRights = false;
  public addRadiologyOrders = false;
  public slackPayload = {
    name: '',
    phone: '',
    message: '',
    location: '',
    department: ''
  };
  public imageLink = '';
  @ViewChild('imageModal')
  public imageModal: ModalDirective;
  public uploadedFiles: string[] = [];

  constructor(
    private patientService: PatientService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private feedBackService: FeedBackService,
    private orderResourceService: OrderResourceService,
    private procedureOrderService: ProcedureOrdersService,
    private encounterResourceService: EncounterResourceService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private fileUploadResourceService: FileUploadResourceService,
    private conceptResourceService: ConceptResourceService,
    private obsResourceService: ObsResourceService,
  ) { }

  public ngOnInit(): void {
    this.setProcedures();
    this.setProvider();
    this.setUserLocation();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  public setProcedures(): void {
    const orderProcedure = this.orderResultsConcept.list;
    this.conceptResourceService.getConceptByUuid(orderProcedure).subscribe((concept) => {
      this.getCurrentlyLoadedPatient();
      this.procedures = concept.setMembers;
      this.proceduresOrdered = true;
    });
  }

  public getCurrentlyLoadedPatient(): void {
    const patientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.getPatientObs(patient.uuid);
        }
      }
    );
    this.subscriptions.push(patientSub);
  }

  public setUserLocation(): void {
    const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    this.locationName = currentLocation.display;
    this.locationUuid = currentLocation.uuid;
  }

  public setProvider(): void {
    const personUuid = this.userService.getLoggedInUser().personUuid;
    this.procedureOrderService.getProviderByPersonUuid(personUuid)
      .subscribe((data) => {
        this.provider = data.providerUuid;
      });
  }

  public _ngDoCheck(): void {
    if (this.sentData.orders !== this.orders) {
      this.getProcedureOrders();
    }
  }

  public getProcedureOrders(): Observable<any[]> {
    const procedureOrders = [];
    const procedureOrderUuid = '53eb4768-1359-11df-a1f1-0026b9348838';
    const orders = this.sentData.orders;
    this.fetchingResults = true;
    this.isBusy = true;
    if (orders.length > 0) {
      this.orders = orders;
      orders.forEach((order) => {
        if (order.orderType.uuid === procedureOrderUuid) {
          for (const results of this.procedures) {
            if (results.uuid === order.concept.uuid && !order.dateStopped) {
              procedureOrders.push(order);
            }
          }
        }
      });
      if (procedureOrders) {
        this.procedureOrders = procedureOrders.reverse();
        this.selectedOrders = this.procedureOrders;
        this.assignOrdersResultsObs(this.selectedOrders);
        this.selectedOrdersWithObs = this.selectedOrders;
        this.fetchingResults = false;
        this.loadingProcedureOrderStatus = false;
        this.isBusy = false;
      } else {
        this.fetchingResults = false;
        this.isBusy = false;
      }
      return of(this.selectedOrders);
    }
  }

  public assignOrdersResultsObs(selectedOrders): void {
    const status = {
      'status': 0,
      'picUrl': [],
      'findings': '',
      'obsUuid': '',
      'date': ''
    };
    // check if procedure has results
    // if so change  results to be viewable and add  edit  ability to actions column
    for (let i = 0; i < selectedOrders.length; i++) {
      selectedOrders[i].status = status;
      this.procedureOrdersWithoutResults = [];
      this.procedureOrdersWithResults = [];
      setTimeout(() => {
        selectedOrders[i].status = this.checkResults(selectedOrders[i].uuid);
        if (selectedOrders[i].status.status === 0) {
          this.procedureOrdersWithoutResults.push(selectedOrders[i]);
        } else if (selectedOrders[i].status.status === 1) {
          this.procedureOrdersWithResults.push(selectedOrders[i]);
        }
        selectedOrders[i].results = this.searchObs(selectedOrders[i].uuid);
        this.filterOrders(selectedOrders);
      }, 200);
    }
  }

  public getPatientObs(patientUuid): void {
    const obsSub = this.obsResourceService.getObsPatientObsByConcept(
      patientUuid, this.orderResultsConcept.results
    )
      .subscribe((result: any) => {
        this.patientObs = result.results;
        this.getProcedureOrders();
      },
        (error) => {
          console.error('An error occurred fetching patient obs: ', error);
        }
      );
    this.subscriptions.push(obsSub);
  }

  private filterOrders(orders): void {
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

  public onOrderStatusChange(status): void {
    if (status === 'NO RESULTS') {
      this.selectedOrders = this.procedureOrdersWithoutResults;
    } else if (status === 'RESULTS AVAILABLE') {
      this.selectedOrders = this.procedureOrdersWithResults;
    } else {
      this.selectedOrders = this.selectedOrdersWithObs;
    }
  }

  private getUniqueNames(originArr): any[] {
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

  public getConcept(concept, type): void {
    const conceptSub = this.conceptResourceService.getConceptByUuid(concept)
      .subscribe((conceptData) => {
        if (type === 'members') {
          const dataIn = conceptData.setMembers;
          const value = this.procedures.concat(dataIn);
          this.procedures = value;
        } else if (type === 'answers') {
          if (conceptData.answers) {
            this.codedAnswers = true;
            this.radiologyConceptAnswers = conceptData.answers;
          } else {
            this.codedAnswers = false;
          }
        }
      });
    this.subscriptions.push(conceptSub);
  }

  public sort(property): void {
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

  public addProcedure(show): void {
    this.proceduresOrdered = false;
    this.displayNew = show;
    this.addOrders = true;
    this.procedure = this.procedures[0].uuid;
    this.header = 'New ' + this.orderResultsConcept.name + ' report';
    this.proceduresOrdered = true;
  }

  public dismissDialog(): void {
    this.display = false;
    this.displayRenew = false;
    this.resultsDisplay = false;
    this.displayAddResults = false;
    this.displayNew = false;
    this.displayResultsChange = false;
  }

  public saveOrder(): void {
    const procedureOrderPayload = this.createPayload();
    this.saveProcedureOrder(procedureOrderPayload);
    setTimeout(() => {
      this.getPatientObs(this.patient.uuid);
    }, 200);
    this.defaultView();
  }

  public createPayload(): any {
    let procedureOrderPayload: any;

    if (!this.procedure) {
      this.errors.push({
        message: 'Error creating payload. Please select a procedure first.'
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

  private displaySuccessAlert(): void {
    this.imageSaved = true;
    setTimeout(() => {
      this.imageSaved = false;
    }, 3000);
  }

  public checkResults(orderNumber): any {
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
  public searchObs(orderNumber): any {
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

  public checkValue(value: any, orderUuid): any {
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

  public assignValue(data): any {
    let resultsData: any;
    resultsData = {
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
        if (value[b].concept.uuid === this.orderResultsConcept.imageConcept) {
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

  public showResults(order): void {
    this.header2 = order.orderNumber;
    this.imageLink = `${order.status.picUrl}`;
    this.dateReceived = order.status.date;
    this.ObsImages = order.results.imageUrl.reverse();
    this.selectedProc = order;
    if (this.ObsImages.length > 1) {
      this.imageControlButtons = true;
    }
    this.imageModal.show();
  }

  // actions done on individual procedures.

  public saveProcedureOrder(procedureOrderPayload): void {
    const encounterPayload = {
      patient: this.patient.uuid,
      encounterType: '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
      // encounterType: '6a664732-560c-4ad4-ac38-b59ebe330897',
      location: this.locationUuid,
      encounterProviders: [{
        provider: this.provider,
        encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66'
      }]
    };

    if (this.error) {
      this.error = 'There was an error getting creating the ' + this.orderResultsConcept.name + ' order';
    } else {
      const encounterSub = this.encounterResourceService.saveEncounter(encounterPayload)
        .subscribe((encounter: any) => {
          if (encounter) {
            procedureOrderPayload.encounter = encounter.uuid;
            const orderSub = this.orderResourceService.saveProcedureOrder(procedureOrderPayload)
              .subscribe((res) => {
                this.submittedProcedureOrder = res;
                this.changeDetectorRef.detectChanges();
                this.newProcedure = true;
                this.sentData.orders.push(this.submittedProcedureOrder);
                this.getPatientObs(this.patient.uuid);
                this.message = 'Order successfully created';
                setTimeout(() => {
                  this.message = '';
                }, 500);
                this.display = false;
                this.newProcedure = false;
                this.subscriptions.push(orderSub);
              });
          } else {
            this.error = 'Error creating encounter';
          }
        });
      this.subscriptions.push(encounterSub);
    }
  }

  public uploadFile(event): void {
    _.each(event, (file) => {
      this.uploadedFiles.push(file.name);
    });
    this.files = true;
    this.dataPayload = {
      file: event,
      orderNumber: this.orderNumber,
      concept: this.selectedProcedureTests.uuid,
      findings: '',
      imageLink: [],
      reportType: this.orderResultsConcept.report
    };
  }

  public changeResults(order): void {
    this.proceduresOrdered = false;
    this.displayEditRequest = true;
    this.header = 'Change Procedure Results';
    this.orderValue = order;
    this.orderNumber = order.orderNumber;
    this.obs = order.results;
    this.displayResultsChange = true;
  }

  public approveEdit(): void {
    this.displayResultsChange = false;
    this.displayEditRequest = false;
  }

  public onFileChangeResults(file, action, orderNumber): void {
    const uploadBatch: Array<Observable<any>> = [];
    for (const data of file) {
      uploadBatch.push(this.fileUploadResourceService.upload(data));
    }
    forkJoin(uploadBatch).subscribe((value) => {
      const imageLink = JSON.stringify(value);
    });
  }

  public showOrder(order): void {
    this.proceduresOrdered = false;
    this.resultView = true;
    this.voidOrderButton = true;
    this.resultsDisplay = true;
    this.viewResults = this.titleize(this.orderResultsConcept.name) + ' order: ' + order.orderNumber;
    this.showDetails = true;
    this.selectedProc = order;
  }

  public defaultView(): void {
    this.resultsDisplay = false;
    this.proceduresOrdered = true;
    this.addOrders = false;
    this.imageReportFindings = '';
    this.files = false;
    this.enterReportResults = false;
    this.displayResultsChange = false;
  }

  public discard(selectedProc): void {
    this.resultView = false;
    if (this.procedureOrderService.determineIfUserHasVoidingPrivileges() === true) {
      this.hasRights = true;
      this.resultsDisplay = true;
      this.viewResults = this.orderResultsConcept.name + ':' + selectedProc.orderNumber;
      this.showDetails = true;
      this.selectedProc = selectedProc;
    }
  }

  public deleteResult(imageobs, image): void {
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
          this.message = 'Result deleted succesfully';
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
        const answ = JSON.stringify(value);
        console.log(answ);
      });
      console.log(imageobs);
    }
    console.log(this.selectedProc);
  }

  public discardOrder(order): void {
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

  public sendFeedBack(): void {
    this.slackPayload.name = this.userService.getLoggedInUser().person.display;
    const location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject()
      || {};
    this.slackPayload.location = location.display || 'Default location not set';
    this.slackPayload.department = 'Oncology';
    this.slackPayload.message = 'Automated message: This user requires elevated privileges to be able to void '
      + this.orderResultsConcept.name + ' orders';
    this.subscription = this.feedBackService.postFeedback(this.slackPayload).pipe(take(1)).subscribe((res) => {
      this.slackPayload = {
        name: '',
        phone: '',
        message: '',
        location: '',
        department: ''
      };
    }, (error) => {
      console.error('Error sending user feedback: ', error);
    });
  }

  public enterResults(order): void {
    this.proceduresOrdered = false;
    this.enterReportResults = true;
    this.addOrders = false;
    this.resultsDisplay = false;
    this.resultView = false;
    this.selectedProcedureTests = order.concept;
    this.orderNumber = order.orderNumber;
    this.getConcept(this.selectedProcedureTests.uuid, 'answers');
  }

  public sendResults(): void {
    this.dataPayload.findings = this.imageReportFindings;
    this.onFileChange(this.dataPayload);
    this.defaultView();
    this.codedAnswers = false;
    this.imageReportFindings = '';
  }

  public onFileChange(incomingData): void {
    const fileData = incomingData.file;
    const uploadBatch: Array<Observable<any>> = [];
    for (const data of fileData) {
      uploadBatch.push(this.fileUploadResourceService.upload(data));
    }
    forkJoin(uploadBatch).subscribe((value) => {
      incomingData.imageLink = JSON.stringify(value);
      this.determineObsPayload(incomingData);
    });
  }

  public determineObsPayload(data): void {
    this.obsPayload = {
      obsDatetime: this.toDateString(new Date()),
      encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
      location: this.locationUuid,
      concept: '',
      person: this.patient.uuid,
      order: data.orderNumber,
      groupMembers: ''
    };
    if (data.reportType === this.orderResultsConcept.report) {
      // save parent obs and get obsgroup id
      this.obsPayload.order = data.orderNumber;
      this.obsPayload.concept = this.orderResultsConcept.results;
      this.obsPayload.groupMembers = [
        {
          concept: this.orderResultsConcept.imageConcept,
          value: data.imageLink,
          obsDatetime: this.toDateString(new Date()),
          encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
          location: this.locationUuid,
          person: this.patient.uuid,
        },
        {
          concept: 'a8a06fc6-1350-11df-a1f1-0026b9348838',
          value: data.findings,
          obsDatetime: this.toDateString(new Date()),
          encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
          location: this.locationUuid,
          person: this.patient.uuid,
        },
      ];
      this.saveObs(this.obsPayload);
    } else if (data.reportType === this.orderResultsConcept.report) {
      this.obsPayload.order = data.orderNumber;
      this.obsPayload.concept = this.orderResultsConcept.results;
      this.obsPayload.groupMembers = [
        {
          concept: 'bce26e1c-c65e-443a-b65f-118f699e1bd0',
          value: data.imageLink,
          obsDatetime: this.toDateString(new Date()),
          encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
          location: this.locationUuid,
          person: this.patient.uuid,
        },
        {
          // concept: data.concept,
          concept: '312810e7-03b4-481d-bbdd-24919478dbb5',
          value: data.findings,
          obsDatetime: this.toDateString(new Date()),
          encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
          location: this.locationUuid,
          person: this.patient.uuid,
        }
      ];
      this.saveObs(this.obsPayload);
    } else if (data.reportType === this.orderResultsConcept.report) {
      this.obsPayload.order = data.orderNumber;
      this.obsPayload.concept = this.orderResultsConcept.results;
      this.obsPayload.groupMembers = [
        {
          concept: this.orderResultsConcept.imageConcept,
          value: data.imageLink,
          obsDatetime: this.toDateString(new Date()),
          encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
          location: this.locationUuid,
          person: this.patient.uuid,
        },
        {
          concept: 'a8a06fc6-1350-11df-a1f1-0026b9348838',
          value: data.findings,
          obsDatetime: this.toDateString(new Date()),
          encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
          location: this.locationUuid,
          person: this.patient.uuid,
        }
      ];
      this.saveObs(this.obsPayload);
    } else if (data.reportType === this.orderResultsConcept.report) {
      // save parent obs and get obsgroup id
      this.obsPayload.order = data.orderNumber;
      this.obsPayload.concept = this.orderResultsConcept.results;
      this.obsPayload.groupMembers = [
        {
          concept: this.orderResultsConcept.imageConcept,
          value: data.imageLink,
          obsDatetime: this.toDateString(new Date()),
          encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
          location: this.locationUuid,
          person: this.patient.uuid,
        },
        {
          concept: 'a8a06fc6-1350-11df-a1f1-0026b9348838',
          value: data.findings,
          obsDatetime: this.toDateString(new Date()),
          encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
          location: this.locationUuid,
          person: this.patient.uuid,
        }
      ];
      this.saveObs(this.obsPayload);
    }
    // this.displaySuccessAlert();
  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

  public saveObs(obsPayload): any {
    let response: any;
    this.obsResourceService.saveObs(obsPayload).pipe(take(1)).subscribe(
      (success) => {
        if (success) {
          this.message = this.orderResultsConcept.name + 'results saved successfully';
          this.getPatientObs(this.patient.uuid);
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
        this.error = 'Results Cannot Be Saved!';
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    );
    return this.obsGroup;
  }

  private titleize(str): string {
    return str.replace(/\w\S*/g, s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase());
  }
}
