import {
    Component, OnInit, Input, ViewEncapsulation
} from '@angular/core';
import { PatientRelationshipTypeService } from './patient-relation-type.service';
import * as _ from 'lodash';
import { PatientRelationshipService } from './patient-relationship.service';
import { PatientService } from '../patient.service';
import { RelationshipType } from '../../models/relationship-type.model';
import * as Moment from 'moment';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';




@Component({
    selector: 'add-relationship',
    templateUrl: 'add-patient-relationship.component.html',
    styleUrls: ['./add-patient-relationship.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddPatientRelationshipComponent implements OnInit {
    public display: boolean = false;
    private showSuccessAlert: boolean = false;
    private showErrorAlert: boolean = false;
    private successAlert: string;
    private errorAlert: string;
    private errorTitle: string;
    private errors: any = [];
    private isLoading: boolean = false;
    private patientRelationshipTypes: any = [];
    private selectedRelationshipType: any;
    private patientUuid: string;
    private patientToBindRelationship: any = {
        person: {
            display: ''
        }
    };

    constructor(private patientRelationshipService: PatientRelationshipService,
        private patientRelationshipTypeService: PatientRelationshipTypeService,
        private patientService: PatientService,
        private appFeatureAnalytics: AppFeatureAnalytics) { }

    ngOnInit(): void {
        this.getPatient();
        this.selectedRelationshipType = undefined;
        this.appFeatureAnalytics
            .trackEvent('Patient Dashboard', 'Add Patient Relationship Loaded', 'ngOnInit');
    }

    public showDialog() {
        this.display = true;
        this.getRelationShipTypes();
    }

    public getRelationShipTypes(): void {
        let request = this.patientRelationshipTypeService.getRelationshipTypes();
        request.subscribe((relationshipTypes) => {
            if (relationshipTypes) {
                this.patientRelationshipTypes = relationshipTypes;
            }
        }, (error) => {
            console.error('Failed to get relation types because of the following ', error);
        });
    }

    public getPatient() {
        this.patientService.currentlyLoadedPatient.subscribe(
            (patient) => {
                if (patient) {
                    this.patientUuid = patient.person.uuid;
                }
            });
    }

    public saveRelationship() {
        if (this.selectedRelationshipType !== undefined &&
            this.patientToBindRelationship.person.display !== '') {
            this.isLoading = true;
            let patientRelationshipPayload = this.getPatientRelationshipPayload();
            this.patientRelationshipService.saveRelationship(patientRelationshipPayload).subscribe(
                (success) => {
                    if (success) {
                        this.isLoading = false;
                        this.displaySuccessAlert('New relationship saved successfully');
                    }
                }, (error) => {
                    this.isLoading = false;
                    console.error('The request failed because of the following ', error);
                    this.displayErrorAlert('Error!', 'The system encountered an' +
                        ' error while saving relationship');
                });
        }

        if (this.patientToBindRelationship.person.display === '') {
            this.displayErrorAlert('Validation Error!',
                'Please select a person to add relationship');
        }
        if (this.selectedRelationshipType === undefined) {
            this.displayErrorAlert('Validation Error!', 'Please select a relationship type');
        }
        if (this.patientToBindRelationship.person.display === '' &&
            this.selectedRelationshipType === undefined) {
            this.displayErrorAlert('Validation Error!', 'Please make sure you fill the necessary'
                + ' fields before submiting');
        }
    }

    public getPatientRelationshipPayload() {
        let startDate = Moment(new Date()).format('YYYY-MM-DD');
        let patientRelationshipPayload = {
            personA: this.patientUuid,
            relationshipType: this.selectedRelationshipType.uuid,
            personB: this.patientToBindRelationship.uuid,
            startDate: startDate
        };
        return patientRelationshipPayload;
    }

    public cancelRelationship() {
        this.isLoading = false;
        this.display = false;
        this.showErrorAlert = false;
        this.showSuccessAlert = false;
        this.selectedRelationshipType = undefined;
        this.patientToBindRelationship = {
            person: {
                display: ''
            }
        };

    }

    public displaySuccessAlert(message) {
        this.showErrorAlert = false;
        this.showSuccessAlert = true;
        this.successAlert = message;
        setTimeout(() => {
            this.display = false;
            this.showSuccessAlert = false;
            this.selectedRelationshipType = undefined;
            this.patientToBindRelationship = {
                person: {
                    display: ''
                }
            };
            this.patientService.fetchPatientByUuid(this.patientUuid);
        }, 3000);
    }


    public displayErrorAlert(errorTitle, errorMessage) {
        this.showErrorAlert = true;
        this.errorAlert = errorMessage;
        this.errorTitle = errorTitle;
    }

    public getSelectedRelative(patientToBindRelationship) {
        if (patientToBindRelationship) {
            this.patientToBindRelationship = patientToBindRelationship;
        }
    }
}
