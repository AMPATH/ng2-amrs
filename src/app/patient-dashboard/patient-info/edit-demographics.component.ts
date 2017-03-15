import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';
import { PersonResourceService } from '../../openmrs-api/person-resource.service';
import { ConceptResourceService  } from '../../openmrs-api/concept-resource.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'edit-demographics',
  templateUrl: 'edit-demographics.component.html',
  styleUrls: [],
})
export class EditDemographicsComponent implements OnInit, OnDestroy {

  patients: Patient = new Patient({});
  public display: boolean = false;
  subscription: Subscription;
  private givenName: string;
  private familyName: string;
  private middleName: string;
  private preferred: any;
  private ispreferred: boolean;
  private preferredOptions = [
      { label: 'Yes', val: true },
      { label: 'No', val: false }
  ];
  private preferredNameuuid: string;
  private birthdate: any;
  private dead: any;
  private isDead: boolean;
  private isDeadOptions = [
      { label: 'Yes', val: true },
      { label: 'No', val: false }
  ];
  private deathDate: Date;
  private causesOfDeath: any = [];
  private causeOfDeath: any;
  private errors: any = [];
  private successAlert: any = '';

  constructor(private patientService: PatientService,
              private personResourceService: PersonResourceService,
              private conceptResourceService: ConceptResourceService) { }
  ngOnInit(): void {
    this.getPatient();
    this.getCauseOfDeath();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getPatient() {
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
            this.isDead = false;
        }
      }
    );
  }
  showDialog() {
    this.display = true;
  }
  public dismissDialog() {
    this.display = false;
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
            this.errors.push( { message: 'Family Name is required'} );
        }
        if (this.givenName === '') {
            this.errors.push( { message: 'Given Name is required'} );
        }
        if (this.preferred === '') {
            this.errors.push( { message: 'Preferred is required'} );
        }
        if (this.preferred === 'true') {
            this.ispreferred = true;
        }
        if (this.preferred === 'false') {
            this.ispreferred = false;
        }

        if (this.dead === 'false') {
            this.isDead = false;
            this.deathDate = null;
            this.causeOfDeath = null;

        } else if (this.dead === 'true') {

            if (this.deathDate == null ) {
                this.errors.push( { message: 'Death Date is required'} );
            }
            if (this.causeOfDeath == null) {
                this.errors.push( { message: 'Cause of Death is required'} );
            }
            if (this.dead === 'true') {
                this.isDead = true;
            }
            if (this.dead === 'false') {
                this.isDead = false;
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
                    uuid : this.preferredNameuuid
                }],
                dead: this.isDead,
                deathDate: this.deathDate,
                causeOfDeath: this.causeOfDeath
            };
            this.personResourceService.saveUpdatePerson(person.uuid, personNamePayload).subscribe(
            (success) => {
                if ( success ) {
                this.patientService.fetchPatientByUuid(this.patients.person.uuid);
                }
                console.log('success', success);
                this.successAlert = 'Successfully updated Patient Demographics';
            },
            (error) => {
                console.log('error', error);
                this.errors.push({
                    message: 'error updating name'
                });
            }
            );
        }
    }
}
