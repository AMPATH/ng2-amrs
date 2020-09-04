
import { take } from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { PatientCreationService } from 'src/app/patient-creation/patient-creation.service';

@Component({
  selector: 'edit-demographics',
  templateUrl: './edit-demographics.component.html',
  styleUrls: ['./edit-demographics.component.css'],
})
export class EditDemographicsComponent implements OnInit, OnDestroy {

  public patients: Patient = new Patient({});
  public display = false;
  public subscription: Subscription;
  public givenName: string;
  public familyName: string;
  public middleName: string;
  public preferred: any;
  public ispreferred: boolean;
  public preferredOptions = [
    { label: 'Yes', val: true },
    { label: 'No', val: false }
  ];
  public genderOptions = [
    { label: 'Female', val: 'F' },
    { label: 'Male', val: 'M' }
  ];
  public preferredNameuuid: string;
  public birthDate: any;
  public birthdateEstimated = false;
  public dead = false;
  public gender: any;
  public deathDate: Date;
  public causesOfDeath: any = [];
  public causeOfDeath: any;
  public errors: any = [];
  public successAlert: any = '';
  public healthCenter: any;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public errorTitle: string;

  constructor(private patientService: PatientService,
    private personResourceService: PersonResourceService,
    private conceptResourceService: ConceptResourceService
    ) {
  }

  public ngOnInit(): void {
    this.getPatient();
    this.getCauseOfDeath();
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
          this.givenName = (this.patients.person.preferredName as any).givenName;
          this.middleName = (this.patients.person.preferredName as any).middleName;
          this.familyName = (this.patients.person.preferredName as any).familyName;
          this.birthDate = this.patients.person.birthdate;
          this.birthdateEstimated = this.patients.person.birthdateEstimated;
          this.ispreferred = (this.patients.person.preferredName as any).preferred;
          this.preferredNameuuid = (this.patients.person.preferredName as any).uuid;
          this.gender = this.patients.person.gender;
          this.healthCenter = this.patients.person.healthCenter;
          this.dead = this.patients.person.dead;
          this.deathDate = this.patients.person.deathDate;
          this.causeOfDeath = this.patients.person.causeOfDeathUuId;
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

  public updateDeathDate(deathDate) {
    this.deathDate = deathDate;
  }
  public updateBirthDate(birthDate) {
    this.birthDate = birthDate;
  }
  public updateDeathDetails(dead) {

    if ((this.dead as any) === 'true') {
      this.dead = true;
    }

    if ((this.dead as any) === 'false') {
      this.dead = false;
    }

    if (this.dead === true) {
      this.dead = true;
    }

    if (this.dead === false) {
      this.dead = false;
    }

    if (!event) {
      this.deathDate = null;
      this.causeOfDeath = null;
    }

  }

  public updateDOBDetails(birthdateEstimated) {

    if ((this.birthdateEstimated as any) === 'true') {
      this.birthdateEstimated = true;
    }

    if ((this.birthdateEstimated as any) === 'false') {
      this.birthdateEstimated = false;
    }

  }
  public getCauseOfDeath() {
    const conceptUid = 'a89df750-1350-11df-a1f1-0026b9348838';
    this.conceptResourceService.getConceptByUuid(conceptUid).pipe(take(1)).subscribe((data) => {
      if (data) {
        this.causesOfDeath = data.answers;
      }
    }, (error) => {
      console.error('Failed to load concepts ', error);
    });
  }

  public updateName() {
    this.errors = [];
    this.successAlert = '';
    if (this.familyName === '') {
      this.errors.push({ message: 'Family Name is required' });
    }
    if (this.givenName === '') {
      this.errors.push({ message: 'Given Name is required' });
    }
    if (this.preferred === '') {
      this.errors.push({ message: 'Preferred is required' });
    }
    if (this.preferred === 'true') {
      this.ispreferred = true;
    }
    if (this.preferred === 'false') {
      this.ispreferred = false;
    }

    if (this.dead === true) {
      this.dead = true;
    }
    if (this.dead === false) {
      this.dead = false;
      this.deathDate = null;
    }

    if ((this.dead as any) === 'true') {
      this.dead = true;
    }

    if ((this.dead as any) === 'false') {
      this.dead = false;
    }

    if (!this.dead) {
      this.deathDate = null;
      this.causeOfDeath = null;

    } else if (this.dead) {
      if (moment(this.deathDate).isAfter(new Date())) {
        this.errors.push({ message: 'Date date cannot be in future' });
      }
      if (this.deathDate == null) {
        this.errors.push({ message: 'Death Date is required' });
      }
      if (!this.causeOfDeath) {
        this.errors.push({ message: 'Cause of Death is required' });
      }

    }
    if (moment(this.birthDate).isAfter(new Date())) {
      this.errors.push({ message: 'Birth Date date cannot be in future' });
    }
    if (this.birthDate == null) {
      this.errors.push({ message: 'Birth Date is required' });
    }


    if (this.errors.length === 0) {
      const person = {
        uuid: this.patients.person.uuid
      };
      const personNamePayload = {
        names: [
          {
            familyName: this.familyName,
            givenName: this.givenName,
            middleName: this.middleName,
            preferred: this.ispreferred,
            uuid: this.preferredNameuuid
          }],
        dead: this.dead,
        deathDate: this.deathDate,
        causeOfDeath: this.causeOfDeath,
        gender: this.gender,
        birthdate: this.birthDate,
        birthdateEstimated: this.birthdateEstimated
      };
      this.personResourceService.saveUpdatePerson(person.uuid, personNamePayload).pipe(take(1)).subscribe(
        (success) => {
          if (success) {
            this.displaySuccessAlert('Demographics saved successfully');
            this.patientService.reloadCurrentPatient();
          }
          // this.successAlert = 'Successfully updated Patient Demographics';
        },
        (error) => {
          console.error('error', error);
          this.errors.push({
            message: 'Error Updating Demographics!'
          });
        }
      );
      setTimeout(() => {
        this.display = false;
      }, 1000);
    }
  }
  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 1000);
  }
}
