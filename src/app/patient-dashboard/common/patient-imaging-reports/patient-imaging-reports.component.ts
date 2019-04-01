import { Component, OnInit, OnDestroy, ViewChild, } from '@angular/core';
import { UserService } from 'src/app/openmrs-api/user.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { ProcedureOrdersService } from './procedure-orders/procedure-orders.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
import { FileUploadResourceService } from 'src/app/etl-api/file-upload-resource.service';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { PatientService } from '../../services/patient.service';
import { Subscription, BehaviorSubject, Observable, forkJoin } from 'rxjs';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { take } from 'rxjs/operators';
import { isThisSecond } from 'date-fns';
import { ImagingReportsComponent } from './imaging-reports/imaging-reports.component';
import { ProcedureOrdersComponent } from './procedure-orders/procedure-orders.component';
import { SurgeryReportsComponent } from './surgery-reports/surgery-reports.component';
import { HistologyReportsComponent } from './histology-reports/histology-reports.component';

@Component({
  selector: 'app-patient-imaging-reports',
  templateUrl: './patient-imaging-reports.component.html',
  styleUrls: ['./patient-imaging-reports.component.css']
})
export class PatientImagingReportsComponent implements OnInit, OnDestroy {
  @ViewChild('patientRadiologyImaging')
  public patientRadiologyImaging: ImagingReportsComponent;
  @ViewChild('procedureOrders')
  public procedureOrders: ProcedureOrdersComponent;
  @ViewChild('surgeryReport')
  public surgeryReport: SurgeryReportsComponent;
  @ViewChild('histologyReport')
  public histologyReport: HistologyReportsComponent;
  private personUuid: string;
  public subscriptions = [];
  public currentDate;
  public patientObs: any;
  public obsGroup: any;
  public message: string;
  public error: string;
  private provider: string;
  public selectedLocation: string;
  public location: string;
  public caresetting = '6f0c9a92-6f24-11e3-af88-005056821db0';
  public subscription: Subscription;
  private patient: any;
  private patientIdentifer: any;
  public imageServerId: any;
  public obsPayload: any;
  innerValue = null;
  public sharedData: any;
  private refresh = false;

  constructor(private userService: UserService,
    private orderResourceService: OrderResourceService,
    private ProcedureOrderService: ProcedureOrdersService,
    private encounterResourceService: EncounterResourceService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private fileUploadResourceService: FileUploadResourceService,
    private conceptResourceService: ConceptResourceService,
    private obsResourceService: ObsResourceService,
    private patientService: PatientService) { }

  ngOnInit() {
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    this.sharedData = {
      orders: '',
      location: '',
      patient: '',
      provider: this.getProvider(),
      caresetting: this.caresetting
    };
    this.getCurrentlyLoadedPatient();
    const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    this.location = currentLocation.display;
    this.selectedLocation = currentLocation.uuid;
    this.sharedData.location = this.selectedLocation;
    this.currentDate = Date.now();
    console.log(this.sharedData);
  }
  public ngOnDestroy(): void {
    this.cleanUp();
  }
  public upload() {
  }
  public clearValue() {
    this.innerValue = null;
    this.propagateChange(this.innerValue);
  }
  private cleanUp() {
    // tslint:disable-next-line:prefer-for-of
    for (let sub = 0; sub < this.subscriptions.length; sub++) {
      this.subscriptions[sub].unsubscribe();
    }
  }
  // tslint:disable-next-line:no-shadowed-variable
  private propagateChange = (_: any) => { };
  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.sharedData.patient = this.patient.uuid;
          this.getPatientObs(this.patient.uuid);
          this.getOrders();
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
  public getOrders() {
    this.orderResourceService.getAllOrdersByPatientUuuid(this.patient.uuid, this.caresetting)
      .subscribe((data) => {
        console.log(data);
        this.sharedData.orders = data.results;
        this.refresh = true;
        console.log(this.sharedData);
      });
  }
  public getProvider() {
    this.ProcedureOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.provider = data.providerUuid;
    });
    return this.provider;
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
  public onFileChange(incomingData) {
    console.log(incomingData);
    const fileData = incomingData.file;
    const val = [];
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
    if (data.reportType === 'surgery report') {
      // save parent obs and get obsgroup id
      delete this.obsPayload.order;
      this.obsPayload.concept = '4c057eae-f3d7-4df9-898d-8345e721370d';
      this.obsPayload.groupMembers = [{
        concept: 'b8ad835f-d568-4588-983e-48ba432f67b5',
        value: data.surgeryType,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      {
        concept: data.imageReport,
        value: data.imageLink,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      {
        concept: data.freeText,
        value: data.freeTextValue,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      ];
      this.saveObs(this.obsPayload, 'surgery');


    } else if (data.reportType === 'imaging report') {
      this.obsPayload.order = data.orderNumber;
      this.obsPayload.concept = 'c0f0477f-0552-42e2-862f-cf924d4e21e7';
      this.obsPayload.groupMembers = [{
        concept: 'bce26e1c-c65e-443a-b65f-118f699e1bd0',
        value: data.imageLink,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      {
        concept: data.concept,
        value: data.findings,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      ];
      this.saveObs(this.obsPayload, 'imaging');
    } else if (data.reportType === 'procedure report') {
      this.obsPayload.order = data.orderNumber;
      this.obsPayload.concept = 'acf1eda7-7c5e-41c5-94b7-22a57fd34eb2';
      this.obsPayload.groupMembers = [{
        concept: 'bce26e1c-c65e-443a-b65f-118f699e1bd0',
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
    } else if (data.reportType === 'histology report') {
      // save parent obs and get obsgroup id
      delete this.obsPayload.order;
      this.obsPayload.concept = 'c9de2d83-9e57-4856-b280-f458263ba1a7';
      this.obsPayload.groupMembers = [{
        concept: '9bb0a7aa-fde1-4ce6-9b36-30c311359454',
        value: data.histologyType,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      {
        concept: data.imageReport,
        value: data.imageLink,
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation,
        person: this.patient.uuid,
      },
      {
        concept: data.freeText,
        value: data.freeTextValue,
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
            this.histologyReport.getPatientObs(this.patient.uuid);
            this.message = 'Histology Report saved';
          } else if (type === 'surgery') {
            this.surgeryReport.getPatientObs(this.patient.uuid);
            this.message = 'Histology Report saved';
          } else if (type === 'procedure') {
            this.procedureOrders.getPatientObs(this.patient.uuid);
            this.message = 'Procedure Results Entered Successfully';
          } else if (type === 'imaging') {
            this.patientRadiologyImaging.getPatientObs(this.patient.uuid);
            this.message = 'Radiology Imaging Results Entered Successfully';
          }
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
        console.error('error', error);
        this.error = error;
      }
    );
    return this.obsGroup;

  }
}
