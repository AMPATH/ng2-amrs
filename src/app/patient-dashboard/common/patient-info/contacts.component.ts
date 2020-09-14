import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'contacts-info',
  templateUrl: './contacts.component.html',
  styleUrls: []
})
export class ContactsComponent implements OnInit, OnDestroy {
  public patient: Patient = new Patient({});
  public display = false;
  public subscription: Subscription;
  private nextofkinPhoneNumber: number;
  private patnerPhoneNumber: number;
  private patientPhoneNumber: number;
  private alternativePhoneNumber: number;
  private careGivername: string;
  private relationshipToCareGiver: string;
  private careGiverPhoneNumber: number;
  constructor(private patientService: PatientService) {
  }

  public ngOnInit() {
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
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.nextofkinPhoneNumber = patient.person.nextofkinPhoneNumber;
          this.patnerPhoneNumber = patient.person.patnerPhoneNumber;
          this.patientPhoneNumber = patient.person.patientPhoneNumber;
          this.alternativePhoneNumber = patient.person.alternativePhoneNumber;
          this.careGivername = patient.person.caregiverName;
          this.relationshipToCareGiver = patient.person.relationshipToCaregiver;
          this.careGiverPhoneNumber = patient.person.caregiverPhoneNumber;
        }
      }
    );
  }

}
