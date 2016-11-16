import { async, inject, TestBed } from '@angular/core/testing';
import {
    BaseRequestOptions, Http, HttpModule, Response,
    ResponseOptions, RequestMethod, ResponseType
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { VisitResourceService } from './visit-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
class MockError extends Response implements Error {
    name: any;
    message: any;
}
describe('VisitResourceService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                VisitResourceService,
                AppSettingsService,
                LocalStorageService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ],
            imports: [
                HttpModule
            ]
        });
    });

    it('should be defined', async(inject(
        [VisitResourceService, MockBackend], (service, mockBackend) => {

            expect(service).toBeDefined();
        })));
    describe('get visit by uuid', () => {
        let singleResponse = {
            'uuid': 'visit-test-uuid',
            'display': 'Test type ? - 22/09/2015 08:30',
            'links': [
                {
                    'uri': 'url',
                    'rel': 'self'
                }
            ]
        };
        it('should return null when uuid not specified', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.getVisitByUuid(null);

                expect(result).toBeNull();
            })));
        it('should call the right endpoint', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let uuid = 'uuid';
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('/ws/rest/v1/visit/' + uuid);
                    expect(conn.request.url).toContain('v=');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(singleResponse) })));
                });

                const result = service.getVisitByUuid(uuid, { v: '' });
            })));
        it('should parse response from visit resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let uuid = 'uuid';
                mockBackend.connections.subscribe(conn => {
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(singleResponse) })));
                });

                const result = service.getVisitByUuid(uuid, { v: '' });

                result.subscribe(res => {
                    expect(res).toEqual(singleResponse);
                });
            })));

        it('should parse errors from visit resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let opts = { type: ResponseType.Error, status: 404, statusText: 'val' };
                let responseOpts = new ResponseOptions(opts);
                mockBackend.connections.subscribe(conn => {
                    conn.mockError(new MockError(responseOpts));
                });
                const result = service.getVisitByUuid('uuid', { v: '' });

                result.subscribe(res => {
                }, (err) => {
                    expect(err).toBe('404 - val');
                });
            })));
    });
    describe('get patient visits', () => {
        let visitsResponse = {
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
        it('should return null when params are not specified', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.getVisitByUuid(null);

                expect(result).toBeNull();
            })));
        it('should call the right endpoint', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('/ws/rest/v1/visit');
                    expect(conn.request.url).toContain('patient=uuid');
                    expect(conn.request.url).toContain(`v=`);
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(visitsResponse) })));
                });

                const result = service.getPatientVisits({
                    patientUuid: 'uuid',
                    v: `(uuid,patient:(uuid,uuid),visitType:(uuid,name),
                    location:ref,startDatetime,stopDatetime)`
                });
            })));
        it('should parse response from visits resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let uuid = 'uuid';
                mockBackend.connections.subscribe(conn => {
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(visitsResponse) })));
                });

                const result = service.getPatientVisits({
                    patientUuid: 'uuid',
                    v: `(uuid,patient:(uuid,uuid),visitType:(uuid,name),
                    location:ref,startDatetime,stopDatetime)`
                });

                result.subscribe(res => {
                    expect(res.length).toBeGreaterThan(0);
                    expect(res[0]).toEqual(visitsResponse.results[0]);
                });
            })));
        it('should parse errors from visits resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let opts = { type: ResponseType.Error, status: 404, statusText: 'val' };
                let responseOpts = new ResponseOptions(opts);
                mockBackend.connections.subscribe(conn => {
                    conn.mockError(new MockError(responseOpts));
                });
                const result = service.getPatientVisits({
                    patientUuid: 'uuid',
                    v: `(uuid,patient:(uuid,uuid),visitType:(uuid,name),
                    location:ref,startDatetime,stopDatetime)`
                });

                result.subscribe(res => {
                }, (err) => {
                    expect(err).toBe('404 - val');
                });
            })));
    });
    describe('get patient visit encounters', () => {
        let singleResponse = {
            'uuid': 'visit-test-uuid',
            'display': 'Test type ? - 22/09/2015 08:30',
            'encounters': [],
            'links': [
                {
                    'uri': 'url',
                    'rel': 'self'
                }
            ]
        };
        it('should call the right endpoint', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let uuid = 'uuid';
                let custom = 'custom:(encounters:(obs,uuid,patient:(uuid,uuid),' +
                    'encounterDatetime,form:(uuid,name),encounterType:(uuid,name),' +
                    'encounterProviders:(uuid,uuid,provider:(uuid,name),' +
                    'encounterRole:(uuid,name)),location:(uuid,name),' +
                    'visit:(uuid,visitType:(uuid,name))))';
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('/ws/rest/v1/visit/' + uuid);
                    expect(conn.request.url).toContain(`v=${custom}`);
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(singleResponse) })));
                });

                const result = service.getVisitEncounters(uuid, { v: '' });
            })));
        it('should parse response from visit resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let uuid = 'uuid';
                mockBackend.connections.subscribe(conn => {
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(singleResponse) })));
                });

                const result = service.getVisitEncounters(uuid, { v: '' });

                result.subscribe(res => {
                    expect(res).toEqual([]);
                });
            })));

        it('should parse errors from visits resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let opts = { type: ResponseType.Error, status: 404, statusText: 'val' };
                let responseOpts = new ResponseOptions(opts);
                mockBackend.connections.subscribe(conn => {
                    conn.mockError(new MockError(responseOpts));
                });
                const result = service.getVisitEncounters('uuid', { v: '' });

                result.subscribe(res => {
                }, (err) => {
                    expect(err).toBe('404 - val');
                });
            })));
    });
    describe('get patient visits types', () => {
        let visitTypesResponse = {
            'results': [{
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
        it('should return null when params are not specified', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.getVisitTypes(null);

                expect(result).toBeNull();
            })));
        it('should call the right endpoint', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('/ws/rest/v1/visittype');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(visitTypesResponse) })));
                });

                const result = service.getVisitTypes({
                    v: 'custom:(uuid,name,description)'
                });
            })));
        it('should parse response from visit type resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(visitTypesResponse) })));
                });

                const result = service.getVisitTypes({
                    v: 'custom:(uuid,name,description)'
                });

                result.subscribe(res => {
                    expect(res.length).toBeGreaterThan(0);
                    expect(res[0]).toEqual(visitTypesResponse.results[0]);
                });
            })));
        it('should parse errors from visit types resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let opts = { type: ResponseType.Error, status: 404, statusText: 'val' };
                let responseOpts = new ResponseOptions(opts);
                mockBackend.connections.subscribe(conn => {
                    conn.mockError(new MockError(responseOpts));
                });
                const result = service.getVisitTypes({
                    v: 'custom:(uuid,name,description)'
                });

                result.subscribe(res => {
                }, (err) => {
                    expect(err).toBe('404 - val');
                });
            })));
    });

    describe('save new visit', () => {
        let newVisitMock = {
            location: '08feae7c-1352-11df-a1f1-0026b9348838',
            patient: 'b4ddd369-bec5-446e-b8f8-47fd5567b295',
            startDatetime: '2016-11-10 10:41:08',
            visitType: 'd4ac2aa5-2899-42fb-b08a-d40161815b48'
        };
        let newVisitResponse = {
            'uuid': 'visit-test-uuid',
            'display': 'Test type ? - 22/09/2015 08:30',
            'links': [
                {
                    'uri': 'url',
                    'rel': 'self'
                }
            ]
        };
        it('should return null when params are not specified', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.saveVisit(null);

                expect(result).toBeNull();
            })));
        it('should call the right endpoint', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('/ws/rest/v1/visit');
                    expect(conn.request.method).toBe(RequestMethod.Post);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(newVisitResponse) })));
                });

                const result = service.saveVisit(newVisitMock);
            })));
        it('should parse response from visit save resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(newVisitResponse) })));
                });

                const result = service.saveVisit(newVisitMock);

                result.subscribe(res => {
                    expect(res).toEqual(newVisitResponse);
                });
            })));
        it('should parse errors from visit save resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let opts = { type: ResponseType.Error, status: 404, statusText: 'val' };
                let responseOpts = new ResponseOptions(opts);
                mockBackend.connections.subscribe(conn => {
                    conn.mockError(new MockError(responseOpts));
                });
                const result = service.saveVisit(newVisitMock);

                result.subscribe(res => {
                }, (err) => {
                    expect(err).toBe('404 - val');
                });
            })));
    });

    describe('update visit', () => {
        let visitMock = {
            location: '08feae7c-1352-11df-a1f1-0026b9348838',
            patient: 'b4ddd369-bec5-446e-b8f8-47fd5567b295',
            endDatetime: '2016-11-10 10:41:08',
            visitType: 'd4ac2aa5-2899-42fb-b08a-d40161815b48'
        };
        let visitResponse = {
            'uuid': 'visit-test-uuid',
            'display': 'Test type ? - 22/09/2015 08:30',
            'links': [
                {
                    'uri': 'url',
                    'rel': 'self'
                }
            ]
        };
        let uuid = 'uuid';
        it('should return null when params are not specified', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.updateVisit(null);

                expect(result).toBeNull();
            })));
        it('should call the right endpoint', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain(`/ws/rest/v1/visit/${uuid}`);
                    expect(conn.request.method).toBe(RequestMethod.Post);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(visitResponse) })));
                });

                const result = service.updateVisit(uuid, visitMock);
            })));
        it('should parse response from visit update resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(visitResponse) })));
                });

                const result = service.updateVisit(uuid, visitMock);

                result.subscribe(res => {
                    expect(res).toEqual(visitResponse);
                });
            })));
        it('should parse errors from visit update resource', async(inject(
            [VisitResourceService, MockBackend], (service, mockBackend) => {
                let opts = { type: ResponseType.Error, status: 404, statusText: 'val' };
                let responseOpts = new ResponseOptions(opts);
                mockBackend.connections.subscribe(conn => {
                    conn.mockError(new MockError(responseOpts));
                });
                const result = service.saveVisit(uuid, visitMock);

                result.subscribe(res => {
                }, (err) => {
                    expect(err).toBe('404 - val');
                });
            })));
    });
});
