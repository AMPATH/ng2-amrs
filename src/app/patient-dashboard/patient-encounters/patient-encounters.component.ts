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
  dataLoading: boolean = false;
  patient: any;
  errors: any = [];

  constructor(private patientEncounterService: PatientEncounterService,
    private patientService: PatientService) { }
  ngOnInit() {
    this.getPatient();
    // load cached result
    this.patientEncounterService.encounterResults.subscribe(
      (data) => {
        this.encounters = data;
      }
    );
  }
  loadPatientEncounters(patientUuid) {
    this.encounters = [];
    let request = this.patientEncounterService
      .getEncountersByPatientUuid(patientUuid)
      .subscribe(
      (data) => {
        this.encounters = data;
        this.isVisible = false;
        this.dataLoading = false;
      },

      (err) => {
        this.dataLoading = false;
        this.errors.push({
          id: 'visit',
          message: 'error fetching visit'
        });
      });
  }
  getPatient() {
    this.dataLoading = true;
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
