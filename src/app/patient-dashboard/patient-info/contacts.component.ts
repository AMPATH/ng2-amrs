import { Component, OnInit } from '@angular/core';

import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';


@Component({
  selector: 'contacts-info',
  templateUrl: 'contacts.component.html',
  styleUrls: []
})
export class ContactsComponent implements OnInit {
  patient: Patient = new Patient({});
  constructor(private patientService: PatientService) {
  }

  ngOnInit() {
    this.getPatient();
  }
  getPatient() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
        }
      }
    );
  }

}
