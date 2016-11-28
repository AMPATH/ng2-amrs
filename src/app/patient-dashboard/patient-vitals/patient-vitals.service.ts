import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { Helpers } from '../../utils/helpers';
import { VitalsResourceService } from '../../etl-api/vitals-resource.service';


@Injectable()
export class PatientVitalsService {

    protected _vitals: Array<Object> = [];

    public vitals: BehaviorSubject<any> = new BehaviorSubject(null);

    public allDataLoaded: BehaviorSubject<boolean> = new BehaviorSubject(null);

    public startIndex: number = 0;

    public limit: number = 20;

    constructor(private vitalsResourceService: VitalsResourceService) { }

    getvitals(patientUuid: string, isCached: boolean,
        startIndex?: string, limit?: string): BehaviorSubject<any> {
        if (isCached && this.startIndex > 0) return this.vitals;
        this.vitalsResourceService.getVitals(patientUuid,
            this.startIndex, this.limit).subscribe((data) => {
                if (data) {
                    let vitals = data;
                    let weight: string;
                    if (data.length === 0) {
                        this.vitals.complete();
                    } else {
                        for (let r = 0; r < vitals.length; r++) {
                            if (vitals[r].height && vitals[r].weight) {
                                let BMI = (vitals[r].weight /
                                    (vitals[r].height / 100 * vitals[r].height / 100))
                                    .toFixed(1);
                                vitals[r]['BMI'] = BMI;
                            }
                        }
                        this._vitals.push.apply(this._vitals, vitals);
                        this.startIndex += vitals.length;

                        this.vitals.next(this._vitals);
                    }
                }
            }, (error) => {
                this.vitals.error(error);
                console.error(error);
            });

        return this.vitals;
    }
}

