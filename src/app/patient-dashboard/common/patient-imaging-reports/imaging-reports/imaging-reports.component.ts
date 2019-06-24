import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProcedureOrdersService } from '../procedure-orders/procedure-orders.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { Subscription, Observable } from 'rxjs';
import * as _ from 'lodash';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-imaging-reports',
  templateUrl: './imaging-reports.component.html',
  styleUrls: ['./imaging-reports.component.css']
})
export class ImagingReportsComponent implements OnInit {
  @Input() public sentData: any;
  @Output() public fileChanged: EventEmitter<any> = new EventEmitter();
  myForm: FormGroup;
  public patient: any;
  public radiologyTypeMembers: any;
  public pdf = /pdf/gi;
  public typeSelect = true;
  public radiologySelected = false;
  public selectedRadioloyTests: any;
  public multipleSelected = false;
  public provider: any;
  public imageReportFindings: any;
  public files = false;
  public enterResults = true;
  public radiologyOrdersConceptList = [];
  private patientIdentifer: any;
  private personUuid: string;
  public radiologyConcept: string;
  public orderNumber: string;
  public imageControlButtons = false;
  @ViewChild('imageModal')
  public imageModal: ModalDirective;
  public dateRecieved: any;
  public enterReportResults = false;
  public ObsImages = [];
  public showDetails = false;
  public selectedRad: any;
  public viewResults: string;
  public resultsDisplay = false;
  public voidOrderButton = false;
  public resultView = true;
  imageLink = '';
  public radiologyOrdered = true;
  public subscription: Subscription;
  public radiologyConcepts: any;
  public selectedOrders = [];
  public radiologyOrdersWithResults = [];
  public radiologyOrdersWithoutResults = [];
  public radiologyOrders = [];
  public radiologySetMembers = [];
  public radiologyConceptAnswers = [];
  public caresetting = '6f0c9a92-6f24-11e3-af88-005056821db0';
  public error: any;
  public patientObs: any;
  public addRadiologyOrders = false;
  public resultAvailable = false;
  public orders: any;
  public showFileUploader = false;
  public dataPayload: any;

  constructor(private fb: FormBuilder,
    private ProcedureOrderService: ProcedureOrdersService,
    private patientService: PatientService,
    private userService: UserService,
    private encounterResourceService: EncounterResourceService,
    private obsResourceService: ObsResourceService,
    private conceptResourceService: ConceptResourceService,
    private orderResourceService: OrderResourceService) { }

