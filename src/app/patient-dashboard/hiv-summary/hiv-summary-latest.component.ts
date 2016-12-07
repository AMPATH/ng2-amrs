import { Component, OnInit } from '@angular/core';

import { PatientService } from '../patient.service';
import { HivSummaryService } from './hiv-summary.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'hiv-summary-latest',
  templateUrl: './hiv-summary-latest.component.html',
  styleUrls: ['./hiv-summary.component.css']
})
export class HivSummaryLatestComponent implements OnInit {

  loadingHivSummary: boolean = false;

  hivSummary: any;

  patient: Patient;

  errors: any = [];

  constructor(private hivSummaryService: HivSummaryService,
    private patientService: PatientService) {
  }

  ngOnInit() {

    this.getPatient();
  }

  getPatient() {

    this.loadingHivSummary = true;
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.getHivSummary();
        }
      }, (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  getHivSummary() {

    this.hivSummaryService.hivSummary
      .subscribe((data) => {
        if (data) {
          this.hivSummary = data[0];
          this.loadingHivSummary = false;
        }
      });
  }

}
