import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';
import { PersonResourceService } from '../../openmrs-api/person-resource.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'edit-address',
  templateUrl: 'edit-address.component.html',
  styleUrls: [],
})
export class EditAddressComponent implements OnInit, OnDestroy {
  patients: Patient = new Patient({});
  subscription: Subscription;
  public display: boolean = false;
  private address1: string ;
  private address2: string ;
  private address3: string ;
  private cityVillage: string ;
  private stateProvince: string ;
  private preferredAddressUuid: string;
  private errors: any = [];

  constructor(private patientService: PatientService,
              private personResourceService: PersonResourceService) { }
  ngOnInit(): void {
    this.getPatient();
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
          this.address1 = (this.patients.person.preferredAddress as any).address1;
          this.address2 = (this.patients.person.preferredAddress as any).address2;
          this.address3 = (this.patients.person.preferredAddress as any).address3;
          this.cityVillage = (this.patients.person.preferredAddress as any).cityVillage;
          this.stateProvince = (this.patients.person.preferredAddress as any).stateProvince;
          this.preferredAddressUuid = (this.patients.person.preferredAddress as any).uuid;
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
  public updatePersonAddress() {
    let person = {
      uuid: this.patients.person.uuid
    };
    let personAddressPayload = {
      addresses: [{
        address1: this.address1,
        address2: this.address2,
        address3: this.address3,
        cityVillage: this.cityVillage,
        stateProvince: this.stateProvince,
        uuid: this.preferredAddressUuid,
      }]
    };
    this.personResourceService.saveUpdatePerson(person.uuid, personAddressPayload).subscribe(
      (success) => {
        if ( success ) {
          this.patientService.fetchPatientByUuid(this.patients.person.uuid);
        }
        console.log('success', success);
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





}



