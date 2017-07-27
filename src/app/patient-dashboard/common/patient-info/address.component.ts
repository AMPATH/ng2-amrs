import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'address',
  templateUrl: './address.component.html',
  styleUrls: [],
})
export class AddressComponent implements OnInit, OnDestroy {
  public patients: Patient = new Patient({});
  public subscription: Subscription;
  public address1: string;
  public address2: string;
  public address3: string;
  public cityVillage: string;
  public stateProvince: string;

  constructor(private patientService: PatientService,
  ) { }
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

          if (this.patients.person.preferredAddress !== null) {
            this.address1 = (this.patients.person.preferredAddress as any).address1;
            this.address2 = (this.patients.person.preferredAddress as any).address2;
            this.address3 = (this.patients.person.preferredAddress as any).address3;
            this.cityVillage = (this.patients.person.preferredAddress as any).cityVillage;
            this.stateProvince = (this.patients.person.preferredAddress as any).stateProvince;
          }
        }
      }
    );
  }

}
