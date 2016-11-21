import { Component, OnInit, ViewChild } from '@angular/core';

import { PatientEncounterService } from './patient-encounters.service';
import { Encounter } from '../../models/encounter.model';
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
  isBusy: boolean;
  patient: any;
  errors: any = [];

  constructor(private patientEncounterService: PatientEncounterService,
    private patientService: PatientService) { }
  ngOnInit() {
    this.getPatient();
    // load cached result
    this.patientEncounterService.encounterResults.subscribe(
      (data) => {
        this.encounters = data.reverse();
      }
    );
  }
  loadPatientEncounters(patientUuid) {
    this.encounters = [];
    let request = this.patientEncounterService
      .getEncountersByPatientUuid(patientUuid)
      .subscribe(
      (data) => {
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
    this.isBusy = true;
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          this.loadPatientEncounters(patient.person.uuid);
          this.isBusy = false;
        }
      }
      , (err) => {
        this.isBusy = false;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }
}
