import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { PersonAttributeResourceService } from './../../../openmrs-api/person-attribute-resource.service';
import { PrettyEncounterViewerComponent } from '../patient-dashboard/common/formentry/pretty-encounter-viewer.component';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModalDirective } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
@Component({
  selector: 'locator-map-details',
  templateUrl: './locator-map-details.component.html',
  styleUrls: ['./locator-map-details.component.css']
})
export class LocatorMapDetailsComponent implements OnInit {
  public patient: Patient = new Patient({});

  public display = false;
  public subscription: Subscription;
  public patientLocatorEncounterUuid: string;
  public patientLocatorEncounter: any;
  public editDetails = false;
  public patientEncounters: Array<any> = [];
  @ViewChild('staticModal')
  public staticModal: ModalDirective;
  @ViewChild('modal')
  public modal: ModalComponent;
  @Output() public isBusy = new EventEmitter();
  @Output() public ShowPrettyEncounterViewer = new EventEmitter();
  @Output() public EncounterObservations = new EventEmitter();
  private patient_uuid: string;
  private tribe: string;
  private nearestNeighbour: string;
  private landmark: string;
  private workplace: string;
  private knownChild: string;
  private treatmentSupporter: string;
  private locatorMapFormUuid = '18992298-4fe3-4c77-af9c-df8cf31b6e2b';
  constructor(
    private patientService: PatientService,
    private personAttributeResourceService: PersonAttributeResourceService,
    private router: Router,
    private encounterResourceService: EncounterResourceService
  ) {}

  public showDialog() {
    this.display = true;
  }
  public close() {
    this.modal.close();
  }
  public dismissed() {
    this.modal.dismiss();
  }

  public showEncounterObservations(encounter) {
    this.display = true;
    this.isBusy.emit(true);
    this.EncounterObservations.emit(encounter);
    // console.log('Show observations', encounter);
  }
  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.getPatientLocation();
          this.getPatientEncounters();
        }
      }
    );
  }

  public getPatientLocation() {
    const patientUuid = this.patient.uuid;
    this.personAttributeResourceService
      .getPersonAttributesByUuid(patientUuid)
      .subscribe((res) => {
        res.results.forEach((a: any) => {
          if (a.attributeType.uuid === '4dcc4901-d4a1-422a-b6a0-2b24594a0dc6') {
            this.knownChild = a.value;
          } else if (
            a.attributeType.uuid === '254e3b6a-eeec-4714-9c5f-776cc4d30191'
          ) {
            this.landmark = a.value;
          } else if (
            a.attributeType.uuid === '4dae5b87-884d-4f88-b2fb-85cda2be37d6'
          ) {
            this.workplace = a.value;
          } else if (
            a.attributeType.uuid === '38f592c5-9e44-4629-8561-c2429bc6062d'
          ) {
            this.nearestNeighbour = a.value;
          } else if (
            a.attributeType.uuid === '20360c21-2241-47b6-8442-04aa3594544b'
          ) {
            this.treatmentSupporter = a.value;
          } else if (
            a.attributeType.uuid === 'fb74a24a-13a9-11df-a1f1-0026b9348838'
          ) {
            this.tribe = a.value;
          }
        });
      });
  }
  public fillLocatorDetails() {
    const patientUuid = this.patient.uuid;

    if (patientUuid === undefined || patientUuid === null) {
      return;
    }

    if (this.patientEncounters.length > 0) {
      const url = `/patient-dashboard/patient/${patientUuid}/general/general/formentry/${this.locatorMapFormUuid}`;
      this.router.navigate([url], {
        queryParams: {
          encounter: this.patientLocatorEncounterUuid,
          visitTypeUuid: ''
        }
      });
    } else {
      this.router.navigate([
        '/patient-dashboard/patient/' +
          patientUuid +
          '/general/general/formentry/' +
          this.locatorMapFormUuid
      ]);
    }
  }

  public getPatientEncounters() {
    this.encounterResourceService
      .getEncountersByPatientUuid(this.patient.uuid, false, null)
      .pipe(take(1))
      .subscribe((resp) => {
        this.patientEncounters = resp.reverse().filter((encounter) => {
          if (encounter.form) {
            return encounter.form.uuid === this.locatorMapFormUuid;
          }
        });
        if (this.patientEncounters.length > 0) {
          this.editDetails = true;
          this.patientLocatorEncounter = _.first(this.patientEncounters);
          this.patientLocatorEncounterUuid = _.first(
            this.patientEncounters
          ).uuid;
        }
      });
  }

  // tslint:disable-next-line: use-life-cycle-interface
  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
