import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'edit-demographics',
  templateUrl: './edit-demographics.component.html',
  styleUrls: [],
})
export class EditDemographicsComponent implements OnInit, OnDestroy {

  public patients: Patient = new Patient({});
  public display: boolean = false;
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
  public birthdate: any;
  public dead: boolean = false;
  public gender: any;
  public deathDate: Date;
  public causesOfDeath: any = [];
  public causeOfDeath: any;
  public errors: any = [];
  public successAlert: any = '';
  public healthCenter: any;
  public showSuccessAlert: boolean = false;
  public showErrorAlert: boolean = false;
  public errorAlert: string;
  public errorTitle: string;

  constructor(private patientService: PatientService,
              private personResourceService: PersonResourceService,
              private conceptResourceService: ConceptResourceService) {
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

  public getCauseOfDeath() {
    let conceptUid = 'a89df750-1350-11df-a1f1-0026b9348838';
    this.conceptResourceService.getConceptByUuid(conceptUid).subscribe((data) => {
      if (data) {
        this.causesOfDeath = data.answers;
      }
    }, (error) => {
      console.log('Failed to load concepts ', error);
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
      if (this.causeOfDeath == null) {
        this.errors.push({ message: 'Cause of Death is required' });
      }

    }

    if (this.errors.length === 0) {
      let person = {
        uuid: this.patients.person.uuid
      };
      let personNamePayload = {
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
        gender: this.gender

      };
      this.personResourceService.saveUpdatePerson(person.uuid, personNamePayload).subscribe(
        (success) => {
          if (success) {
            this.displaySuccessAlert('Demographics saved successfully');
            this.patientService.fetchPatientByUuid(this.patients.person.uuid);
          }
          // this.successAlert = 'Successfully updated Patient Demographics';
        },
        (error) => {
          console.log('error', error);
          this.errors.push({
            message: 'error updating demographics'
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
