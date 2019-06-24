import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { FeedBackService } from 'src/app/feedback/feedback.service';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { ProcedureOrdersService } from '../procedure-orders/procedure-orders.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { FileUploadResourceService } from 'src/app/etl-api/file-upload-resource.service';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { Subscription } from 'rxjs';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-histology-reports',
  templateUrl: './histology-reports.component.html',
  styleUrls: ['./histology-reports.component.css']
})
export class HistologyReportsComponent implements OnInit {
  @Output() public fileChanged: EventEmitter<any> = new EventEmitter();
  @Input() public sentData: any;
public personUuid: any;
public location: any;
public currentDate: number;
public selectedLocation: any;
public addPathologies = false;
public pathologies = [];
public files: any;
public subscription: Subscription;
public histologyData: any;
public imageReportFindings: any;
public patient: any;
public showFileUploader = false;
public ObsImages = [];
imageLink = '';
@ViewChild('imageModal')
public imageModal: ModalDirective;
public pathology: any;
public imageLinksAvailable = false;
public resultsIsPDF = false;
private patientIdentifer: any;
public pdfLinks = [];
public imageLinks = [];
public showImageModal = false;
public imageTitle: any;
public histologyReports = [];
public errors = [];
public pdf = /pdf/gi;
public provider: any;
public patientObs: any;
public subscriptions = [];


  constructor(private userService: UserService,
    private feedBackService: FeedBackService,
    private appSettingsService: AppSettingsService,
    private procedureOrderService: ProcedureOrdersService,
    private encounterResourceService: EncounterResourceService,
    private patientService: PatientService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private fileUploadResourceService: FileUploadResourceService,
    private conceptResourceService: ConceptResourceService,
    private obsResourceService: ObsResourceService) { }

  ngOnInit() {
    this.getHistopathologies();
    this.getCurrentlyLoadedPatient();
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    this.getProvider();
    const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    this.location = currentLocation.display;
    this.selectedLocation = currentLocation.uuid;
    this.currentDate = Date.now();
  }
  public addHistology(show) {
    this.addPathologies = show;

  }
  public getHistopathologies() {
    const surgeries = '9bb0a7aa-fde1-4ce6-9b36-30c311359454';
    this.conceptResourceService.getConceptByUuid(surgeries).subscribe((data) => {
      this.pathologies = data.setMembers;
    });

  }
  public uploadFile(event) {
    const main = '';
    this.files = event;
    this.histologyData = {
      file: this.files,
      mainObs: main,
     histologyType: this.pathology,
      imageReport: 'd521328e-a774-4dba-a87b-a42244e7eef4',
      imageLink: [],
      freeText: 'a8a06fc6-1350-11df-a1f1-0026b9348838',
      freeTextValue: '',
      reportType: 'histology report'

    };
    console.log(this.histologyData);
  }
  public getSummary() {
    this.histologyData.freeTextValue = this.imageReportFindings;
    this.saveHistologyData();
    this.defaultView();
    this.getPatientObs(this.patient.uuid);
  }
  public showResults(show) {
    this.addPathologies = false;
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
    console.log(this.appSettingsService.getEtlRestbaseurl().trim() + 'files/' + imageName);
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'files/' + imageName;
  }

  public modalClose($event) {
    this.showImageModal = false;
    this.imageTitle = '';
    this.imageLinks = [];
  }
  public saveHistologyData() {
    this.fileChanged.emit(this.histologyData);
    setTimeout(() => {
      this.getPatientObs(this.patient.uuid);
    }, 200);
  }
  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.histologyReports = [];
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
    this.histologyReports = [];
    const histopathologyResultsConcept = 'c9de2d83-9e57-4856-b280-f458263ba1a7';
    this.obsResourceService.getObsPatientObsByConcept(patientUuid, histopathologyResultsConcept).subscribe((result: any) => {
      console.log(result.results);
      this.patientObs = result.results;
      for (let index = 0; index < this.patientObs.length; index++) {
       const date = this.patientObs[index].obsDatetime;
        this.assignValue(this.patientObs[index].groupMembers, date);
      }
      console.log( this.histologyReports);
    },
      (error) => {
        console.error('error', error);
      });

  }
  public assignValue(data, date) {

      // tslint:disable-next-line:prefer-const
      let histologyData = {
        histologyName: '',
        date: '',
        results: [],
        findings: '',
        status: 0
      };
      histologyData.date = date;
    for (let b = 0; b < data.length; b++) {
      if (data) {
        if (data[b].concept.uuid === 'd521328e-a774-4dba-a87b-a42244e7eef4') {
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
             histologyData.results.push(dataVal);
          });
          histologyData.status = 1;
         } else if (data[b].concept.uuid === '9bb0a7aa-fde1-4ce6-9b36-30c311359454') {
          histologyData.histologyName = data[b].value;
         } else if (data[b].concept.uuid === 'a8a06fc6-1350-11df-a1f1-0026b9348838') {
          histologyData.findings = data[b].value;
         } else {
         }
      }
      }
      console.log(histologyData);
      this.histologyReports.push(histologyData);
      histologyData = {
        histologyName: '',
        date: '',
        results: [],
        findings: '',
        status: 0
      };
  }
  public saveHistopathology() {
    const pathologyPayload = this.createPayload();
    this.saveHistopathologyObs(pathologyPayload);
  }
  public createPayload() {
    let histologyPayload;

    if (!this.pathology) {
      this.errors.push({
        message: 'Please Histology Type'
      });
      setTimeout(() => {
        this.errors = [];
      }, 1000);
    } else {
      histologyPayload = {
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        concept: '9bb0a7aa-fde1-4ce6-9b36-30c311359454',
        person: this.patient.uuid,
        value: this.pathology,
      };
      this.errors = [];
    }
    return histologyPayload;

  }
  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

  public saveHistopathologyObs(payload) {
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
    this.pathology = '';
    this.addPathologies = false;
    this.showFileUploader = false;
  }
  public showHistologyResults(result) {
console.log(result);
    this.ObsImages = result.reverse();
    this.imageModal.show();
  }

}
