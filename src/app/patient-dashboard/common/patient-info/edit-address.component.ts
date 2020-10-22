import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import {
  CountyData,
  LocationResourceService,
  SubcountyData
} from '../../../openmrs-api/location-resource.service';

@Component({
  selector: 'edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: []
})
export class EditAddressComponent implements OnInit, OnDestroy {
  public patient: Patient = new Patient({});
  public subscription: Subscription[] = [];
  public display = false;
  public address1: string;
  public address2: string;
  public address3: string;
  public address7: string;
  public latitude: string;
  public longitude: string;
  public cityVillage: string;
  public preferredAddressUuid: string;
  public errors: any = [];
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public errorTitle: string;
  public successAlert = '';
  public administrativeUnits: Record<string, CountyData[]> = {};
  public subcounties: SubcountyData[] = [];
  public counties: CountyData[] = [];
  public wards: string[] = [];

  constructor(
    private patientService: PatientService,
    private locationService: LocationResourceService,
    private personResourceService: PersonResourceService
  ) {}

  public ngOnInit(): void {
    this.getPatient();
  }

  public ngOnDestroy(): void {
    if (this.subscription.length) {
      this.subscription.map((sub) => sub.unsubscribe);
    }
  }

  public getPatient() {
    const getLocationSubscription = this.locationService
      .getAdministrativeUnits()
      .subscribe((administrativeUnits) => {
        this.counties = administrativeUnits.counties;
      });
    this.subscription.push(getLocationSubscription);
    const getPatientSubscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          if (this.patient.person.preferredAddress) {
            this.address1 = (this.patient.person
              .preferredAddress as any).address1;
            this.address2 = (this.patient.person
              .preferredAddress as any).address2;
            this.address3 = (this.patient.person
              .preferredAddress as any).address3;
            this.address7 = (this.patient.person
              .preferredAddress as any).address7;
            this.cityVillage = (this.patient.person
              .preferredAddress as any).cityVillage;
            this.latitude = (this.patient.person
              .preferredAddress as any).latitude;
            this.longitude = (this.patient.person
              .preferredAddress as any).longitude;
            this.preferredAddressUuid = (this.patient.person
              .preferredAddress as any).uuid;
          }
          if (this.address1 && this.counties.length) {
            this.subcounties = this.counties.find(
              (county) => county.name === this.address1
            ).subcounties;
          }
          if (this.address2 && this.subcounties.length) {
            this.wards = this.subcounties.find(
              (subcounty) => subcounty.name === this.address2
            ).wards;
          }
        }
      }
    );
    this.subscription.push(getPatientSubscription);
  }

  public showDialog() {
    this.display = true;
  }

  public dismissDialog() {
    this.display = false;
    this.resetState();
  }

  public updatePersonAddress() {
    const person = {
      uuid: this.patient.person.uuid
    };
    const personAddressPayload = {
      addresses: [
        {
          address1: this.address1,
          address2: this.address2,
          address3: this.address3,
          address7: this.address7,
          cityVillage: this.cityVillage,
          latitude: this.latitude,
          longitude: this.longitude,
          uuid: this.preferredAddressUuid
        }
      ]
    };
    this.personResourceService
      .saveUpdatePerson(person.uuid, personAddressPayload)
      .subscribe(
        (res) => {
          if (res) {
            this.displaySuccessAlert('Address saved successfully');
            setTimeout(() => {
              this.display = false;
              this.patientService.reloadCurrentPatient();
            }, 2000);
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
  }

  public setCounty(countyName) {
    this.address1 = countyName;
    this.subcounties = this.counties.find(
      (county) => county.name === countyName
    ).subcounties;
  }

  public setSubCounty(subcountyName) {
    this.address2 = subcountyName;
    this.wards = this.subcounties.find(
      (subcounty) => subcounty.name === subcountyName
    ).wards;
  }

  public setWard(wardName) {
    this.address7 = wardName;
  }

  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 1000);
  }

  private resetState() {
    this.counties = [];
    this.subcounties = [];
    this.wards = [];
  }
}
