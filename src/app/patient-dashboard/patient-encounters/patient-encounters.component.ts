import { Component, OnInit, ViewChild } from '@angular/core';

import { PatientEncounterService } from './patient-encounters.service';
import { Encounter } from '../../models/encounter.model';

@Component({
  selector: 'app-patient-encounters',
  templateUrl: './patient-encounters.component.html',
  styleUrls: ['./patient-encounters.component.css']

})
export class PatientEncountersComponent implements OnInit {

  public encounters: Encounter[];
  messageType: string;
  message: string;
  isVisible: boolean;

  constructor(private patientEncounterService: PatientEncounterService) { }
  loadPatientEncounters(patientuuid: string): void {
    let request = this.patientEncounterService.getEncountersByPatientUuid('uuid')
      .subscribe(
      (value) => {
        this.encounters = value;
        this.isVisible = false;
      },

      (error) => {
        this.messageType = 'error';
        this.message = 'There is a problem loading Encounters. Click me to reload...';
        this.isVisible = true;
      });
  }

  ngOnInit(): void {
    this.loadPatientEncounters('uuid');
  }
}
