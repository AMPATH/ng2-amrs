import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
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

@Component({
  selector: 'app-imaging-reports',
  templateUrl: './imaging-reports.component.html',
  styleUrls: ['./imaging-reports.component.css']
})
export class ImagingReportsComponent implements OnInit, DoCheck {
  @Input() public sentData: any;
  @Output() public fileChanged: EventEmitter<any> = new EventEmitter();
  myForm: FormGroup;
  public patient: any;
  public radiologyTypeMembers: any;
  public radiologySelected = false;
  public selectedRadioloyTests = [];
  public multipleSelected = false;
  public provider: any;
  public enterResults = true;
  public radiologyOrdersConceptList = [];
  private patientIdentifer: any;
  private personUuid: string;
  public radiologyConcept: string;
  public orderNumber: string;
  public subscription: Subscription;
  public radiologyConcepts: any;
  public selectedOrders = [];
  public radiologyOrdersWithResults = [];
  public radiologyOrdersWithoutResults = [];
  public radiologyOrders = [];
  public radiologySetMembers = [];
  public caresetting: any;
  public error: any;
  public patientObs: any;
  public addRadiologyOrders = false;
  public resultAvailable = false;
  public  orders: any;

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
    const OrderResultsConcept = '9ab23532-40e4-4e98-85bd-bb9478d805ac';
    this.obsResourceService.getObsPatientObsByConcept(patientUuid, OrderResultsConcept).subscribe((result: any) => {
      this.patientObs = result.results;
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
      for (const results of this.radiologyConcepts) {
        // console.log(results.uuid, 'versus', value.concept.uuid );
        this.conceptResourceService.getConceptByUuid(results.uuid).subscribe((dataFound) => {
          this.radiologySetMembers.push(dataFound.setMembers);

        });
      }
      console.log( this.radiologySetMembers);

    });
  }
  ngDoCheck() {
    if (this.sentData.orders !== this.orders) {
      this.getImagingOrders();
        }
  }
  public getImagingOrders() {
    const radiologyOrders = [];
      const data = this.sentData.orders;
      if (data === '') {

      } else {
      data.forEach((value) => {
        if (value.orderType.uuid === '53eb4768-1359-11df-a1f1-0026b9348838') {
          this.radiologyOrdersConceptList = this.radiologySetMembers ;
          // finding set members of the radiology sets
          for (const results of this.radiologyOrdersConceptList) {
            // console.log(results.uuid, 'versus', value.concept.uuid );
            for (const concepts of results) {
              if (concepts.uuid === value.concept.uuid) {
              }
              if (concepts.uuid === value.concept.uuid && !value.dateStopped) {
                radiologyOrders.push(value);
              }
            }
          }
        }
      if (radiologyOrders) {
        this.radiologyOrders = radiologyOrders.reverse();
        this.selectedOrders = this.radiologyOrders;

        this.assignOrdersResultsObs();

        // this.selectedOrdersWithObs = this.selectedOrders;
        // this.fetchingResults = false;
        // this.loadingProcedureOrderStatus = false;
        // this.isBusy = false;
      }
    });
    return Observable.of(this.selectedOrders);
  }
  }
  public assignOrdersResultsObs () {
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
    this.radiologyTypeMembers = this.myForm.getRawValue().radiologyTypes;
    console.log(this.myForm.getRawValue());
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify());
  }
 public  selectedRadiologyType(radiologyType) {

let found = false;
  for (let i = 0; i <= this.selectedRadioloyTests.length; i++) {
      if (this.selectedRadioloyTests[i] === radiologyType) {
       found = true;
       this.selectedRadioloyTests.splice(i, 1);

        return;
    }
  }
  console.log(this.selectedRadioloyTests);
  if (this.selectedRadioloyTests.length >= 1) {
    this.multipleSelected = true;
  } else {
   this.multipleSelected = false;
  }
  if (found === false) {
    this.selectedRadioloyTests.push(radiologyType);
  }
 }
  public resultsAvailable(status) {
    this.resultAvailable = status;
    this.radiologySelected = false;
    this.processValues();
  }

  public processValues() {
    for (const data of this.selectedRadioloyTests) {
      this.radiologyConcept = data;
      this.saveOrder();
    }
    this.selectedRadioloyTests = [];
  }
  public uploadFile(event) {
    const data = {
      file: event,
      orderNumber: this.orderNumber

    };
    this.fileChanged.emit(data);
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
        concept: this.radiologyConcept,
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
    this.radiologySelected = false;
  }
  public addNewRadiologyOrder () {
    this.addRadiologyOrders = true;
  }
  // public slackForRights () {
  // }
}

