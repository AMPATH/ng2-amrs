/*
 * Testing a Service with MockBackend
 * More info: https://angular.io/docs/ts/latest/api/http/testing/index/MockBackend-class.html
 */

import { TestBed, async, inject } from '@angular/core/testing';
import {
    Http, BaseRequestOptions, RequestMethod, ConnectionBackend,
    Response, ResponseOptions, ResponseType
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { LabsResourceService } from './labs-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
class MockError extends Response implements Error {
    name: any;
    message: any;
}
describe('LabsResourceService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                BaseRequestOptions,
                MockBackend,
                ConnectionBackend,
                {
                    provide: Http, useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                LabsResourceService,
                LocalStorageService,
                AppSettingsService
            ]
        });
    });

    let patientUuId = 'uuid';

    let newLabResults = {
        updatedObs: [{
            obsDatetime: new Date(),
            concept: {
                uuid: 'a898fe80-1350-11df-a1f1-0026b9348838'
            }, value: {
                display: 'Test'
            },
            groupMembers: []
        },
        {
            obsDatetime: new Date(),
            concept: {
                uuid: 'a8a8bb18-1350-11df-a1f1-0026b9348838'
            }, value: '',
            groupMembers: []
        },
        {
            obsDatetime: new Date(),
            concept: {
                uuid: 'a8970a26-1350-11df-a1f1-0026b9348838'
            }, value: '',
            groupMembers: []
        },
        {
            obsDatetime: new Date(),
            concept: {
                uuid: 'a8982474-1350-11df-a1f1-0026b9348838'
            }, value: '',
            groupMembers: []
        },
        {
            obsDatetime: new Date(),
            concept: {
                uuid: '457c741d-8f71-4829-b59d-594e0a618892'
            }, value: '',
            groupMembers: []
        }
        ]
    };

    let historicalLabResults = {
        startIndex: '0',
        size: '30',
        result: [
            {
                'person_id': 5177,
                'uuid': '5c38504f-cf5e-4986-ac2b-0e9e8029dfae',
                'encounter_id': 330938870,
                'test_datetime': '2016-06-13T21:00:00.000Z',
                'encounter_type': 99999,
                'hiv_dna_pcr': '',
                'hiv_rapid_test': null,
                'hiv_viral_load': 0,
                'cd4_count': null,
                'cd4_percent': null,
                'hemoglobin': null,
                'ast': null,
                'creatinine': null,
                'chest_xray': '',
                'has_errors': null,
                'vl_error': null,
                'cd4_error': null,
                'hiv_dna_pcr_error': null,
                'tests_ordered': 'Viral Load,',
                'cur_arv_meds': 'NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE',
                'lab_errors': ''
            }
        ]
    };
    it('should be defined', async(inject(
        [LabsResourceService, MockBackend], (service, mockBackend) => {

            expect(service).toBeDefined();
        })));

    describe('get New Lab Data By PatientUuid', () => {
        let params = {
            startDate: '2014-12-01',
            endDate: '2014-12-02',
            patientUuId: patientUuId
        };
        it('should call the right endpoint', async(inject(
            [LabsResourceService, MockBackend, AppSettingsService],
            (service, mockBackend, appSettingsService) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url)
                        .toContain(`${appSettingsService
                            .getEtlRestbaseurl().trim()}patient-lab-orders`);
                    expect(conn.request.url).toContain('endDate=' + params.endDate);
                    expect(conn.request.url).toContain('startDate=' + params.startDate);
                    expect(conn.request.url).toContain('patientUuId=' + params.patientUuId);
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify({}) })));
                });

                const result = service.getNewPatientLabResults(params).subscribe((results) => { });
            })));

        it('should parse response from patient labs sync endpoint', async(inject(
            [LabsResourceService, MockBackend], (service, mockBackend) => {
                let uuid = 'uuid';
                mockBackend.connections.subscribe(conn => {
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(newLabResults) })));
                });

                const result = service.getNewPatientLabResults(params);

                result.subscribe(res => {
                    expect(res).toBeTruthy();
                    expect(res.length).toBe(5);
                    expect(res[0].concept.uuid).toBe(newLabResults.updatedObs[0].concept.uuid);
                });
            })));

        it('should parse errors from patient labs sync endpoint', async(inject(
            [LabsResourceService, MockBackend], (service, mockBackend) => {
                let opts = { type: ResponseType.Error, status: 404, statusText: 'val' };
                let responseOpts = new ResponseOptions(opts);
                mockBackend.connections.subscribe(conn => {
                    conn.mockError(new MockError(responseOpts));
                });
                const result = service.getNewPatientLabResults(params);

                result.subscribe(res => {
                }, (err) => {
                    expect(err).toBe('404 - val');
                });
            })));

    });
    describe('get Historical Lab Data By PatientUuid', () => {
        let params = {
            startIndex: '0',
            limit: '20'
        };
        it('should return null when patient uuid not specified', async(inject(
            [LabsResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.getHistoricalPatientLabResults(null, params);

                expect(result).toBeNull();
            })));

        it('should call the right endpoint', async(inject(
            [LabsResourceService, MockBackend, AppSettingsService],
            (service, mockBackend, appSettingsService) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url)
                        .toContain(`${appSettingsService
                            .getEtlRestbaseurl().trim()}patient/${patientUuId}/data`);
                    expect(conn.request.url).toContain('startIndex=' + params.startIndex);
                    expect(conn.request.url).toContain('limit=' + params.limit);
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify({}) })));
                });

                const result = service.getHistoricalPatientLabResults(patientUuId, params)
                    .subscribe((results) => { });
            })));

        it('should set startIndex to 0 when startIndex is not provided',
            async(inject(
                [LabsResourceService, MockBackend], (service, mockBackend) => {
                    mockBackend.connections.subscribe(conn => {
                        expect(conn.request.url).toContain('startIndex=0');
                        expect(conn.request.method).toBe(RequestMethod.Get);
                        conn.mockRespond(new Response(
                            new ResponseOptions({ body: JSON.stringify({}) })));
                    });
                    delete params.startIndex;
                    const result =
                        service.getHistoricalPatientLabResults(patientUuId, params)
                            .subscribe((results) => { });
                })));
        it('should set limit to 20 when startIndex is not provided',
            async(inject(
                [LabsResourceService, MockBackend], (service, mockBackend) => {
                    mockBackend.connections.subscribe(conn => {
                        expect(conn.request.url).toContain('limit=20');
                        expect(conn.request.method).toBe(RequestMethod.Get);
                        conn.mockRespond(new Response(
                            new ResponseOptions({ body: JSON.stringify({}) })));
                    });
                    delete params.limit;
                    const result =
                        service.getHistoricalPatientLabResults(patientUuId, params)
                            .subscribe((results) => { });
                })));

        it('should parse response from patient labs  endpoint', async(inject(
            [LabsResourceService, MockBackend], (service, mockBackend) => {
                let uuid = 'uuid';
                mockBackend.connections.subscribe(conn => {
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(historicalLabResults) })));
                });

                const result = service.getHistoricalPatientLabResults(patientUuId, params);

                result.subscribe(res => {
                    expect(res).toBeTruthy();
                });
            })));
        it('should parse errors errors', async(inject(
            [LabsResourceService, MockBackend], (service, mockBackend) => {
                let opts = { type: ResponseType.Error, status: 404, statusText: 'val' };
                let responseOpts = new ResponseOptions(opts);
                mockBackend.connections.subscribe(conn => {
                    conn.mockError(new MockError(responseOpts));
                });

                const result = service.getHistoricalPatientLabResults(patientUuId, params);

                result.subscribe(res => {

                }, (err) => {
                    expect(err).toBe('404 - val');
                });
            })));
    });
});
