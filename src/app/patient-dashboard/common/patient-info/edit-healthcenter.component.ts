import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { Subscription } from 'rxjs';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';

@Component({
  selector: 'edit-healthcenter',
  templateUrl: './edit-healthcenter.component.html',
  styleUrls: [],
})
export class EditHealtCenterComponent implements OnInit, OnDestroy {
  public patients: Patient = new Patient({});
  public subscription: Subscription;
  public loaderStatus: boolean = false;
  public locations = [];
  public display: boolean = false;
  public healthCenter: any = {
    label: '',
    value: ''
  };
  public selectedLocation: any;
  public errors: any = [];

  constructor(private patientService: PatientService,
              private locationResourceService: LocationResourceService,
              private personResourceService: PersonResourceService) {
  }

  public ngOnInit(): void {
    this.getPatient();
    this.getLocations();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patients = new Patient({});
        if (patient) {
          this.patients = patient;
          if (this.patients.person.healthCenter) {
            this.selectedLocation = this.patients.person.healthCenter;
          }
        }
      }
    );
  }

  public showDialog() {
    this.display = true;
  }

  public dismissDialog() {
    this.display = false;
  }

  public updateHealthCenter() {
    this.errors = [];
    if (this.healthCenter.value === '') {
      this.errors.push({
        id: 'patient',
        message: 'Please select location'
      });
      return;
    }
    let person = {
      uuid: this.patients.person.uuid
    };
    let locationId = this.locationResourceService.getLocationIdByUuid(this.healthCenter.value);
    let healthCenterPayload = {
      attributes: [{
        value: locationId,
        attributeType: '8d87236c-c2cc-11de-8d13-0010c6dffd0f'
      }]
    };
    this.personResourceService.saveUpdatePerson(person.uuid, healthCenterPayload).subscribe(
      (success) => {
        if (success) {
          this.errors = [];
          this.healthCenter = {
            label: '',
            value: ''
          };
          this.patientService.fetchPatientByUuid(this.patients.person.uuid);
        }
      },
      (error) => {
        console.log('error', error);
        this.errors.push({
          id: 'patient',
          message: 'error updating address'
        });
      }
    );
    this.display = false;
  }

  public getLocations() {
    this.loaderStatus = true;
    this.locationResourceService.getLocations().subscribe((results: any) => {
      this.locations = results.map((location) => {
        return {
          value: location.uuid,
          label: location.display
        };
      });
      this.loaderStatus = false;
    }, (error) => {
      this.loaderStatus = false;
      console.log(error);
    });
  }

  public locationChanged(location) {
    if (location && location.label !== this.healthCenter.label) {
      this.healthCenter = location;
    }
  }
}
