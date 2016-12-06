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

    constructor(private hivSummaryService: HivSummaryService,
        private patientService: PatientService) {
    }

    ngOnInit() {

        this.getPatient();
        this.hivSummaryService.allDataLoaded.subscribe(
            (status) => {
                if (status) {
                    this.dataLoaded = true;
                    this.loadingHivSummary = false;
                }
            }
        );
    }

    getPatient() {

        this.loadingHivSummary = true;
        this.patientService.currentlyLoadedPatient.subscribe(
            (patient) => {
                if (patient) {
                    this.patient = patient;
                    this.patientUuid = patient.person.uuid;
                    this.loadHivSummary();

                }
            }
            , (err) => {

                this.errors.push({
                    id: 'patient',
                    message: 'error fetching patient'
                });
            });
    }

    loadHivSummary(): void {

        this.hivSummaryService.getHivSummary(
            this.patientUuid)
            .subscribe((data) => {
                if (data) {
                    let size: number = data.length;
                    this.hivSummaries = data;
                }
                this.loadingHivSummary = false;

            }, (err) => {
                this.loadingHivSummary = false;
                // all data loaded
                this.dataLoaded = true;
                this.errors.push({
                    id: 'Hiv Summary',
                    message: 'An error occured while loading Hiv Summary. Please try again.'
                });

            }
            );
    }
}
