/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { PatientEncounterService } from './patient-encounters.service';
import { EncounterResourceService } from "../../openmrs-api/encounter-resource.service";
import { Encounter } from "../../models/encounter.model";

describe('Service: PatientEncounter', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PatientEncounterService,
                {
                    provide: EncounterResourceService, useFactory: () => {
                        return new FakeEncounterResourceService();
                    }, deps: []
                }
            ]
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create an instance', () => {
        let service: PatientEncounterService = TestBed.get(PatientEncounterService);
        expect(service).toBeTruthy();
    });

    it('should get Encounters by patientUuid', (done) => {
        let service: PatientEncounterService = TestBed.get(PatientEncounterService);
        let results = service.getEncountersByUuid('patientUuid');

        results.subscribe((results) => {
            expect(results).toBeTruthy();
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].uuid).toEqual('uuid');
            done();
        });

    });

    it('should return an error when encounters cannot be loaded', (done) => {
        let service: PatientEncounterService = TestBed.get(PatientEncounterService);
        let fakeRes: FakeEncounterResourceService =
            TestBed.get(EncounterResourceService) as FakeEncounterResourceService;

        //tell mock to return error on next call
        fakeRes.returnErrorOnNext = true;
        let results = service.getEncountersByUuid('patientUuid');

        results.subscribe((results) => {
        },
            (error) => {
                //when it gets here, then it returned an error
                done();
            });

    });
});

/**
 * FakeEncounterResourceService
 */
class FakeEncounterResourceService extends EncounterResourceService {
    constructor() {
        super();
    }
    returnErrorOnNext: boolean = false;
    getEncountersByUuid(uuid: string,cached: boolean=false,v: string = null): Observable<any> {
        let test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
        let encounters = [
            {
            uuid:'uuid',
            display:'the encounter',
            encounterDatetime:'2016-01-01 0:00z',
            patient: {
                uuid:'patient uuid'
            },
            encounterType: {
                uuid:'encounter type uuid'
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

        if (!this.returnErrorOnNext)
            test.next(encounters);
        else
            test.error(new Error('Error loading patient'));
        return test.asObservable();
    }
}


