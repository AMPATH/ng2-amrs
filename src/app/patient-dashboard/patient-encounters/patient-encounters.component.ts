import { Component, OnInit, ViewChild } from '@angular/core';

import { PatientEncounterService } from './patient-encounters.service';
import { Encounter } from '../../models/encounter.model';
import { Subscription } from 'rxjs';
import { PatientService } from '../patient.service';



@Component({
  selector: 'app-patient-encounters',
  templateUrl: './patient-encounters.component.html',
  styleUrls: ['./patient-encounters.component.css']

})
export class PatientEncountersComponent implements OnInit {

  encounters: Encounter[];
  messageType: string;
  message: string;
  isVisible: boolean;
  busy: Subscription;
  patient: any;
  errors: any = [];

  constructor(private patientEncounterService: PatientEncounterService,
    private patientService: PatientService) { }
      ngOnInit() {
    this.getPatient();
  }
  loadPatientEncounters(patientUuid) {
    this.encounters = [];
    this.busy = this.patientEncounterService
      .getEncountersByPatientUuid(patientUuid)
      .subscribe(
      (data) => {
        console.log('Encounters', data);
        this.encounters = data.reverse();
        this.isVisible = false;
      },

      (err) => {
        this.errors.push({
          id: 'visit',
          message: 'error fetching visit'
        });
      });
  }
  getPatient() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          this.loadPatientEncounters(patient.person.uuid);
        }
      }
      , (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }
}
