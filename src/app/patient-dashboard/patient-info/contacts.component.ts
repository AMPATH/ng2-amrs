import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'contacts-info',
  templateUrl: 'contacts.component.html',
  styleUrls: []
})
export class ContactsComponent implements OnInit, OnDestroy {
  patient: Patient = new Patient({});
  display: boolean = false;
  subscription: Subscription;
  private nextofkinPhoneNumber: number;
  private patnerPhoneNumber: number;
  private patientPhoneNumber: number;
  private alternativePhoneNumber: number;
  constructor(private patientService: PatientService) {
  }

  ngOnInit() {
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
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.nextofkinPhoneNumber = patient.person.nextofkinPhoneNumber;
          this.patnerPhoneNumber = patient.person.patnerPhoneNumber;
          this.patientPhoneNumber = patient.person.patientPhoneNumber;
          this.alternativePhoneNumber = patient.person.alternativePhoneNumber;
        }
      }
    );
  }

}
