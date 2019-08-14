/* tslint:disable:no-inferrable-types */
import { take } from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../../services/patient.service';
import { HivSummaryService } from './hiv-summary.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'hiv-summary-historical',
    templateUrl: './hiv-summary-historical.component.html',
    styleUrls: ['./hiv-summary.component.css']
})
export class HivSummaryHistoricalComponent implements OnInit, OnDestroy {
    public loadingHivSummary: boolean = false;
    public hivSummaries: Array<any> = [];
    public patient: Patient;
    public patientUuid: any;
    public subscription: Subscription[] = [];
    public experiencedLoadingError: boolean = false;
    public dataLoaded: boolean = false;
    public errors: any = [];
    public isLoading: boolean;
    public nextStartIndex: number = 0;
    public hasMedicationRtc = false;

    constructor(private hivSummaryService: HivSummaryService,
        private patientService: PatientService) {
    }

    public ngOnInit() {
        this.getPatient();
    }

    public ngOnDestroy(): void {
        this.subscription.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    public getPatient() {
        this.loadingHivSummary = true;
        const patientSub = this.patientService.currentlyLoadedPatient.subscribe(
            (patient) => {
                if (patient) {
                    this.patient = patient;
                    this.patientUuid = this.patient.person.uuid;
                    this.loadHivSummary(this.patientUuid, this.nextStartIndex);
                }
                this.loadingHivSummary = false;
            }
            , (err) => {
                this.loadingHivSummary = true;
                this.errors.push({
                    id: 'patient',
                    message: 'error fetching patient'
                });
            });
        this.subscription.push(patientSub);
    }

    public loadHivSummary(patientUuid, nextStartIndex) {
        const summarySub = this.hivSummaryService.getHivSummary(
            patientUuid, nextStartIndex, 20, false).subscribe((data) => {
                console.log('data', data);
                if (data) {
                    if (data.length > 0) {
                        for (const r in data) {
                            if (data.hasOwnProperty(r)) {
                                const hivsum = data[r];
                                this.hivSummaries.push(hivsum);
                                if (data[r].hasOwnProperty('med_pickup_rtc_date')) {
                                    if (data[r].med_pickup_rtc_date !== null
                                    && this.hasMedicationRtc === false) {
                                        this.hasMedicationRtc = true;
                                    }
                                }
                            }
                        }
                        const size: number = data.length;
                        this.nextStartIndex = this.nextStartIndex + size;
                        this.isLoading = false;
                    } else {
                        this.dataLoaded = true;
                    }
                }
            }, (err) => {
                this.loadingHivSummary = false;
                this.errors.push({
                    id: 'Hiv Summary',
                    message: 'An error occured while loading Hiv Summary. Please try again.'
                });

            }
            );
        this.subscription.push(summarySub);
    }
    public loadMoreHivSummary() {
        this.isLoading = true;
        this.loadHivSummary(this.patientUuid, this.nextStartIndex);
    }

}
