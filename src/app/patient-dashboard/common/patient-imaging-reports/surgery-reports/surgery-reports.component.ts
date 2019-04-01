import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as _ from 'lodash';
import * as Moment from 'moment';

import { ModalDirective } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
import { FileUploadResourceService } from 'src/app/etl-api/file-upload-resource.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { FeedBackService } from 'src/app/feedback/feedback.service';
import { ProcedureOrdersService } from '../procedure-orders/procedure-orders.service';



@Component({
  selector: 'app-surgery-reports',
  templateUrl: './surgery-reports.component.html',
  styleUrls: ['./surgery-reports.component.css']
})
export class SurgeryReportsComponent implements OnInit {
  @Output() public fileChanged: EventEmitter<any> = new EventEmitter();
  @Input() public sentData: any;
  public surgeryOrders = [];
  public surgeryOrdersWithResults = [];
  public surgeryData: any;
  public files: any;
  public imageReportFindings: any;
  public showFileUploader = false;
  public surgeryOrdersWithoutResults = [];
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
  public loadingsurgeryOrderStatus = true;
  public orderSent: any;
  public orderValue: any;
  public display = false;
  public resultsDisplay = false;
  public voidOrderButton = false;
  public resultView = true;
  // public deleteResultsButton = this.procedureOrderService.checksurgeryandResultDeletingRights();
  public uploadingResults = false;
  public showDetails = false;
  public displayResultsChange = false;
  public displayEdit = false;
  public displayRenew = false;
  public displayNew = false;
  public displayAddResults = false;
  public selectedsurgery: string;
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
  public successAlert: any = '';
  public currentDate;
  public selectedLocation: string;
  public locationList = false;
  public location: string;
  public submittedsurgeryOrder;
  public newsurgery = false;
  public subscriptions = [];
  public imageSaved = false;
  public imageDeleted = false;
  public deleteStatus = true;
  public imageDeletedFailed = false;
  public imageUploadFailed = false;
  private surgery: string;
  public surgerysOrdered = true;
  public displayEditRequest = false;
  public surgeryList = false;
  public surgeryName: string;
  public imageServerId: any;
  public imageText: string;
  public imageStatusValue: any;
  public patientObs: any;
  public surgeryReports = [];
  public patientObsWithOrders: any;
  public selectedProc: any;
  public orderNumber: string;
  public surgeryConceptList = [];
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

  constructor(private patientService: PatientService,
    private userService: UserService,
    private feedBackService: FeedBackService,
    private orderResourceService: OrderResourceService,
    private procedureOrderService: ProcedureOrdersService,
    private encounterResourceService: EncounterResourceService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private fileUploadResourceService: FileUploadResourceService,
    private conceptResourceService: ConceptResourceService,
    private obsResourceService: ObsResourceService) { }

  ngOnInit() {
    this.getsurgeries();
    this.getCurrentlyLoadedPatient();
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    this.getProvider();
    const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    this.location = currentLocation.display;
    this.selectedLocation = currentLocation.uuid;
    this.currentDate = Date.now();
  }
  public addSurgeryProcedure(show) {
    this.addOrders = show;

  }
  public getsurgeries() {
    const surgeries = '	b8ad835f-d568-4588-983e-48ba432f67b5';
    this.conceptResourceService.getConceptByUuid(surgeries).subscribe((data) => {
      this.proc = data.setMembers;
      console.log(this.proc);
    });

  }
  public uploadFile(event) {
    const main = '';
    this.files = event;
    this.surgeryData = {
      file: this.files,
      mainObs: main,
      surgeryType: this.surgery,
      imageReport: '969681ad-b4cb-4d37-a32b-fd553a7aab30',
      imageLink: '',
      freeText: 'a8a06fc6-1350-11df-a1f1-0026b9348838',
      freeTextValue: '',
      reportType: 'surgery report'

    };
  }
  public getSummary() {
    this.surgeryData.freeTextValue = this.imageReportFindings;
    this.saveSurgeryData();
  }
  public showResults(show) {
    this.showFileUploader = show;
    this.addOrders = false;
  }
  public saveSurgeryData() {
    this.fileChanged.emit(this.surgeryData);
    this.getPatientObs(this.patient.uuid);
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
    this.procedureOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.provider = data.providerUuid;
    });
  }
  public getPatientObs(patientUuid) {
    const surgeryResultsConcept = '4c057eae-f3d7-4df9-898d-8345e721370d';
    this.obsResourceService.getObsPatientObsByConcept(patientUuid, surgeryResultsConcept).subscribe((result: any) => {
      console.log(result.results);
      this.patientObs = result.results;
      for (let index = 0; index < this.patientObs.length; index++) {
       const date = this.patientObs[index].obsDatetime;
        this.assignValue(this.patientObs[index].groupMembers, date);
      }
      console.log( this.surgeryReports);
    },
      (error) => {
        console.error('error', error);
      });

  }
  public assignValue(data, date) {
      // tslint:disable-next-line:prefer-const
      let surgeryData = {
        surgeryName: '',
        date: '',
        results: '',
        findings: '',
        status: 0
      };
      surgeryData.date = date;
    for (let b = 0; b < data.length; b++) {
      console.log( data);
     if (data[b].concept.uuid === '969681ad-b4cb-4d37-a32b-fd553a7aab30') {
      surgeryData.results = data[b].value;
      console.log( surgeryData.results);
      surgeryData.status = 1;
     } else if (data[b].concept.uuid === 'b8ad835f-d568-4588-983e-48ba432f67b5') {
       surgeryData.surgeryName = data[b].value;
       console.log( surgeryData.surgeryName);
     } else if (data[b].concept.uuid === 'a8a06fc6-1350-11df-a1f1-0026b9348838') {
       surgeryData.findings = data[b].value;
       console.log( surgeryData.findings);
     } else {
     }
    }
    this.surgeryReports.push(surgeryData);
    console.log( this.surgeryReports);
  }
  public saveSurgery() {
    const surgeryPayload = this.createPayload();
    this.saveSurgeryObs(surgeryPayload);
  }
  public createPayload() {
    let surgeryPayload;

    if (!this.surgery) {
      this.errors.push({
        message: 'Please Surgery Type'
      });
      setTimeout(() => {
        this.errors = false;
      }, 1000);
    } else {
      surgeryPayload = {
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        concept: 'b8ad835f-d568-4588-983e-48ba432f67b5',
        person: this.patient.uuid,
        value: this.surgery,
      };
      this.error = '';
    }
    return surgeryPayload;

  }
  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

  public saveSurgeryObs(payload) {
    this.obsResourceService.saveObs(payload).pipe(take(1)).subscribe(
      (success) => {
        if (success) {
          // this.uploadingResults = true;
          this.getPatientObs(this.patient.uuid);
          setTimeout(() => {
          }, 500);
          // this.uploadingResults = false;
        }
      },
      (error) => {
        console.error('error', error);
      }
    );

  }

}
