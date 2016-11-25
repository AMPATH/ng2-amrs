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

    this.getHivSummary();
  }

  getHivSummary() {
    this.loadingHivSummary = true;
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          this.hivSummaryService.hivSummary
          .subscribe((data) => {
              if (data) {
                this.loadingHivSummary = false;
                this.hivSummary = data[0];
              }
            });
        }
      }
      , (err) => {
        this.loadingHivSummary = false;
        this.errors.push({
          id: 'patient',
          message: 'error fetching Hiv Summary'
        });
      });
  }

}
