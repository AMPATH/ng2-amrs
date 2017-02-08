
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';

/**
 * FakeEncounterResourceService
 */
export class FakeEncounterResourceService {
    returnErrorOnNext: boolean = false;
    constructor() {
    }
    getEncountersByPatientUuid(
        patientuuid: string,
        cached: boolean = false,
        v: string = null): Observable<any> {
        let test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
        let encounters = [
            {
                uuid: 'uuid',
                display: 'the encounter',
                encounterDatetime: '2016-01-01 0:00z',
                patient: {
                    uuid: 'patient uuid'
                },
                encounterType: {
                    uuid: 'encounter type uuid'
                },
                location: {
                    uuid: 'location uuid'
                },
                form: {
                    uuid: 'form uuid'
                },
                provider: {
                    uuid: 'provider uuid'
                },
                visit: {
                    uuid: 'uuid'
                }
            },
            {
                uuid: 'uuid',
                display: 'the encounter',
                encounterDatetime: '2016-01-01 0:00z',
                patient: {
                    uuid: 'patient uuid'
                },
                encounterType: {
                    uuid: 'encounter type uuid'
                },
                location: {
                    uuid: 'location uuid'
                },
                form: {
                    uuid: 'form uuid'
                },
                provider: {
                    uuid: 'provider uuid'
                },
                visit: {
                    uuid: 'uuid'
                }
            }
        ];

        if (!this.returnErrorOnNext) {
            test.next(encounters);
        } else {
            test.error(new Error('Error loading patient'));
        }
        return test.asObservable();
    }
}
