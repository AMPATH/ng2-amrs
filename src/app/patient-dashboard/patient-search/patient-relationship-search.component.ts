import {
    Component, OnInit, ViewEncapsulation,
    ViewChild, EventEmitter, Output, OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';

import { PatientSearchService } from './patient-search.service';
import { Patient } from '../../models/patient.model';
import * as _ from 'lodash';
import { PatientRelationshipService } from '../patient-relationships/patient-relationship.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Subscription } from 'rxjs';
import { Person } from '../../models/person.model';

@Component({
    selector: 'patient-relationship-search',
    templateUrl: './patient-relationship-search.component.html',
    styleUrls: ['./patient-relationship-search.component.css']
})

export class PatientRelationshipSearchComponent implements OnInit, OnDestroy {
    searchString: string;
    patients: Patient[];
    isResetButton: boolean = true;
    totalPatients: number;
    isLoading: boolean = false;
    page: number = 1;
    patientToBindRelationship: any;
    @Output() onPatientToBindRelationship = new EventEmitter();
    subscription: Subscription;
    searchPanelVisible: boolean = false;
    adjustInputMargin: string = '225px';
    public errorMessage: string;

    constructor(private patientSearchService: PatientSearchService, private router: Router,
        private patientRelationshipService: PatientRelationshipService) {
    }


    ngOnInit() {
        // load cached result
        this.patientSearchService.patientsToBindRelationshipSearchResults.subscribe(
            (patients) => {
                this.patients = patients;
                this.searchString = this.patientSearchService.relationshipSearchString;
                this.totalPatients = this.patients.length;
            }
        );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }


    loadPatient(): void {
        this.searchPanelVisible = true;
        this.totalPatients = 0;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.searchString && this.searchString.length > 2) {
            if (window.innerWidth > 768) {
                this.adjustInputMargin = '252px';
            }
            this.isLoading = true;
            this.patients = [];
            this.subscription = this.patientSearchService
                .searchPatientToBindRelationship(this.searchString, false)
                .subscribe(
                (data) => {
                    if (data.length > 0) {
                        this.patients = data;
                        this.totalPatients = this.patients.length;
                        this.isLoading = false;
                        this.resetInputMargin();
                    }
                    this.isLoading = false;
                    this.resetInputMargin();

                },
                (error) => {
                    this.isLoading = false;
                    this.resetInputMargin();
                    console.log('error', error);
                    this.errorMessage = error;
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

    loadPatientData(patientUuid) {
        if (patientUuid === undefined || patientUuid === null) {
            return;
        }

        this.router.navigate(['/patient-dashboard/' + patientUuid + '/patient-info']);

    }

    selectPatient(patientUuid) {
        this.patientToBindRelationship = _.find(this.patients, function (patient) {
            if (patient.uuid === patientUuid) {
                return patient;
            }
        });
        this.onPatientToBindRelationship.emit(this.patientToBindRelationship);
        this.searchPanelVisible = false;
    };



    resetSearchList() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.patientSearchService.resetRelationshipSearch();
        this.searchString = '';
        this.totalPatients = 0;
        this.isResetButton = false;
        this.searchPanelVisible = false;
        this.isLoading = false;
        this.resetInputMargin();
        this.patientToBindRelationship = {
            person: {
                display: ''
            }
        };
        this.onPatientToBindRelationship.emit(this.patientToBindRelationship);
    }

    public tooltipStateChanged(state: boolean): void {
        // console.log(`Tooltip is open: ${state}`);
    }

    public resetInputMargin() {
        if (window.innerWidth > 768) {
            this.adjustInputMargin = '225px';
        }
    }
}
