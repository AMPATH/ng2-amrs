import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReplaySubject, Subject, Observable } from 'rxjs/Rx';

import {
    VisitResourceService
} from '../../../openmrs-api/visit-resource.service';
import { Vital } from '../../../models/vital.model';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Injectable()
export class TodaysVitalsService {
    public loadingVitals: boolean;
    public loadingEncounters: boolean;
    public errors: any = [];
    public hasVitals: boolean = false;

    public vitalModel = {
        diastolic: null, systolic: null,
        pulse: null, temperature: null, oxygenSaturation: null,
        height: null, weight: null, bmi: null
    };

    constructor(
        private visitResourceService: VisitResourceService) {
    }

    public getTodaysVitals(todaysEncounters) {

        let todaysVitals: Subject<Vital[]> = new Subject<Vital[]>();
        let vitals = [];

        return new Promise((resolve, reject) => {

            for (let encounterItem of todaysEncounters) {
                let encounter = encounterItem;
                this.getVitalsFromObs(encounter.obs);
                if (this.hasVitals === true) {
                    vitals.push(new Vital(this.vitalModel));
                    this.hasVitals = false;
                }

            }

            resolve(vitals);

        });

    }

    private getFormattedDate(date, format) {
        if (format) {
            format = 'yyyy-MM-dd';
        }

        if (typeof date === 'string') {
            date = new Date(date);
        }
        let datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }

    private getTodayVisits(visits) {
        let todayVisits = [];
        // console.log('All Visits', visits);
        for (let visit of visits) {
            let today = this.getFormattedDate(Date.now(), 'dFormat');

            let visitDate = this.getFormattedDate(visit.startDatetime, 'f');

            if (today === visitDate) {
                todayVisits.push(visit);
            }
        }
        return todayVisits;
    }

    private getVisitCompleted(visitUuid, tryCount) {
        tryCount = tryCount || 1;
        this.loadingEncounters = true;

        this.visitResourceService.getVisitEncounters(visitUuid);

    }

    private getVitalsFromObs(obsArray) {
        for (let obs of obsArray) {
            let ob = obs;
            if (typeof ob.concept !== 'undefined') {
                // HIV Triage vitals stored in groupmembers property on obs property
                if (ob.concept.uuid === 'a899e6d8-1350-11df-a1f1-0026b9348838') {
                    let vitals = ob.groupMembers;
                    if (vitals.length > 0) {

                        for (let vital of vitals) {
                            let populateVital = this.populateModel(vital);
                            if (typeof populateVital !== 'undefined') {

                                this.vitalModel.bmi = this.calcBMI(
                                    this.vitalModel.height,
                                    this.vitalModel.weight);

                                this.hasVitals = true;

                            }

                        }

                    }
                } else {

                    // Vitals for other triages in obs object

                    let populateVital = this.populateModel(ob);
                    if (typeof populateVital !== 'undefined') {

                        this.vitalModel.bmi = this.calcBMI(
                            this.vitalModel.height,
                            this.vitalModel.weight);

                        this.hasVitals = true;

                    }

                }

            }

        }
    }

    private calcBMI(height, weight) {
        let result;
        if (height && weight) {
            result = (weight / (height / 100 * height / 100)).toFixed(1);
        }
        return height && weight ? parseFloat(result) : null;
    }

    private populateModel(ob) {
        let vital = new Vital();
        switch (ob.concept.uuid) {
            case 'a8a65d5a-1350-11df-a1f1-0026b9348838':
                return this.vitalModel.systolic = ob.value;
            case 'a8a65e36-1350-11df-a1f1-0026b9348838':
                return this.vitalModel.diastolic = ob.value;
            case 'a8a65f12-1350-11df-a1f1-0026b9348838':
                return this.vitalModel.pulse = ob.value;
            case 'a8a65fee-1350-11df-a1f1-0026b9348838':
                return this.vitalModel.temperature = ob.value;
            case 'a8a66354-1350-11df-a1f1-0026b9348838':
                return this.vitalModel.oxygenSaturation = ob.value;
            case 'a8a6619c-1350-11df-a1f1-0026b9348838':
                return this.vitalModel.height = ob.value;
            case 'a8a660ca-1350-11df-a1f1-0026b9348838':
                return this.vitalModel.weight = ob.value;

            default:
                return ;
        }

    }

}
