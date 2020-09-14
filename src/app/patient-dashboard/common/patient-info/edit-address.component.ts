import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { Subscription } from 'rxjs';
import { LocationResourceService } from 'src/app/openmrs-api/location-resource.service';

@Component({
  selector: 'edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: [],
})
export class EditAddressComponent implements OnInit, OnDestroy {
  public patients: Patient = new Patient({});
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
  public locations: any;
  public subcounties: any = [];
  public counties: any = [];
  public wards: any = [];

  constructor(private patientService: PatientService, private locationService: LocationResourceService,
    private personResourceService: PersonResourceService) { }
  public ngOnInit(): void {
    this.getPatient();
  }
  public ngOnDestroy(): void {
    if (this.subscription.length) {
      this.subscription.map(sub => sub.unsubscribe);
    }
  }

  public getPatient() {
    const getLocationSubscription = this.locationService.getAmpathLocations().subscribe(data => {
      this.locations = data;
      console.log(data);
    });
  this.subscription.push(getLocationSubscription);
    const getPatientSubscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patients = new Patient({});
        if (patient) {
          this.patients = patient;
          if (this.patients.person.preferredAddress) {
            this.address1 = (this.patients.person.preferredAddress as any).address1;
            this.address2 = (this.patients.person.preferredAddress as any).address2;
            this.address3 = (this.patients.person.preferredAddress as any).address3;
            this.address7 = (this.patients.person.preferredAddress as any).address7;
            this.cityVillage = (this.patients.person.preferredAddress as any).cityVillage;
            this.latitude = (this.patients.person.preferredAddress as any).latitude;
            this.longitude = (this.patients.person.preferredAddress as any).longitude;
            this.preferredAddressUuid = (this.patients.person.preferredAddress as any).uuid;
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
  }
  public updatePersonAddress() {
    const person = {
      uuid: this.patients.person.uuid
    };
    const personAddressPayload = {
      addresses: [{
        address1: this.address1,
        address2: this.address2,
        address3: this.address3,
        address7: this.address7,
        cityVillage: this.cityVillage,
        latitude: this.latitude,
        longitude: this.longitude,
        uuid: this.preferredAddressUuid,
      }]
    };
    this.personResourceService.saveUpdatePerson(person.uuid, personAddressPayload).subscribe(
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
        console.error('error', error);
        this.errors.push({
          id: 'patient',
          message: 'error updating address'
        });
      }
    );
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
    this.subcounties = counties1.find(county => county.name === event).subcounties;
  }
  public setSubCounty(event) {
    this.address2 = event;
    const subcounties = this.subcounties;
    this.wards = subcounties.find(subcounty => subcounty.name === event).wards;
  }
  public setWard(event) {
    this.address7 = event;
  }
}
