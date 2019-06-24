import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
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
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';



@Component({
  selector: 'app-surgery-reports',
  templateUrl: './surgery-reports.component.html',
  styleUrls: ['./surgery-reports.component.css']
})
export class SurgeryReportsComponent implements OnInit {
  @Output() public fileChanged: EventEmitter<any> = new EventEmitter();
  @Input() public sentData: any;
  imageLink = '';
  @ViewChild('imageModal')
  public imageModal: ModalDirective;
  public surgeryOrders = [];
  public surgeryOrdersWithResults = [];
  public surgeryData: any;
  public files: any;
  public imageReportFindings: any;
  public showFileUploader = false;
  public surgeryOrdersWithoutResults = [];
  public selectedOrders = [];
  public pdf = /pdf/gi;
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
  public pdfLinks = [];
  public showImageModal = false;
  public resultsIsPDF = false;
  public imageLinks = [];
  public imageLinksAvailable = false;
  public imageTitle = '';
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
    private appSettingsService: AppSettingsService,
    private procedureOrderService: ProcedureOrdersService,
    private encounterResourceService: EncounterResourceService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private fileUploadResourceService: FileUploadResourceService,
    private conceptResourceService: ConceptResourceService,
    private obsResourceService: ObsResourceService) { }

  ngOnInit() {
    this.getsurgeries();
  }
  public addSurgeryProcedure(show) {
    this.addOrders = show;

  }
  public getsurgeries() {
    const surgeries = '	b8ad835f-d568-4588-983e-48ba432f67b5';
    this.conceptResourceService.getConceptByUuid(surgeries).subscribe((data) => {
      this.proc = data.setMembers;
      this.getCurrentlyLoadedPatient();
      this.personUuid = this.userService.getLoggedInUser().personUuid;
      this.getProvider();
      const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
      this.location = currentLocation.display;
      this.selectedLocation = currentLocation.uuid;
      this.currentDate = Date.now();
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
      imageLink: [],
      freeText: 'a8a06fc6-1350-11df-a1f1-0026b9348838',
      freeTextValue: '',
      reportType: 'surgery report'

    };
  }
  public getSummary() {
    this.surgeryData.freeTextValue = this.imageReportFindings;
    this.saveSurgeryData();
    this.defaultView();
    this.getPatientObs(this.patient.uuid);
  }
  public showResults(show) {
    this.addOrders = false;
    this.showFileUploader = true;
    // console.log(show);
    // this.showModal(show);
    // this.imageModal.show();
    //   this.imageTitle = 'Surgery report';
  }
  public showModal(image) {
    for (let i = 0; i < image.length; i++) {
      const re = /pdf/gi;
      if (JSON.stringify(image[i]).search(re) === -1) {
        this.imageLinksAvailable = true;
      } else {
        this.resultsIsPDF = true;
        this.pdfLinks.push(this.createPdfLink(image[i]));
        image.splice(i, 1);
      }
    this.imageLinks = image;
    this.showImageModal = true;
  }
  }
  public createPdfLink(imageName) {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'files/' + imageName;
  }

  public modalClose($event) {
    this.showImageModal = false;
    this.imageTitle = '';
    this.imageLinks = [];
  }
  public saveSurgeryData() {
    this.fileChanged.emit(this.surgeryData);
    this.surgeryReports = [];
    setTimeout(() => {
      this.getPatientObs(this.patient.uuid);
    }, 1000);
  }
  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.surgeryReports = [];
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
    this.surgeryReports = [];
    const surgeryResultsConcept = '4c057eae-f3d7-4df9-898d-8345e721370d';
    this.obsResourceService.getObsPatientObsByConcept(patientUuid, surgeryResultsConcept).subscribe((result: any) => {
      this.patientObs = result.results;
      for (let index = 0; index < this.patientObs.length; index++) {
       const date = this.patientObs[index].obsDatetime;
        this.assignValue(this.patientObs[index].groupMembers, date);
      }
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
        results: [],
        findings: '',
        status: 0
      };
      surgeryData.date = date;
    for (let b = 0; b < data.length; b++) {
      if (data) {
        if (data[b].concept.uuid === '969681ad-b4cb-4d37-a32b-fd553a7aab30') {
          const valData = JSON.parse(data[b].value);
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
             surgeryData.results.push(dataVal);
          });
          surgeryData.status = 1;
         } else if (data[b].concept.uuid === 'b8ad835f-d568-4588-983e-48ba432f67b5') {
           surgeryData.surgeryName = data[b].value;
         } else if (data[b].concept.uuid === 'a8a06fc6-1350-11df-a1f1-0026b9348838') {
           surgeryData.findings = data[b].value;
         } else {
         }
      }
      }
      this.surgeryReports.push(surgeryData);
      surgeryData = {
        surgeryName: '',
        date: '',
        results: [],
        findings: '',
        status: 0
      };
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
  public defaultView() {
    this.surgery = '';
    this.addOrders = false;
    this.showFileUploader = false;
  }
  public showReportResults(value) {
    console.log(value, 'rsrs');
    this.ObsImages = value.reverse();
    this.imageModal.show();
  }

}
