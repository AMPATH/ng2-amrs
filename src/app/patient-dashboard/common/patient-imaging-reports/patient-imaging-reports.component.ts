import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/openmrs-api/user.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { ProcedureOrdersService } from './procedure-orders/procedure-orders.service';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { PatientService } from '../../services/patient.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ProcedureOrdersComponent } from './procedure-orders/procedure-orders.component';

@Component({
  selector: 'app-patient-imaging-reports',
  templateUrl: './patient-imaging-reports.component.html',
  styleUrls: ['./patient-imaging-reports.component.css']
})
export class PatientImagingReportsComponent implements OnInit {
  public procedureOrders: ProcedureOrdersComponent;
  private personUuid: string;
  public subscriptions = [];
  public currentDate;
  public patientObs: any;
  public currentView = 'histology';
  private provider: string;
  public selectedLocation: string;
  public location: string;
  public radiologyImagingConcepts = {
    results: 'c0f0477f-0552-42e2-862f-cf924d4e21e7',
    name: 'radiology',
    icon: 'icon-i-cath-lab',
    imageConcept: 'bce26e1c-c65e-443a-b65f-118f699e1bd0',
    report: 'Radiology Reports',
    list: '8a93e5c1-b374-445d-8f1f-78364bd2108c'
    // list: ' 759a4bd6-79ab-40a9-9836-1e30783f7ae5'
  };
  public surgeryConcepts = {
    results: '4c057eae-f3d7-4df9-898d-8345e721370d',
    name: 'surgery',
    icon: 'icon-i-imaging-root-category',
    imageConcept: '969681ad-b4cb-4d37-a32b-fd553a7aab30',
    report: 'Surgery Reports',
    list: 'b8ad835f-d568-4588-983e-48ba432f67b5'};
  public proceduresConcepts = {
    results: 'acf1eda7-7c5e-41c5-94b7-22a57fd34eb2',
    name: 'procedure',
    icon: 'icon-i-immunizations',
    imageConcept: '9ab23532-40e4-4e98-85bd-bb9478d805ac',
    report: 'Procedure Reports',
    list: '2012a1c5-3be4-4ba7-a76d-22db951296ed'};
  public histopathologyConcepts = {
    results: 'c9de2d83-9e57-4856-b280-f458263ba1a7',
    name: 'histopathology',
    icon: 'icon-i-imaging-root-category',
    imageConcept: 'd521328e-a774-4dba-a87b-a42244e7eef4',
    report: 'Histopathology Reports',
    list: '9bb0a7aa-fde1-4ce6-9b36-30c311359454'
  };
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
    private userDefaultPropertiesService: UserDefaultPropertiesService,
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
  }
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
        this.sharedData.orders = data.results;
        this.refresh = true;
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
      });

  }
  public onTabChanged(event) {
    if (event.index === 0) {
      this.currentView = 'histology';
    }
  }
}
