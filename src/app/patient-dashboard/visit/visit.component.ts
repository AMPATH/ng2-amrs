import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as Moment from 'moment';
import { VisitResourceService } from '../../openmrs-api/visit-resource.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { PatientService } from '../patient.service';
import {
    UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { Subscription, Observable } from 'rxjs';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
@Component({
    selector: 'visit',
    templateUrl: 'visit.component.html',
    styleUrls: ['visit.component.css']
})
export class VisitComponent implements OnInit, OnDestroy {
    visitTypes = [];
    excludedForms = [];
    visit: any;
    visitWithNoEncounters: boolean = true;
    patient: any;
    subscription: Subscription;
    errors: any = [];
    loadingVisitTypes: Boolean;
    confirmCancel: boolean;
    confirmEndVisit: boolean;
    showDialog: boolean = false;
    visitBusy: Boolean;
    iseditLocation: boolean = false;
    constructor(private visitResourceService: VisitResourceService,
        private userDefaultPropertiesService: UserDefaultPropertiesService,
        private patientService: PatientService, private router: Router,
        private appFeatureAnalytics: AppFeatureAnalytics,
        private route: ActivatedRoute,
        private encounterResourceService: EncounterResourceService) { }

    ngOnInit() {
        this.getPatient();
        // app feature analytics
        this.appFeatureAnalytics
            .trackEvent('Patient Dashboard', 'Patient Visits Loaded', 'ngOnInit');
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    locationChanges(edit) {
        this.iseditLocation = edit;
    }
    getVisit(patientUuid) {
        this.visitBusy = true;
        this.visitResourceService.getPatientVisits({ patientUuid: patientUuid })
            .map(this.getLastVisit)
            .subscribe((visit) => {
                this.visitBusy = false;
                if (visit) {
                    this.visit = visit;
                    if (visit.encounters && visit.encounters.length > 0)
                        this.visitWithNoEncounters = false;
                    this.excludedForms = visit.encounters.map((a) => {
                        return a.encounterType.uuid;
                    });
                } else {
                    this.getVisitTypes();
                }
            }, (err) => {
                this.visitBusy = false;
                this.errors.push({
                    id: 'visit',
                    message: 'error fetching visit'
                });
            });
    }

    getPatient() {
        this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
            (patient) => {
                if (patient !== null) {
                    this.patient = patient;
                    this.getVisit(patient.person.uuid);
                }
            }
            , (err) => {
                this.errors.push({
                    id: 'patient',
                    message: 'error fetching patient'
                });
            });
    }

    getVisitTypes() {
        this.loadingVisitTypes = true;
        this.visitResourceService.getVisitTypes({}).subscribe(
            (visitTypes) => {
                this.visitTypes = visitTypes;
                this.loadingVisitTypes = false;
            }
            , (err) => {
                this.loadingVisitTypes = false;
                this.errors.push({
                    id: 'visitTypes',
                    message: 'error fetching visit types'
                });
            });
    }

    editLocation() {
        this.iseditLocation = !this.iseditLocation;

    }
    startVisit(visitTypeUuid) {
        let location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
        this.visitBusy = true;
        let visitPayload = {
            patient: this.patient.person.uuid,
            location: location.uuid,
            startDatetime: new Date(),
            visitType: visitTypeUuid
        };
        this.visitResourceService.saveVisit(visitPayload).subscribe((response) => {
            this.visitBusy = false;
            this.visit = response;
        }, (err) => {
            this.visitBusy = false;
            console.log(err);
            this.errors.push({
                id: 'startVisit',
                message: 'error stating visit'
            });
        });

    }

    endVisit() {
        this.showDialog = true;
        this.confirmEndVisit = true;
    }

    cancelVisit() {
        this.showDialog = true;
        this.confirmCancel = true;
    }

    onYes() {
        if (this.confirmCancel) {
            this.onCancelVisit();
        } else if (this.confirmEndVisit) {
            this.onEndVisit();
        }
    }

    onNo() {
        this.showDialog = false;
        this.confirmCancel = false;
        this.confirmEndVisit = false;
    }

    onEndVisit() {

        this.visitBusy = true;
        this.visitResourceService.updateVisit(this.visit.uuid,
            { stopDatetime: new Date() }).subscribe(
            (visit) => {
                this.visitBusy = false;
                this.showDialog = false;
                this.confirmEndVisit = false;
                this.visit = null;
                this.getVisit(this.patient.person.uuid);
            }
            , (err) => {
                this.visitBusy = false;
                this.showDialog = false;
                this.confirmEndVisit = false;
                this.errors.push({
                    id: 'endVisit',
                    message: 'error ending visit'
                });
            });
    }

    onCancelVisit() {
        this.visitBusy = true;

        if (!this.visit) {
            return null;
        }

        this.visitResourceService.updateVisit(this.visit.uuid,
            { voided: true }).subscribe(
            (visit) => {
                this.voidVisitEncounters(this.visit.uuid);
                this.visit = null;
                this.getVisit(this.patient.person.uuid);
                this.visitBusy = false;
                this.showDialog = false;
                this.confirmCancel = false;
            }
            , (err) => {
                this.visitBusy = false;
                this.showDialog = false;
                this.confirmCancel = false;
                this.errors.push({
                    id: 'cancelVisit',
                    message: 'error cancelling visit'
                });
            });
    }
    formSelected(form) {
        if (form) {
            this.router.navigate(['../formentry', form.uuid],
                {
                    relativeTo: this.route,
                    queryParams: { visitUuid: this.visit.uuid }
                });
        }
    }
    encounterSelected(encounter) {
        if (encounter) {
            this.router.navigate(['../formentry', encounter.form.uuid], {
                relativeTo: this.route,
                queryParams: { encounter: encounter.uuid }
            });
        }
    }

    private getLastVisit(visits: any[]) {
        let filtered = visits.filter((visit) => {
            let today = Moment().format('l');
            let visitDate = Moment(visit.startDatetime).format('l');
            return today === visitDate;
        });
        return filtered[0];
    }

    private voidVisitEncounters(visitUuid) {
        if (!visitUuid) {
            return null;
        }
        this.visitResourceService.getVisitEncounters(visitUuid).subscribe(
            (visitEncounters) => {
                if (visitEncounters && visitEncounters.length > 0) {
                    let observableBatch: Array<Observable<any>> = [];
                    for (let encounter of visitEncounters) {
                        observableBatch.push(
                            this.encounterResourceService.voidEncounter(encounter.uuid)
                        );
                    }

                    // forkjoin all requests
                    this.subscription = Observable.forkJoin(
                        observableBatch
                    ).subscribe(
                        data => {
                            console.log('Voided Encounters');
                        },
                        err => {
                            this.errors.push({
                                id: 'cancelVisit',
                                message: 'error voiding visit encounters'
                            });
                        }
                        );
                }
            }
            , (err) => {
                this.errors.push({
                    id: 'cancelVisit',
                    message: 'error voiding visit encounters'
                });
            });
    }
}
