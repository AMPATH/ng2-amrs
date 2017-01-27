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

    patientUuid: any;

    experiencedLoadingError: boolean = false;

    dataLoaded: boolean = false;

    errors: any = [];
    isLoading: boolean;
    nextStartIndex: number = 0;
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
                    this.patientUuid = this.patient.person.uuid;
                    this.loadHivSummary(this.patientUuid, this.nextStartIndex );

                }
            }
            , (err) => {

                this.errors.push({
                    id: 'patient',
                    message: 'error fetching patient'
                });
            });
    }

    loadHivSummary(patientUuid, nextStartIndexs) {

        this.hivSummaryService.getHivSummary(
          patientUuid, this.nextStartIndex, 20, false)
            .subscribe((data) => {
                if (data) {
                  if (data.length > 0) {
                    for (let r in data) {
                      if (data.hasOwnProperty(r)) {
                        let hivsum = data[r];
                        this.hivSummaries.push(hivsum);
                      }

                    }
                    let size: number = data.length;
                    this.nextStartIndex = this.nextStartIndex + size;
                    this.isLoading = false;
                  } else {
                     this.dataLoaded = true;
                  }
                }
            }, (err) => {
                this.loadingHivSummary = false;
                // all data loaded
               // this.dataLoaded = true;
                this.errors.push({
                    id: 'Hiv Summary',
                    message: 'An error occured while loading Hiv Summary. Please try again.'
                });

            }
            );
    }
    loadMoreHivSummary() {
      this.isLoading = true;
      this.loadHivSummary(this.patientUuid, this.nextStartIndex);
    }
}
