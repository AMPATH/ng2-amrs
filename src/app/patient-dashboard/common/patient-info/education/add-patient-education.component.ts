import { Component, OnInit, OnDestroy } from '@angular/core';

import { Patient } from 'src/app/models/patient.model';
import { PersonAttributeResourceService } from './../../../../openmrs-api/person-attribute-resource.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import * as _ from 'lodash';
import { PatientEducationService } from '../../../../../app/etl-api/patient-education.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'add-patient-education',
  templateUrl: './add-patient-education.component.html',
})
export class AddPatientEducationComponent implements OnInit, OnDestroy {
  public displayErrors: boolean;
  public errorMessage = '';
  public patient: Patient;
  public isLoading: boolean;
  public errors: Array<any>;
  public successAlert: string;
  public errorAlert: string;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public display: boolean;
  public highestEducationConcept = 'a89e48ae-1350-11df-a1f1-0026b9348838';
  public levelOfEducation: any;
  public patientHighestEducation: string;
  private sub: Array<Subscription> = [];

  constructor(
    private personAttributeService: PersonAttributeResourceService,
    private patientService: PatientService,
    private patientEducationService: PatientEducationService
  ) {}

  public ngOnInit() {
    this.getEducationLevels();
    this.getPatient();
  }

  public getPatient() {
    const subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient: Patient) => {
        if (patient) {
          this.patient = patient;
        }
      }
    );
    this.sub.push(subscription);
  }

  public getEducationLevels() {
    this.setHighestEducationLevels(
      this.patientEducationService.getEducationLevels()
    );
  }

  public setHighestEducationLevels(
    educationLevels: Array<{ uuid: string; display: string }>
  ) {
    this.levelOfEducation = educationLevels.map((levels: any) => {
      return {
        value: levels.uuid,
        name: levels.display,
      };
    });
  }

  public saveAttribute() {
    this.isLoading = true;
    const personAttributePayload = {
      value: this.patientHighestEducation,
      attributeType: '352b0d51-63c6-47d0-a295-156bebee4fd5',
    };

    this.personAttributeService
      .createPersonAttribute(this.patient.person.uuid, personAttributePayload)
      .subscribe(
        (success) => {
          if (success) {
            this.displaySuccessAlert('Education level save successfully');
            this.patientService.reloadCurrentPatient();
          }
        },
        (error) => {
          console.error('error', error);
          this.displayErrorAlert('Error adding education');
        }
      );
  }

  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
      this.display = false;
    }, 3000);
  }

  public dismissDialog() {
    this.display = false;
  }

  public showEducationDialog() {
    this.display = true;
  }

  public onSelectEducation(event) {
    this.patientHighestEducation = event;
  }

  private displayErrorAlert(message) {
    this.showErrorAlert = true;
    this.showSuccessAlert = false;
    this.successAlert = message;
    setTimeout(() => {
      this.showErrorAlert = false;
      this.display = false;
    }, 5000);
  }

  public ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
