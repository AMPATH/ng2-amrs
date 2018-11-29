/*
 * Testing a Service with MockBackend
 * More info: https://angular.io/docs/ts/latest/api/http/testing/index/MockBackend-class.html
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { LabsResourceService } from './labs-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('LabsResourceService', () => {
    let service, httpMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [HttpClientTestingModule],
            providers: [
                LabsResourceService,
                LocalStorageService,
                AppSettingsService
            ]
        });
        service = TestBed.get(LabsResourceService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    const patientUuId = 'uuid';

    const newLabResults = {
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

    const historicalLabResults = {
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
    it('should be defined', async(() => {
        expect(service).toBeDefined();
    }));

    describe('get New Lab Data By PatientUuid', () => {
        const params = {
            startDate: '2014-12-01',
            endDate: '2014-12-02',
            patientUuId: patientUuId
        };
        it('should call the right endpoint', async(() => {
            const appSettingsService = TestBed.get(AppSettingsService);
            const result = service.getNewPatientLabResults(params).subscribe((results) => { });
            const req = httpMock.expectOne(service.getUrl() + '?startDate=2014-12-01&endDate=2014-12-02&patientUuId=uuid');
            expect(req.request.urlWithParams).toContain('endDate=' + params.endDate);
            expect(req.request.urlWithParams).toContain('startDate=' + params.startDate);
            expect(req.request.urlWithParams).toContain('patientUuId=' + params.patientUuId);
            expect(req.request.urlWithParams)
                .toContain(`${appSettingsService
                    .getEtlRestbaseurl().trim()}patient-lab-orders`);
            expect(req.request.method).toBe('GET');
            req.flush({});
        }));

        it('should parse response from patient labs sync endpoint', async(() => {

            const result = service.getNewPatientLabResults(params);

            result.subscribe(res => {
                expect(res).toBeTruthy();
                expect(res.length).toBe(5);
                expect(res[0].concept.uuid).toBe(newLabResults.updatedObs[0].concept.uuid);
            });
            const req = httpMock.expectOne(service.getUrl() + '?startDate=2014-12-01&endDate=2014-12-02&patientUuId=uuid');
            req.flush(newLabResults);
        }));

        it('should parse errors from patient labs sync endpoint', async(() => {
            const result = service.getNewPatientLabResults(params);

            result.subscribe(res => {
            }, (err) => {
                expect(err).toBe('404 - val');
            });
            const req = httpMock.expectOne(service.getUrl() + '?startDate=2014-12-01&endDate=2014-12-02&patientUuId=uuid');
            req.flush({ type: Error, status: 404, statusText: 'val' });
        }));

    });
    describe('get Historical Lab Data By PatientUuid', () => {
        const params = {
            startIndex: '0',
            limit: '20'
        };
        it('should return null when patient uuid not specified', async(() => {


            const result = service.getHistoricalPatientLabResults(null, params);
            const req = httpMock.expectNone('');

            expect(result).toBeNull();
        }));

        it('should call the right endpoint', async(() => {
            const appSettingsService = TestBed.get(AppSettingsService);

            const result = service.getHistoricalPatientLabResults(patientUuId, params)
                .subscribe((results) => { });
            const req = httpMock.expectOne(appSettingsService.getEtlRestbaseurl().trim()
                + `patient/${patientUuId}/data?startIndex=0&limit=20`);
            expect(req.request.urlWithParams)
                .toContain(`${appSettingsService
                    .getEtlRestbaseurl().trim()}patient/${patientUuId}/data`);
            expect(req.request.urlWithParams).toContain('startIndex=' + params.startIndex);
            expect(req.request.urlWithParams).toContain('limit=' + params.limit);
            expect(req.request.method).toBe('GET');
            req.flush({});
        }));

        it('should set startIndex to 0 when startIndex is not provided',
            async(() => {
                delete params.startIndex;
                const appSettingsService = TestBed.get(AppSettingsService);
                const result =
                    service.getHistoricalPatientLabResults(patientUuId, params)
                        .subscribe((results) => { });
                const req = httpMock.expectOne(appSettingsService.getEtlRestbaseurl().trim()
                    + `patient/${patientUuId}/data?startIndex=0&limit=20`);
                expect(req.request.urlWithParams).toContain('startIndex=0');
                expect(req.request.method).toBe('GET');
                req.flush({});
            }));
        it('should set limit to 20 when startIndex is not provided',
            async(() => {
                const appSettingsService = TestBed.get(AppSettingsService);
                delete params.limit;
                const result =
                    service.getHistoricalPatientLabResults(patientUuId, params)
                        .subscribe((results) => { });
                const req = httpMock.expectOne(appSettingsService.getEtlRestbaseurl().trim()
                    + `patient/${patientUuId}/data?startIndex=0&limit=20`);
                expect(req.request.urlWithParams).toContain('limit=20');
                expect(req.request.method).toBe('GET');
                req.flush({});
            }));

        it('should parse response from patient labs  endpoint', async(() => {
            const appSettingsService = TestBed.get(AppSettingsService);

            const result = service.getHistoricalPatientLabResults(patientUuId, params);

            result.subscribe(res => {
                expect(historicalLabResults).toBeTruthy();
            });
            const req = httpMock.expectOne(appSettingsService.getEtlRestbaseurl().trim()
                + `patient/${patientUuId}/data?startIndex=0&limit=20`);
            expect(req.request.urlWithParams).toContain('limit=20');
            expect(req.request.method).toBe('GET');
            req.flush(JSON.stringify(historicalLabResults));
        }));
        it('should parse errors errors', async(() => {
            const appSettingsService = TestBed.get(AppSettingsService);
            const result = service.getHistoricalPatientLabResults(patientUuId, params);

            result.subscribe(res => {

            }, (err) => {
                expect(err).toBe('404 - val');
            });
            const req = httpMock.expectOne(appSettingsService.getEtlRestbaseurl().trim()
                + `patient/${patientUuId}/data?startIndex=0&limit=20`);
            expect(req.request.urlWithParams).toContain('limit=20');
            expect(req.request.method).toBe('GET');
            req.flush({ type: Error, status: 404, statusText: 'val' });
        }));
    });
});
