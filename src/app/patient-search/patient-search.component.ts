import { Component, OnInit, OnDestroy, DoCheck, Output, EventEmitter } from '@angular/core';

import { PatientSearchService } from './patient-search.service';
import { Patient } from '../models/patient.model';
import { Subscription } from 'rxjs';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
@Component({
    selector: 'patient-search',
    templateUrl: './patient-search.component.html',
    styleUrls: ['./patient-search.component.css'],
})

export class PatientSearchComponent implements OnInit, OnDestroy {
    @Output()
    public patientSelected: EventEmitter<Patient> = new EventEmitter<Patient>();
    patients: Patient[];
    isResetButton: boolean = true;
    totalPatients: number;
    isLoading: boolean = false;
    hasConductedSearch = false;
    page: number = 1;
    patientSearchSub: Subscription;
    public errorMessage: string = '';

    private _searchString: string;
    public get searchString(): string {
        return this._searchString;
    }
    public set searchString(v: string) {
        this._searchString = v;
        this.hasConductedSearch = false;
    }


    constructor(private patientSearchService: PatientSearchService,
        private appFeatureAnalytics: AppFeatureAnalytics) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        if (this.patientSearchSub) {
            this.patientSearchSub.unsubscribe();
        }
    }

    loadCachedResults() {
        // load cached result
        this.errorMessage = '';
        this.patientSearchService.patientsSearchResults.subscribe(
            (patients) => {
                this.onResultsFound(patients);
            },
            (error) => {
                this.onError(error);
            }
        );
    }

    onResultsFound(results) {
        // console.error('res', results);
        if (results.length > 0) {
            this.patients = results;
            this.totalPatients = this.patients.length;
        } else {
            this.patients = [];
            this.totalPatients = 0;
        }
        this.searchString = this.patientSearchService.searchString;
        this.hasConductedSearch = true;
    }

    onError(error) {
        this.isLoading = false;
        console.log('error', error);
        this.errorMessage = error;
        this.hasConductedSearch = false;
    }

    loadPatient(): void {
        this.totalPatients = 0;
        if (this.patientSearchSub) {
            this.patientSearchSub.unsubscribe();
        }
        if (this.searchString && this.searchString.length > 2) {
            this.isLoading = true;
            this.patients = [];
            this.errorMessage = '';
            this.patientSearchSub =
                this.patientSearchService.searchPatient(this.searchString, false)
                    .subscribe(
                    (data) => {
                        this.isLoading = false;
                        this.onResultsFound(data);
                        // app feature analytics
                        this.appFeatureAnalytics
                            .trackEvent('Patient Search', 'Patients Searched', 'loadPatient');

                    },
                    (error) => {
                        this.onError(error);
                    }
                    );

            this.isResetButton = true;
        }
    }

    updatePatientCount(search) {
        if (this.totalPatients > 0 && search.length > 0) {
            this.totalPatients = 0;

        }
    }

    loadPatientData(patient) {
        this.patientSelected.next(patient);
    }


    resetSearchList() {
        this.patientSearchService.resetPatients();
        this.searchString = '';
        this.totalPatients = 0;
        this.isResetButton = false;
        this.isLoading = false;
        this.hasConductedSearch = false;
    }

    public tooltipStateChanged(state: boolean): void {
        // console.log(`Tooltip is open: ${state}`);
    }

}
