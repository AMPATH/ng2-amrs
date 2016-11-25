import { Component, OnInit } from '@angular/core';

import { PatientService } from '../patient.service';
import { HivSummaryService } from './hiv-summary.service';
import { Patient } from '../../models/patient.model';
import { Helpers } from '../../utils/helpers';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Component({
  selector: 'hiv-summary-historical',
  templateUrl: './hiv-summary-historical.component.html',
  styleUrls: ['./hiv-summary.component.css']
})
export class HivSummaryHistoricalComponent implements OnInit {

  loadingHivSummary: boolean = false;

  hivSummaries: Array<any> = [];

  patient: Patient;

  experiencedLoadingError: boolean = false;

  dataLoaded: boolean = false;

  errors: any = [];

  constructor(private hivSummaryService: HivSummaryService,
    private patientService: PatientService) {
  }

  ngOnInit() {
    this.loadHivSummary(true);
  }

  loadHivSummary(isCached: boolean): void {
    this.loadingHivSummary = true;
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.hivSummaryService.getHivSummary(
            this.patient.uuid,isCached )
            .subscribe((data) => {
              if (data) {
                let size: number = data.length;
                this.loadingHivSummary = false;
                this.hivSummaries = data;
              }

            }, (err) => {
              this.loadingHivSummary = false;
              this.experiencedLoadingError = true;
              // all data loaded
              this.dataLoaded = true;
            }
            );
        }
      },
      (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      },
      () => {
        // all data loaded
        this.dataLoaded = true;
      }

    );
  }

}
