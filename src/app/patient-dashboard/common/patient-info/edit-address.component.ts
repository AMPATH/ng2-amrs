import { Component, OnInit, OnDestroy } from '@angular/core';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';

@Component({
  selector: 'edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: []
})
export class EditAddressComponent implements OnInit, OnDestroy {
  public patient: Patient = new Patient({});
  public subscriptions: Subscription[] = [];
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
  public locations: any;
  public subcounties: any = [];
  public counties: any = [];
  public wards: any = [];
  public nonCodedCounty = false;

  constructor(
    private patientService: PatientService,
    private locationService: LocationResourceService,
    private locationResourceService: LocationResourceService,
    private personResourceService: PersonResourceService
  ) {}

  public ngOnInit(): void {
    this.getPatient();
    this.getLocations();
  }

  public ngOnDestroy(): void {
    if (this.subscriptions.length) {
      this.subscriptions.map((sub) => sub.unsubscribe);
    }
  }

  public getPatient() {
    // const getLocationSubscription = this.locationService
    //   .getAmpathLocations()
    //   .subscribe((data) => {
    //     this.locations = data;
    //     console.log(data);
    //   });
    // this.subscription.push(getLocationSubscription);
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
        }
      }
    );
    this.subscriptions.push(getPatientSubscription);
  }

  private getLocations(): void {
    const locationResourceServiceSub = this.locationResourceService
      .getLocations()
      .pipe(take(1))
      .subscribe(
        (locations: any[]) => {
          this.locations = [];
          const counties = [];
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < locations.length; i++) {
            this.locations.push({
              label: locations[i].name,
              value: locations[i].uuid
            });
            counties.push(locations[i].stateProvince);
          }
          console.log('counties: ', counties);
          this.counties = _.uniq(counties);
          this.counties = _.remove(this.counties, (n) => {
            return n !== null || n === '';
          });
          this.counties.push('Other');
        },
        (error: any) => {
          console.error(error);
        }
      );

    this.subscriptions.push(locationResourceServiceSub);
  }

  public updateLocation(location) {
    if (location === 'Other') {
      this.nonCodedCounty = true;
      this.address1 = '';
    } else {
      this.nonCodedCounty = false;
    }
  }

  public showDialog() {
    this.display = true;
  }

  public dismissDialog() {
    this.display = false;
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
    const saveUpdatePersonSub = this.personResourceService
      .saveUpdatePerson(person.uuid, personAddressPayload)
      .subscribe(
        (success) => {
          if (success) {
            this.displaySuccessAlert('Address saved successfully');
            setTimeout(() => {
              this.display = false;
              this.patientService.reloadCurrentPatient();
            }, 2000);
          }
        },
        (error) => {
          console.error('Error updating addresses: ', error);
          this.errors.push({
            id: 'patient',
            message: 'error updating address'
          });
        }
      );

    this.subscriptions.push(saveUpdatePersonSub);
  }

  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 1000);
  }

  public setCounty(event) {
    this.address1 = event;
    const counties1 = this.locations.counties;
    this.subcounties = counties1.find(
      (county) => county.name === event
    ).subcounties;
  }

  public setSubCounty(event) {
    this.address2 = event;
    const subcounties = this.subcounties;
    this.wards = subcounties.find(
      (subcounty) => subcounty.name === event
    ).wards;
  }

  public setWard(event) {
    this.address7 = event;
  }
}
