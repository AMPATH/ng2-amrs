
import { take } from 'rxjs/operators/take';
import {
    Component, OnInit, Input, ViewEncapsulation, AfterViewInit, ViewChild
} from '@angular/core';
import { PatientRelationshipTypeService } from './patient-relation-type.service';
import * as _ from 'lodash';
import { PatientRelationshipService } from './patient-relationship.service';
import { PatientService } from '../../services/patient.service';
import { RelationshipType } from '../../../models/relationship-type.model';
import * as Moment from 'moment';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'add-relationship',
    templateUrl: './add-patient-relationship.component.html',
    styleUrls: ['./add-patient-relationship.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddPatientRelationshipComponent implements OnInit, AfterViewInit {
    public display = false;
    public showSuccessAlert = false;
    public showErrorAlert = false;
    public hideResult = false;
    public successAlert: string;
    public errorAlert: string;
    public errorTitle: string;
    public errors: any = [];
    public isLoading = false;
    public patientRelationshipTypes: any = [];
    public selectedRelationshipType: any;
    public patientUuid: string;
    public patientToBindRelationship: any = {
        person: {
            display: ''
        }
    };
    public showScrollMessage: false;
    private subscription: Subscription;
    modalRef: BsModalRef;

    @ViewChild('template')
    public addRelationShipComponent;


    constructor(private patientRelationshipService: PatientRelationshipService,
        private patientRelationshipTypeService: PatientRelationshipTypeService,
        private patientService: PatientService,
        private appFeatureAnalytics: AppFeatureAnalytics,
        private modalService: BsModalService) { }

    ngAfterViewInit(): void {
    }

    public ngOnInit(): void {
        this.getPatient();
        this.selectedRelationshipType = undefined;
        this.appFeatureAnalytics
            .trackEvent('Patient Dashboard', 'Add Patient Relationship Loaded', 'ngOnInit');
    }

    // tslint:disable-next-line:use-life-cycle-interface
    public ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public showDialog() {
        this.hideResult = true;
        this.display = true;
        this.getRelationShipTypes();
        this.modalRef = this.modalService.show(this.addRelationShipComponent);
    }

    public getRelationShipTypes(): void {
        const request = this.patientRelationshipTypeService.getRelationshipTypes();
        request.subscribe((relationshipTypes) => {
            if (relationshipTypes) {
                this.patientRelationshipTypes = relationshipTypes;
            }
        }, (error) => {
            console.error('Failed to get relation types because of the following ', error);
        });
    }

    public getPatient() {
        this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
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
            const patientRelationshipPayload = this.getPatientRelationshipPayload();
            this.patientRelationshipService.saveRelationship(patientRelationshipPayload).pipe(take(1)).subscribe(
                (success) => {
                    if (success) {
                        this.isLoading = false;
                        this.displaySuccessAlert('New relationship saved successfully');
                        this.selectedRelationshipType = undefined;
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
        const startDate = Moment(new Date()).format('YYYY-MM-DD');
        const patientRelationshipPayload = {
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
        this.modalRef.hide();

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
            this.patientService.reloadCurrentPatient();
        }, 3000);
    }

    public displayErrorAlert(errorTitle, errorMessage) {
        this.showErrorAlert = true;
        this.errorAlert = errorMessage;
        this.errorTitle = errorTitle;
    }

    public relativeSelected(patientToBindRelationship) {
        if (patientToBindRelationship) {
            this.patientToBindRelationship = patientToBindRelationship;
            this.hideResult = true;
            this.showScrollMessage = false;
        }
    }
}
