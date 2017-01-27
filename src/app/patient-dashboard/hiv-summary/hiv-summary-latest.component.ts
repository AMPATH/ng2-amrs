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

    this.loadingHivSummary = true;
    this.getHivSummary();
  }
  getHivSummary() {

    this.hivSummaryService.hivSummaryLatest
      .subscribe((data) => {
        if (data) {
          this.hivSummary = data[0];
        }
      });
  }

}
