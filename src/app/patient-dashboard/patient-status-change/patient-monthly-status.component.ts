import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import * as Moment from 'moment';
import { PatientCareStatusResourceService } from
    '../../etl-api/patient-care-status-resource.service';
import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';

@Component({
    selector: 'patient-monthly-status',
    templateUrl: 'patient-monthly-status.component.html',
})

export class PatientMonthlyStatusComponent implements OnInit, OnDestroy {
    patient: Patient = new Patient({});
    loadingHistory = true;
    historySubscription: Subscription;
    subscription: Subscription;
    careStatusHistory = [];
    statusMap = {
        active_return: 'Active',
        new_enrollment: 'New Enrollment',
        transfer_in: 'Transferred In',
        LTFU: 'LTFU',
        transfer_out: 'Transferred Out',
        dead: 'Dead',
        HIV_negative: 'HIV negative',
        self_disengaged: 'Self Disengaged',
        node: 'None'
    };
    error = false;
    constructor(private patientService: PatientService,
        private patientCareStatusResourceService: PatientCareStatusResourceService) { }

    ngOnInit() {
        this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
            (patient) => {
                this.patient = new Patient({});
                if (patient) {
                    this.patient = patient;
                    this.getCareStatusHistory();
                }
            }
        );
    }
    ngOnDestroy(): void {
        this.resetSubscriptions();
    }
    getCareStatusHistory() {
        if (this.patient) {
            let endDate = Moment().format('YYYY-MM-DD');
            let startDate = Moment().subtract(12, 'months').format('YYYY-MM-DD');
            this.loadingHistory = true;
            this.historySubscription = this.patientCareStatusResourceService.
                getMonthlyPatientCareStatus({
                    startDate: startDate,
                    endDate: endDate, patient_uuid: this.patient.uuid
                }).subscribe((result) => {
                    this.loadingHistory = false;
                    this.careStatusHistory = result.result;

                    if (Array.isArray(this.careStatusHistory)) {
                        this.careStatusHistory = this.careStatusHistory.reverse();
                    }
                }, (error) => {
                    this.loadingHistory = false;
                    this.error = true;
                });
        }
    }

    private resetSubscriptions() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.historySubscription) {
            this.historySubscription.unsubscribe();
        }
    }
}
