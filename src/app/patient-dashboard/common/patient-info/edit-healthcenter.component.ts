import { take } from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { Subscription } from 'rxjs';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';

@Component({
  selector: 'edit-healthcenter',
  templateUrl: './edit-healthcenter.component.html',
  styleUrls: []
})
export class EditHealtCenterComponent implements OnInit, OnDestroy {
  public patients: Patient = new Patient({});
  public subscription: Subscription;
  public loaderStatus = false;
  public locations = [];
  public display = false;
  public healthCenter: any = {
    label: '',
    value: ''
  };
  public selectedLocation: any;
  public errors: any = [];

  constructor(
    private patientService: PatientService,
    private locationResourceService: LocationResourceService,
    private personResourceService: PersonResourceService
  ) {}

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
    const person = {
      uuid: this.patients.person.uuid
    };
    const locationId = this.locationResourceService.getLocationIdByUuid(
      this.healthCenter.value
    );
    const healthCenterPayload = {
      attributes: [
        {
          value: locationId,
          attributeType: '8d87236c-c2cc-11de-8d13-0010c6dffd0f'
        }
      ]
    };
    this.personResourceService
      .saveUpdatePerson(person.uuid, healthCenterPayload)
      .pipe(take(1))
      .subscribe(
        (success) => {
          if (success) {
            this.errors = [];
            this.healthCenter = {
              label: '',
              value: ''
            };
            this.patientService.reloadCurrentPatient();
          }
        },
        (error) => {
          console.error('error', error);
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
    this.locationResourceService
      .getLocations()
      .pipe(take(1))
      .subscribe(
        (results: any) => {
          this.locations = results.map((location) => {
            return {
              value: location.uuid,
              label: location.display
            };
          });
          this.loaderStatus = false;
        },
        (error) => {
          this.loaderStatus = false;
          console.error(error);
        }
      );
  }

  public locationChanged(location) {
    if (location && location.label !== this.healthCenter.label) {
      this.healthCenter = location;
    }
  }
}
