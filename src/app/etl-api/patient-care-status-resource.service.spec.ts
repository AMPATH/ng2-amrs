import { TestBed, async, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { AppSettingsService } from '../app-settings';
import { PatientCareStatusResourceService } from './patient-care-status-resource.service';

class MockAppSettingsService {
    constructor() { }
    getEtlServer(): string {
        return 'https://etl.ampath.or.ke/etl';
    }

}

describe('PatientCareStatusResource', () => {
    let service;
    let results = {
        startIndex: 0,
        size: 1,
        result: [
            {
                'month': 'date1',
                'monthly_patient_care_status': 'active'
            }]
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PatientCareStatusResourceService,
                MockBackend,
                {
                    provide: AppSettingsService,
                    useClass: MockAppSettingsService
                },
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backendInstance: MockBackend,
                        defaultOptions: BaseRequestOptions) => {
                        return new Http(backendInstance, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
            ]
        });
    });

    it('should enter the assertion',
        inject([PatientCareStatusResourceService], (s: PatientCareStatusResourceService) => {
            expect(s).toBeTruthy();
        })
    );

    it('should return a list with patient care status when getMonthlyPatientCareStatus is called',
        inject([PatientCareStatusResourceService, MockBackend],
            (s: PatientCareStatusResourceService, backend: MockBackend) => {
                expect(s.getMonthlyPatientCareStatus({
                    patient_uuid: 'patient_uuid', startDate: 'date1',
                    endDate: 'date2'
                })).toBeTruthy();
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toEqual('https://etl.ampath.or.ke/etl'
                        + '/patient/patient_uuid/monthly-care-status?'
                        + 'startDate=date1&endDate=date2');
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: results
                        }
                        )));
                    s.getMonthlyPatientCareStatus({
                        patient_uuid: 'patient_uuid', startDate: 'date1',
                        endDate: 'date2'
                    }).subscribe((response) => {
                        expect(response.result).toBeTruthy();
                        expect(response.result[0].monthly_patient_care_status).toBe('active');
                    });
                });

            })
    );

    it('should return patient care status on a given date when getDailyPatientCareStatus is called',
        inject([PatientCareStatusResourceService, MockBackend],
            (s: PatientCareStatusResourceService, backend: MockBackend) => {
                let result = {
                    'startIndex': 0,
                    'size': 1,
                    'result': [
                        {
                            'patient_daily_care_status': 'ltfu'
                        }]
                };
                expect(s.getDailyPatientCareStatus({
                    patient_uuid: 'patient_uuid', referenceDate: 'date1'
                })).toBeTruthy();
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toEqual('https://etl.ampath.or.ke/etl'
                        + '/patient/patient_uuid/daily-care-status?'
                        + 'referenceDate=date1');
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: result
                        }
                        )));
                    s.getDailyPatientCareStatus({
                        patient_uuid: 'patient_uuid', referenceDate: 'date1'
                    }
                    ).subscribe((response) => {
                        expect(response.result).toBeTruthy();
                        expect(response.result[0].patient_daily_care_status).toBe('ltfu');
                    });
                });

            })
    );
});