  ngOnInit() {
    this._formValidate();
    this.getRadiologyOrders();
    this.getCurrentlyLoadedPatient();
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    console.log(this.sentData);
    // this.patient = this.sentData.patient.uuid;
    this.caresetting = this.sentData.caresetting;
    // this.getProvider(this.sentData.personUuid);
    this.getProvider();
    // this.getImagingOrders(this.sentData.p);
  }
  public getProvider() {
    this.ProcedureOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.provider = data.providerUuid;
    });
  }
  public getPatientObs(patientUuid) {
    const OrderResultsConcept = 'c0f0477f-0552-42e2-862f-cf924d4e21e7';
    this.obsResourceService.getObsPatientObsByConcept(patientUuid, OrderResultsConcept).subscribe((result: any) => {
      this.patientObs = result.results;
      console.log(this.patientObs);
    },
      (error) => {
        console.error('error', error);
      });
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
          this.getImagingOrders();
        }
      }
    );
  }
  private getRadiologyOrders() {
    const Radiology = '8a93e5c1-b374-445d-8f1f-78364bd2108c';
    this.conceptResourceService.getConceptByUuid(Radiology).subscribe((data) => {
      this.radiologyConcepts = data.setMembers;
      console.log(this.radiologyConcepts);
      for (const results of this.radiologyConcepts) {
        this.getConcept(results.uuid, 'members');
      }
      console.log(this.radiologySetMembers);

    });
  }
  public getConcept(concept, type) {
    this.conceptResourceService.getConceptByUuid(concept).subscribe((dataFound) => {
      if (type === 'members') {
        const dataIn = dataFound.setMembers;
        const value = this.radiologySetMembers.concat(dataIn);
          this.radiologySetMembers = value;
          console.log(this.radiologySetMembers);

      } else if (type === 'answers') {
        this.radiologyConceptAnswers = dataFound.answers;
        console.log(this.radiologyConceptAnswers);
      }

    });
  }
  public getImagingOrders() {
    const radiologyOrders = [];
    console.log('done');
    this.orderResourceService.getAllOrdersByPatientUuuid(this.patient.uuid, this.caresetting)
      .subscribe((data) => {
        console.log('done1', data);
        const orders = data.results;
        orders.forEach((value) => {
          if (value.orderType.uuid === '53eb4768-1359-11df-a1f1-0026b9348838') {
            this.radiologyOrdersConceptList = this.radiologySetMembers;
            for (const results of this.radiologyOrdersConceptList) {
              if (results.uuid === value.concept.uuid && !value.dateStopped) {
                radiologyOrders.push(value);
              }
            }
          }
        });
        if (radiologyOrders) {
          this.radiologyOrders = radiologyOrders.reverse();
          this.selectedOrders = this.radiologyOrders;
          console.log(this.selectedOrders);
          this.assignOrdersResultsObs();
          //  this.selectedOrdersWithObs = this.selectedOrders;
          //  this.fetchingResults = false;
          //  this.loadingProcedureOrderStatus = false;
          //  this.isBusy = false;
        }
        return Observable.of(this.selectedOrders);
      });
  }
  public assignOrdersResultsObs() {
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
      this.radiologyOrdersWithoutResults = [];
      this.radiologyOrdersWithResults = [];
      setTimeout(() => {
        this.selectedOrders[i].status = this.checkResults(this.selectedOrders[i].uuid);
        if (this.selectedOrders[i].status.status === 0) {
          this.radiologyOrdersWithoutResults.push(this.selectedOrders[i]);
        } else if (this.selectedOrders[i].status.status === 1) {
          this.radiologyOrdersWithResults.push(this.selectedOrders[i]);
        }
        this.selectedOrders[i].results = this.searchObs(this.selectedOrders[i].uuid);
        // this.filterOrders(this.selectedOrders);
      }, 200);
    }
    console.log( this.selectedOrders);
  }
  public checkResults(orderNumber) {
    const patientObs: any = this.patientObs;
    let status = {
      'status': 0,
      'picUrl': [],
      'obsUuid': '',
      'findings': '',
      'date': ''
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
  checkValue(value: any, orderNumber) {
    let imageStatus = {
      'status': 0,
      'picUrl': [],
      'obsUuid': '',
      'findings': '',
      'date': ''
    };
    if (value.order) {
      if (value.order.uuid === orderNumber) {
        imageStatus = this.assignValue(value);
      } else {
        imageStatus = {
          'status': 0,
          'picUrl': [],
          'obsUuid': '',
          'findings': '',
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
      if (value[b].concept.uuid === 'bce26e1c-c65e-443a-b65f-118f699e1bd0') {
        const valData = JSON.parse(value[b].value);
        valData.forEach(element => {
          const answ = element.image;
          const dataVal = {
            image: answ,
            type: ''

          };
          if (answ.search(this.pdf) !== -1) {
            dataVal.type = 'pdf';
           } else {
            dataVal.type = 'image';
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
  _formValidate() {
    // Here we have used a form builder and an array to allow for multiple validation rules on a form.
    this.myForm = this.fb.group(
      {
        radiologyTypes: ['', Validators.compose([Validators.required])],
      },
      {
      }
    );
  }
  _formSubmit() {
    if (this.myForm.invalid) {
      return;
    }
    this.radiologySelected = true;
    this.typeSelect = false;
    this.radiologyTypeMembers = this.myForm.getRawValue().radiologyTypes;
    console.log(this.myForm.getRawValue());
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify());
  }
  public selectedRadiologyType(radiologyType) {
    this.selectedRadioloyTests = radiologyType;
    console.log('selectedRadioloyTests ', this.selectedRadioloyTests);
  }
  public resultsAvailable() {
    this.resultAvailable = true;
    this.radiologySelected = false;
    this.typeSelect = false;
    this.showFileUploader = true;
    this.getConcept(this.selectedRadioloyTests.uuid, 'answers');
    this.saveOrder();
  }

  public processValues() {
    this.saveOrder();
    this.selectedRadioloyTests = '';
    this.defaultView();
  }
  public uploadFile(event) {
    this.files = true;
    this.dataPayload = {
      file: event,
      orderNumber: this.orderNumber,
      concept: this.selectedRadioloyTests.uuid,
      imageLink: [],
      findings: '',
      reportType: 'imaging report'

    };
  }
  public sendResults() {
    this.dataPayload.findings = this.imageReportFindings.uuid;
    this.fileChanged.emit(this.dataPayload);
    this.defaultView();
  }
  public saveOrder() {
    const RadiologyOrderPayload = this.createPayload();
    this.saveRadiologyOrder(RadiologyOrderPayload);
  }
  public createPayload() {
    let radiologyOrderPayload;

    radiologyOrderPayload = {
      patient: this.patient.uuid,
      careSetting: this.caresetting,
      orderer: this.provider,
      encounter: '',
      concept: this.selectedRadioloyTests.uuid,
      type: 'testorder'
    };
    return radiologyOrderPayload;
  }
  public saveRadiologyOrder(procedureOrderPayload) {
    const encounterPayLoad = {
      patient: this.patient.uuid,
      encounterType: '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
      location: this.sentData.location,
      encounterProviders: [{
        provider: this.provider,
        encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66'
      }]
    };

    if (this.error) {
      this.error = 'There was an error getting creating the Radiology Order';
    } else {

      this.encounterResourceService.saveEncounter(encounterPayLoad).subscribe((response: any) => {
        if (response) {
          procedureOrderPayload.encounter = response.uuid;
          this.orderResourceService.saveProcedureOrder(procedureOrderPayload).subscribe((res: any) => {
            const data = res;
            this.orderNumber = data.orderNumber;
            console.log(res);
          });
        } else {
          this.error = 'Error creating Encounter';
        }
      });
    }
  }
  public defaultView() {
    this.addRadiologyOrders = false;
    this.resultAvailable = false;
    this.resultsDisplay = false;
    this.radiologyOrdered = true;
    this.enterReportResults = false;
    this.radiologySelected = false;
    this.addRadiologyOrders = false;
  }
  public addNewRadiologyOrder() {
    this.addRadiologyOrders = true;
  }
  // public slackForRights () {
  // }

  public enterImagingResults(order) {
    console.log(order, 'ordere');
    this.radiologyOrdered = false;
    this.enterReportResults = true;
    this.resultsDisplay = false;
    this.resultView = false;
  }
 public showResults(order) {
  this.radiologyOrdered = false;
  this.resultView = true;
  this.voidOrderButton = this.ProcedureOrderService.checkProcedureandResultDeletingRights();
  this.resultsDisplay = true;
  this.viewResults = 'Radiology:' + order.orderNumber;
  this.showDetails = true;
  this.selectedRad = order;
  }
  public discard(selectedRad) {
    this.resultView = false;
    this.resultsDisplay = true;
    this.viewResults = 'Radiology:' + selectedRad.orderNumber;
    this.showDetails = true;
    this.selectedRad = selectedRad;
  }
  public showReportResults(value) {
    console.log(value, 'rsrs');
    this.ObsImages = value.reverse();
    this.imageModal.show();
  }
}

