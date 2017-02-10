import { Component, OnInit, Input } from '@angular/core';
import * as Moment from 'moment';

import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'patient-banner',
  templateUrl: 'patient-banner.component.html',
  styleUrls: ['patient-banner.component.css']
})

export class PatientBannerComponent implements OnInit {

  patient: Patient  = new Patient({});
  searchIdentifiers: Object;
  birthdate;

  constructor(private patientService: PatientService) { }

  ngOnInit() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.searchIdentifiers = patient.searchIdentifiers;
          this.birthdate = Moment(patient.person.birthdate).format('l');
        }
      }
    );
  }

}

