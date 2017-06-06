import { Component, OnInit, OnDestroy } from '@angular/core';

import { LabsResourceService } from '../../etl-api/labs-resource.service';
import { PatientService } from '../patient.service';
import * as Moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'lab-sync',
    templateUrl: 'lab-sync.component.html',
    styleUrls: ['./lab-sync.component.css']
})
export class LabSyncComponent implements OnInit, OnDestroy {
    patient: any;
    results = [];
    error: string;
    loadingPatient: boolean;
    fetchingResults: boolean;
    subscription: Subscription;
    constructor(private labsResourceService: LabsResourceService,
        private patientService: PatientService) { }

    ngOnInit() {
        this.loadingPatient = true;
        this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
            (patient) => {
                this.loadingPatient = false;
                if (patient) {
                    this.patient = patient;
                    this.getNewResults();
                }
            }
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getNewResults() {
        this.fetchingResults = true;
        this.error = undefined;
        let startDate = Moment('2006-01-01').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
        let endDate = Moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
        this.labsResourceService.getNewPatientLabResults({
            startDate: startDate,
            endDate: endDate,
            patientUuId: this.patient.person.uuid
        }).subscribe((result) => {
            this.fetchingResults = false;

            if (result.errors && result.errors.length > 0) {
                this.error = result.errors;
            } else {
                this.results = this.processResult(result);
            }
            console.warn(result);
        }, (err) => {
            this.fetchingResults = false;
            this.error = err;
        });
    }

    processResult(results: any) {

        let data: any = [];

        for (let result of results) {
            if (result && result.concept && result.concept.display === 'CD4 PANEL') {
                let cd4Result: any = {
                    isCd4Result: true,
                    groupMembers: result.groupMembers
                };

                for (let member of result.groupMembers) {
                    switch (member.concept.uuid) {
                        case 'a8a8bb18-1350-11df-a1f1-0026b9348838':
                            cd4Result.cd4 = member.value;
                            break;
                        case 'a8970a26-1350-11df-a1f1-0026b9348838':
                            cd4Result.cd4Percent = member.value;
                            break;
                        default:
                            break;
                    }
                }

                data.push(cd4Result);
            } else {
                data.push(result);
            }
        }
        return data;
    }
}
