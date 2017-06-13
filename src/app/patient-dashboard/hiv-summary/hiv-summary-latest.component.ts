import { Component, OnInit } from '@angular/core';

import { PatientService } from '../patient.service';
import { HivSummaryService } from './hiv-summary.service';
import { Patient } from '../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hiv-summary-latest',
  templateUrl: './hiv-summary-latest.component.html',
  styleUrls: ['./hiv-summary.component.css']
})
export class HivSummaryLatestComponent implements OnInit {
  loadingHivSummary: boolean = false;
  hivSummary: any;
  subscription: Subscription;
  patient: Patient;
  patientUuid: any;
  errors: any = [];

  constructor(private hivSummaryService: HivSummaryService,
    private patientService: PatientService) {}

  ngOnInit() {
    this.getPatient();
  }

  getPatient() {
    this.loadingHivSummary = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.patientUuid = this.patient.person.uuid;
          this.loadHivSummary(this.patientUuid);
        }
      }, (err) => {
        this.loadingHivSummary = false;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  loadHivSummary(patientUuid) {
    this.hivSummaryService.getHivSummary(
      patientUuid, 0, 1, false)
      .subscribe((data) => {
        if (data) {
          this.hivSummary = data[0];
        }
        this.loadingHivSummary = false;
      }, (err) => {
        this.loadingHivSummary = false;
        this.errors.push({
          id: 'Hiv Summary',
          message: 'An error occured while loading Hiv Summary. Please try again.'
        });
      });
  }
}
