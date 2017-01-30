import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';


@Component({
  selector: 'contacts-info',
  templateUrl: 'contacts.component.html',
  styleUrls: []
})
export class ContactsComponent implements OnInit {
  patient: Patient = new Patient({});
  display: boolean = false;
  private nextofkinPhoneNumber: number;
  private patnerPhoneNumber: number;
  private patientPhoneNumber: number;
  private alternativePhoneNumber: number;
  constructor(private patientService: PatientService) {
  }

  ngOnInit() {
    this.getPatient();
  }

  getPatient() {
    this.patientService.currentlyLoadedPatient.subscribe(
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
