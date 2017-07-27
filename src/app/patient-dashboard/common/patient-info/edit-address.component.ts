import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: [],
})
export class EditAddressComponent implements OnInit, OnDestroy {
  public patients: Patient = new Patient({});
  public subscription: Subscription;
  public display: boolean = false;
  public address1: string;
  public address2: string;
  public address3: string;
  public cityVillage: string;
  public stateProvince: string;
  public preferredAddressUuid: string;
  public errors: any = [];
  public showSuccessAlert: boolean = false;
  public showErrorAlert: boolean = false;
  public errorAlert: string;
  public errorTitle: string;
  public successAlert: string = '';

  constructor(private patientService: PatientService,
              private personResourceService: PersonResourceService) { }
  public ngOnInit(): void {
    this.getPatient();
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
          if (this.patients.person.preferredAddress) {
            this.address1 = (this.patients.person.preferredAddress as any).address1;
            this.address2 = (this.patients.person.preferredAddress as any).address2;
            this.address3 = (this.patients.person.preferredAddress as any).address3;
            this.cityVillage = (this.patients.person.preferredAddress as any).cityVillage;
            this.stateProvince = (this.patients.person.preferredAddress as any).stateProvince;
            this.preferredAddressUuid = (this.patients.person.preferredAddress as any).uuid;
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
        if (success) {
          this.displaySuccessAlert('Address saved successfully');
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
    setTimeout(() => {
      this.display = false;
    }, 1000);
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
