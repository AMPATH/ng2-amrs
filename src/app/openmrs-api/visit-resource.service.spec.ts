import { async, inject, TestBed } from '@angular/core/testing';
import { VisitResourceService } from './visit-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { VitalsResourceService } from '../etl-api/vitals-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
class MockError extends Response implements Error {
    public name: any;
    public message: any;

}
xdescribe('VisitResourceService', () => {

    let service: VisitResourceService;

    let httpMock: HttpTestingController;
    const getUrl = 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/visit';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                VisitResourceService,
                AppSettingsService,
                LocalStorageService
            ],
            imports: [
                HttpClientTestingModule,
            ]
        });

        service = TestBed.get(VisitResourceService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        TestBed.resetTestingModule();
    });

    it('should be defined', async(() => {
        expect(service).toBeDefined();
    }));

    describe('get visit by uuid', () => {
        const singleResponse = {
            uuid: 'visit-test-uuid',
            display: 'Test type ? - 22/09/2015 08:30',
            links: [
                {
                    uri: 'url',
                    rel: 'self'
                }
            ]
        };
        it('should return null when uuid not specified', async(() => {
            httpMock.expectNone({});
            const result = service.getVisitByUuid(null, null);

            expect(result).toBeNull();
        }));
        it('should call the right endpoint', async(() => {
            const uuid = 'uuid';

            const result = service.getVisitByUuid(uuid, { v: '' }).subscribe();

            const req = httpMock.expectOne('https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/visit/uuid?v=');
            expect(req.request.method).toBe('GET');
            expect(req.request.urlWithParams).toContain('/ws/rest/v1/visit/' + uuid);
            expect(req.request.urlWithParams).toContain('v=');
        }));
        it('should parse response from visit resource', async(() => {
            const uuid = 'uuid';

            const result = service.getVisitByUuid(uuid, { v: '' });

            result.subscribe((res) => {
                expect(res).toEqual(singleResponse);
            });

            const req = httpMock.expectOne('https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/visit/uuid?v=');
            req.flush(singleResponse);
        }));

        it('should parse errors from visit resource', async(() => {

            const uuid = 'uuid';
            const result = service.getVisitByUuid('uuid', { v: '' });

            result.subscribe((res) => {
                console.log('No Errors');
            }, (err) => {
                expect(err.message).toBe('404 - val');
            });

            const req = httpMock.expectOne(getUrl + '/' + uuid + '?v=');
            req.flush({
                type: 'ERROR',
                status: 404,
                message: '404 - val'
            });
        }));
    });
    describe('get patient visits', () => {
        const visitsResponse = {
            results: [
                {
                    uuid: '21240920-c0c9-46d8-bf2b-91b73d6b0738',
                    patient: { uuid: 'b4ddd369-bec5-446e-b8f8-47fd5567b295' },
                    visitType: {
                        uuid: 'd4ac2aa5-2899-42fb-b08a-d40161815b48',
                        name: 'RETURN HIV CLINIC VISIT'
                    }
                }]
        };
        it('should return null when params are not specified', async(() => {
            httpMock.expectNone({});
            const result = service.getPatientVisits(null);
            expect(result).toBeNull();
        }));
        it('should call the right endpoint', async(() => {
            service.getPatientVisits({
                patientUuid: 'uuid',
                v: '(uuid,patient:(uuid,uuid),visitType:(uuid,name)' +
                    'location:ref,startDatetime,stopDatetime)'
            }).subscribe();

            const req = httpMock.expectOne(getUrl + '?v=(uuid,patient:(uuid,uuid),visitType:(uuid,name)' +
                'location:ref,startDatetime,stopDatetime)&patient=uuid');
            expect(req.request.method).toBe('GET');
            expect(req.request.urlWithParams).toContain('patient=uuid');
            expect(req.request.urlWithParams).toContain('/ws/rest/v1/visit');
            expect(req.request.urlWithParams).toContain('?v=');
        }));
        it('should parse response from visits resource', async(() => {
            const uuid = 'uuid';

            const result = service.getPatientVisits({
                patientUuid: 'uuid',
                v: '(uuid,patient:(uuid,uuid),visitType:(uuid,name)' +
                    'location:ref,startDatetime,stopDatetime)'
            });

            result.subscribe((res) => {
                expect(res.length).toBeGreaterThan(0);
                expect(res[0]).toEqual(visitsResponse.results[0]);
            });

            const req = httpMock.expectOne(getUrl + '?v=(uuid,patient:(uuid,uuid),visitType:(uuid,name)' +
                'location:ref,startDatetime,stopDatetime)&patient=uuid');
            req.flush(visitsResponse);
        }));
        it('should parse errors from visits resource', async(() => {
            const result = service.getPatientVisits({
                patientUuid: 'uuid',
                v: '(uuid,patient:(uuid,uuid),visitType:(uuid,name)' +
                    'location:ref,startDatetime,stopDatetime)'
            });

            result.subscribe((res) => {
                console.log('No Errros');
            }, (err) => {
                expect(err).toBe('404 - val');
            });
            const req = httpMock.expectOne(getUrl + '?v=(uuid,patient:(uuid,uuid),visitType:(uuid,name)' +
                'location:ref,startDatetime,stopDatetime)&patient=uuid');
            req.flush({ type: 'error', status: 404, statusText: 'val' });
        }));
    });
    describe('get patient visit encounters', () => {
        const singleResponse = {
            uuid: 'visit-test-uuid',
            display: 'Test type ? - 22/09/2015 08:30',
            encounters: [],
            links: [
                {
                    uri: 'url',
                    rel: 'self'
                }
            ]
        };
        it('should call the right endpoint', async(() => {
            const uuid = 'uuid';
            const custom = 'custom:(encounters:(obs,uuid,patient:(uuid,uuid),' +
                'encounterDatetime,form:(uuid,name),encounterType:(uuid,name),' +
                'encounterProviders:(uuid,uuid,provider:(uuid,name),' +
                'encounterRole:(uuid,name)),location:(uuid,name),' +
                'visit:(uuid,visitType:(uuid,name))))';

            const result = service.getVisitEncounters(uuid).subscribe();

            const req = httpMock.expectOne(getUrl + '/' + uuid +
                '?v=custom:(encounters:(obs,uuid,patient:(uuid,uuid),' +
                'encounterDatetime,form:(uuid,name),encounterType:(uuid,name),' +
                'encounterProviders:(uuid,uuid,provider:(uuid,name),' +
                'encounterRole:(uuid,name)),location:(uuid,name),' +
                'visit:(uuid,visitType:(uuid,name))))');
            expect(req.request.urlWithParams).toContain(`v=${custom}`);
            expect(req.request.method).toBe('GET');
            expect(req.request.urlWithParams).toContain('/ws/rest/v1/visit/' + uuid);
            expect(req.request.urlWithParams).toContain('?v=');
        }));
        it('should parse response from visit resource', async(() => {
            const uuid = 'uuid';

            const result = service.getVisitEncounters(uuid);

            result.subscribe((res) => {
                // expect(res).toEqual([]);
            });

            const req = httpMock.expectOne(getUrl + '/' + uuid +
                '?v=custom:(encounters:(obs,uuid,patient:(uuid,uuid),' +
                'encounterDatetime,form:(uuid,name),encounterType:(uuid,name),' +
                'encounterProviders:(uuid,uuid,provider:(uuid,name),' +
                'encounterRole:(uuid,name)),location:(uuid,name),' +
                'visit:(uuid,visitType:(uuid,name))))');
            req.flush({ body: JSON.stringify(singleResponse) });
        }));

        it('should parse errors from visits resource', async(() => {
            const result = service.getVisitEncounters('uuid');

            result.subscribe((res) => {
                console.log('No Errors');
            }, (err) => {
                expect(err).toBe('404 - val');
            });

            const req = httpMock.expectOne(getUrl + '/uuid' +
                '?v=custom:(encounters:(obs,uuid,patient:(uuid,uuid),' +
                'encounterDatetime,form:(uuid,name),encounterType:(uuid,name),' +
                'encounterProviders:(uuid,uuid,provider:(uuid,name),' +
                'encounterRole:(uuid,name)),location:(uuid,name),' +
                'visit:(uuid,visitType:(uuid,name))))');
            req.flush({ type: 'error', status: 404, statusText: 'val' });
        }));
    });
    describe('get patient visits types', () => {

        let appSettingsService: AppSettingsService;

        const visitTypesResponse = {
            results: [{
                uuid: '77b6e076-e866-46cf-9959-4a3703dba3fc',
                name: 'INITIAL HIV CLINIC VISIT',
                description: 'This is the first visit a patient makes to the HIV clinic.'
            },
            {
                uuid: 'd4ac2aa5-2899-42fb-b08a-d40161815b48',
                name: 'RETURN HIV CLINIC VISIT',
                description: 'This is the subsequent visit a patient makes to the HIV clinic.'
            }]
        };
        beforeEach(() => {
            appSettingsService = TestBed.get(AppSettingsService);
        });
        it('should return null when params are not specified', async(() => {

            httpMock.expectNone({});
            const result = service.getVisitTypes(null);

            expect(result).toBeNull();
        }));
        it('should call the right endpoint', async(() => {

            const result = service.getVisitTypes({
                v: 'custom:(uuid,name,description)'
            }).subscribe();

            const req = httpMock.expectOne(`${appSettingsService.getOpenmrsRestbaseurl().trim()}visittype`);
            expect(req.request.url).toContain('/ws/rest/v1/visittype');
            expect(req.request.method).toBe('GET');
        }));
        it('should parse response from visit type resource', (done) => {

            const result = service.getVisitTypes({
                v: 'custom:(uuid,name,description)'
            });

            result.subscribe((res) => {
                done();
            });

            const req = httpMock.expectOne(`${appSettingsService.getOpenmrsRestbaseurl().trim()}visittype`);
            expect(req.request.url).toContain('/ws/rest/v1/visittype');
            expect(req.request.method).toBe('GET');
            req.flush({ body: visitTypesResponse });
        });
        it('should parse errors from visit types resource', async(() => {
            const result = service.getVisitTypes({
                v: 'custom:(uuid,name,description)'
            });

            result.subscribe((res) => {
                console.log('No Errors');
            }, (err) => {
                expect(err).toBe('404 - val');
            });
            const req = httpMock.expectOne(`${appSettingsService.getOpenmrsRestbaseurl().trim()}visittype`);
            expect(req.request.url).toContain('/ws/rest/v1/visittype');
            expect(req.request.method).toBe('GET');
            req.flush({ type: 'error', status: 404, statusText: 'val' });
        }));
    });

    describe('save new visit', () => {
        const newVisitMock = {
            location: '08feae7c-1352-11df-a1f1-0026b9348838',
            patient: 'b4ddd369-bec5-446e-b8f8-47fd5567b295',
            startDatetime: '2016-11-10 10:41:08',
            visitType: 'd4ac2aa5-2899-42fb-b08a-d40161815b48'
        };
        const newVisitResponse = {
            uuid: 'visit-test-uuid',
            display: 'Test type ? - 22/09/2015 08:30',
            links: [
                {
                    uri: 'url',
                    rel: 'self'
                }
            ]
        };
        it('should return null when params are not specified', async(() => {
            httpMock.expectNone({});
            const result = service.saveVisit(null);

            expect(result).toBeNull();
        }));
        it('should call the right endpoint', async(() => {

            const result = service.saveVisit(newVisitMock).subscribe();

            const req = httpMock.expectOne(getUrl);
            expect(req.request.url).toContain('/ws/rest/v1/visit');
            expect(req.request.method).toBe('POST');
        }));
        it('should parse response from visit save resource', async(() => {
            const result = service.saveVisit(newVisitMock);

            result.subscribe((res) => {
                expect(res).toEqual(newVisitResponse);
            });

            const req = httpMock.expectOne(getUrl);
            expect(req.request.url).toContain('/ws/rest/v1/visit');
            expect(req.request.method).toBe('POST');
            req.flush(newVisitResponse);
        }));
        it('should parse errors from visit save resource', async(() => {
            const result = service.saveVisit(newVisitMock);

            result.subscribe((res) => {
                console.log('No Errors');
            }, (err) => {
                expect(err).toBe('404 - val');
            });
            const req = httpMock.expectOne(getUrl);
            expect(req.request.url).toContain('/ws/rest/v1/visit');
            expect(req.request.method).toBe('POST');
            req.flush({ type: 'error', status: 404, statusText: 'val' });
        }));
    });

    describe('update visit', () => {
        const visitMock = {
            location: '08feae7c-1352-11df-a1f1-0026b9348838',
            patient: 'b4ddd369-bec5-446e-b8f8-47fd5567b295',
            endDatetime: '2016-11-10 10:41:08',
            visitType: 'd4ac2aa5-2899-42fb-b08a-d40161815b48'
        };
        const visitResponse = {
            uuid: 'visit-test-uuid',
            display: 'Test type ? - 22/09/2015 08:30',
            links: [
                {
                    uri: 'url',
                    rel: 'self'
                }
            ]
        };
        const uuid = 'uuid';
        it('should return null when params are not specified', async(() => {
            httpMock.expectNone({});
            const result = service.updateVisit(null, null);

            expect(result).toBeNull();
        }));
        it('should call the right endpoint', async(() => {

            const result = service.updateVisit(uuid, visitMock).subscribe();
            const req = httpMock.expectOne(`${getUrl}/${uuid}`);
            expect(req.request.url).toContain(`/ws/rest/v1/visit/${uuid}`);
            expect(req.request.method).toBe('POST');
        }));
        it('should parse response from visit update resource', async(() => {

            const result = service.updateVisit(uuid, visitMock);

            result.subscribe((res) => {
                expect(res).toEqual(visitResponse);
            });
            const req = httpMock.expectOne(`${getUrl}/${uuid}`);
            req.flush(visitResponse);
        }));
        it('should parse errors from visit update resource', async(() => {
            const result = service.updateVisit(uuid, visitMock);

            result.subscribe((res) => {
                console.log('No Errors');
            }, (err) => {
                expect(err).toBe('404 - val');
            });
            const req = httpMock.expectOne(`${getUrl}/${uuid}`);
            req.flush({ type: 'error', status: 404, statusText: 'val' });
        }));
    });
});
