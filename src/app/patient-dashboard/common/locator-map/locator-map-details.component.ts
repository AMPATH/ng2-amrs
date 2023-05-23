import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { PersonAttributeResourceService } from './../../../openmrs-api/person-attribute-resource.service';
import { PrettyEncounterViewerComponent } from '../patient-dashboard/common/formentry/pretty-encounter-viewer.component';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'locator-map-details',
  templateUrl: './locator-map-details.component.html',
  styleUrls: ['./locator-map-details.component.css']
})
export class LocatorMapDetailsComponent implements OnInit {
  public patient: Patient = new Patient({});
  public display = false;
  public subscription: Subscription;
  private patient_uuid: string;
  private tribe: string;
  private nearestNeighbour: string;
  private landmark: string;
  private workplace: string;
  private knownChild: string;
  private treatmentSupporter: string;
  constructor(
    private patientService: PatientService,
    private personAttributeResourceService: PersonAttributeResourceService
  ) {}
  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.getPatientLocation();
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
          console.log(a);
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

  // tslint:disable-next-line: use-life-cycle-interface
  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
