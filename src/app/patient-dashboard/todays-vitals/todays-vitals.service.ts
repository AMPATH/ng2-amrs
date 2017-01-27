import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReplaySubject, Subject, Observable } from 'rxjs/Rx';

import {
    VisitResourceService
} from '../../openmrs-api/visit-resource.service';
import { Vital } from '../../models/vital.model';

@Injectable()
export class TodaysVitalsService {
    loadingVitals: boolean;
    loadingEncounters: boolean;
    errors: any = [];


    vitalModel = {
        diastolic: null, systolic: null,
        pulse: null, temperature: null, oxygenSaturation: null,
        height: null, weight: null, bmi: null
    };

    constructor(private visitResourceService: VisitResourceService) {
    }

    getTodaysVitals(uuid): Observable<Vital[]> {
        let todaysVitals: Subject<Vital[]> = new Subject<Vital[]>();
        let patientsObservable = this.visitResourceService.getPatientVisits(uuid);

        if (patientsObservable === null) {
            throw 'Null patient visit observable';
        } else {
            patientsObservable.subscribe(
                (encounters) => {
                    if (encounters.length > 0) {
                        let visits = this.getTodayVisits(encounters);
                        let visitUuid = '';
                        if (visits.length > 0) {
                            visitUuid = visits[0].uuid;
                            this.visitResourceService.getVisitEncounters(visitUuid).subscribe(
                                (visitEncounters) => {
                                    if (visitEncounters.length > 0) {
                                        let hasTriageEncounter = false;
                                        for (let encounter of visitEncounters) {
                                            let encounterType = encounter.encounterType.uuid;
                                            if (encounterType ===
                                                'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7') {
                                                this.getVitalsFromObs(encounter.obs);
                                                let vitals = [];
                                                vitals.push(new Vital(this.vitalModel));
                                                todaysVitals.next(vitals);
                                                hasTriageEncounter = true;
                                                break;
                                            }
                                        }
                                        if (!hasTriageEncounter) {
                                            todaysVitals.next([]);
                                        }
                                    } else {
                                        todaysVitals.next([]);
                                    }
                                },
                                (error) => {
                                    todaysVitals.error(error);
                                }
                            );
                        } else {
                            todaysVitals.next([]);
                        }

                    }
                },
                (error) => {
                    todaysVitals.error(error);
                }
            );
        }
        return todaysVitals.asObservable();
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
        for (let i = 0; i < obsArray.length; i++) {
            let ob = obsArray[i];

            if (ob.hasOwnProperty('concept')) {
                if (ob.concept.uuid === 'a899e6d8-1350-11df-a1f1-0026b9348838') {
                    let vitals = ob.groupMembers;
                    for (let vital of vitals) {
                        this.populateModel(vital);
                    }
                    this.vitalModel.bmi = this.calcBMI(
                        this.vitalModel.height,
                        this.vitalModel.weight);

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
                return;
        }

    }


}
