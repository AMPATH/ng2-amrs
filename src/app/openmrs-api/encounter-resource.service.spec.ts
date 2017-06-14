import { async, inject, TestBed } from '@angular/core/testing';
import {
    BaseRequestOptions, Http, HttpModule, Response,
    ResponseOptions, RequestMethod
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { EncounterResourceService } from './encounter-resource.service';
describe('EncounterResourceService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EncounterResourceService,
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
        [EncounterResourceService, MockBackend], (service, mockBackend) => {

            expect(service).toBeDefined();
        })));
    describe('get Encounters by PatientUuid', () => {
        let encountersResponse = {
            results: [
                {
                    'uuid': '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
                    'encounterDatetime': '2011-02-09T00:00:00.000+0300',
                    'patient': {
                        'uuid': '922fc86d-ad42-4c50-98a6-b1f310863c07'
                    },
                    'form': {
                        'uuid': '4710fa02-46ee-421d-a951-9eb012e2e950',
                        'name': 'AMPATH Pediatric Return Visit Form 4.4 with Mother-Baby Link'
                    },
                    'location': {
                        'uuid': '08feb5b6-1352-11df-a1f1-0026b9348838',
                        'display': 'Amukura',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/'
                            }
                        ]
                    }
                }]
        };

        it('should return null when PatientUuid not specified', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.getEncountersByPatientUuid(null);

                expect(result).toBeNull();
            })));
        it('should call the right endpoint', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {
                let patientUuid = 'uuid';
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url)
                        .toBe('http://example.url.com/ws/rest/v1/encounter?patient='
                        + patientUuid + '&v=custom:(uuid,encounterDatetime,' +
                        'patient:(uuid,uuid),form:(uuid,name),' +
                        'visit:(uuid,startDatetime,stopDatetime,location:(uuid,display)' +
                        ',visitType:(uuid,name)),' +
                        'location:ref,encounterType:ref,provider:ref)');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(encountersResponse) })));
                });

                const result = service.getEncountersByPatientUuid(patientUuid);
            })));

    });
    describe('get Encounter by uuid', () => {
        let encounterResponse = {
            'uuid': '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
            'encounterDatetime': '2011-02-09T00:00:00.000+0300',
            'patient': {
                'uuid': '922fc86d-ad42-4c50-98a6-b1f310863c07'
            },
            'form': {
                'uuid': '4710fa02-46ee-421d-a951-9eb012e2e950',
                'name': 'AMPATH Pediatric Return Visit Form 4.4 with Mother-Baby Link'
            },
            'location': {
                'uuid': '08feb5b6-1352-11df-a1f1-0026b9348838',
                'display': 'Amukura',
                'links': [
                    {
                        'rel': 'self',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/'
                    }
                ]
            }
        };

        it('should return null when params are not specified', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.getEncounterByUuid(null);

                expect(result).toBeNull();
            })));
        it('should call the right endpoint', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {
                let patientUuid = 'uuid';
                mockBackend.connections.subscribe(conn => {
                    let _customDefaultRep = 'custom:(uuid,encounterDatetime,' +
                        'patient:(uuid,uuid,identifiers),form:(uuid,name),' +
                        'visit:(uuid,startDatetime,stopDatetime),' +
                        'location:ref,encounterType:ref,provider:ref,orders:full,' +
                        'obs:(uuid,obsDatetime,concept:(uuid,uuid,name:(display))' +
                        ',value:ref,groupMembers))';
                    expect(conn.request.url)
                        .toBe('http://example.url.com/ws/rest/v1/encounter/' + patientUuid + '?v='
                        + _customDefaultRep);
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(encounterResponse) })));
                });
                const result = service.getEncounterByUuid(patientUuid);

            })));
    });
    describe('get Encounter types', () => {
        let encounterTypeResponse = {
            'results': [
                {
                    'uuid': 'df5549ce-1350-11df-a1f1-0026b9348838',
                    'display': 'ADHERENCEREINITIAL',
                    'links': [
                        {
                            'rel': 'self',
                            'uri': 'https://amrs.ampath.or.ke:8443/'
                        }
                    ]
                },
                {
                    'uuid': 'df5548c0-1350-11df-a1f1-0026b9348838',
                    'display': 'ADHERENCERETURN',
                    'links': [
                        {
                            'rel': 'self',
                            'uri': 'https://amrs.ampath.or.ke:8443/'
                        }
                    ]
                }
            ]
        };
        it('should return null when params are not specified', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.getEncounterTypes(null);

                expect(result).toBeNull();
            })));
        it('should call the right endpoint', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url)
                        .toBe('http://example.url.com/ws/rest/v1/encountertype');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(encounterTypeResponse) })));
                });

                const result = service.getEncounterTypes({
                    v: 'custom:(uuid,name)'
                });
            })));
    });

    describe('save new Encounter', () => {
        let newEncounterMock = {
            location: '08feb5b6-1352-11df-a1f1-0026b9348838',
            patient: '922fc86d-ad42-4c50-98a6-b1f310863c07',
            encounterDatetime: '2010-11-23T00:00:00.000+0300',
            encounterType: '927d9d1f-44ce-471e-a77b-d1f1342f43f6'
        };
        let newEncounterResponse = {
            'uuid': '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
            'display': 'PEDSRETURN 23/11/2010',
            'encounterDatetime': '2010-11-23T00:00:00.000+0300',
            'patient': {
                'uuid': '922fc86d-ad42-4c50-98a6-b1f310863c07',
                'display': '',
                'links': [
                    {
                        'uri': 'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/',
                        'rel': 'self'
                    }
                ]
            },
            'location': {
                'uuid': '08feb5b6-1352-11df-a1f1-0026b9348838',
                'display': 'Location-5',
                'links': [
                    {
                        'uri': 'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1',
                        'rel': 'self'
                    }
                ]
            }
        };
        it('should return null when params are not specified', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.saveEncounter(null);

                expect(result).toBeNull();
            })));
        it('should call the right endpoint', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toBe('http://example.url.com/ws/rest/v1/encounter');
                    expect(conn.request.method).toBe(RequestMethod.Post);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(newEncounterResponse) })));
                });

                const result = service.saveEncounter(newEncounterMock);
            })));
    });
    describe('update encounters', () => {
        let encounterMock = {
            location: '08feb5b6-1352-11df-a1f1-0026b9348838',
            patient: '922fc86d-ad42-4c50-98a6-b1f310863c07',
            encounterDatetime: '2010-11-23T00:00:00.000+0300',
            encounterType: '927d9d1f-44ce-471e-a77b-d1f1342f43f6'
        };
        let encounterResponse = {
            'uuid': '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
            'display': 'PEDSRETURN 23/11/2010',
            'encounterDatetime': '2010-11-23T00:00:00.000+0300',
            'patient': {
                'uuid': '922fc86d-ad42-4c50-98a6-b1f310863c07',
                'display': '',
                'links': [
                    {
                        'uri': 'https://test1.ampath.or.ke:8443/amrs/ws/rest',
                        'rel': 'self'
                    }
                ]
            },
            'location': {
                'uuid': '08feb5b6-1352-11df-a1f1-0026b9348838',
                'display': 'Location-5',
                'links': [
                    {
                        'uri': 'https://test1.ampath.or.ke:8443/amrs/ws/rest',
                        'rel': 'self'
                    }
                ]
            }
        };
        let uuid = 'uuid';
        it('should return null when params are not specified', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.updateEncounter(null);

                expect(result).toBeNull();
            })));
        it('should call the right endpoint', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url)
                        .toBe('http://example.url.com/ws/rest/v1/encounter/' + uuid);
                    expect(conn.request.method).toBe(RequestMethod.Post);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify(encounterResponse) })));
                });

                const result = service.updateEncounter(uuid, encounterMock);
            })));
    });

    describe('Should Delete encounters', () => {
        let uuid = 'encounter-uuid';
        it('should return null when params are not specified', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {

                mockBackend.connections.subscribe(conn => {
                    throw new Error('No requests should be made.');
                });

                const result = service.voidEncounter(null);

                expect(result).toBeNull();
            })));

        it('should call the right endpoint', async(inject(
            [EncounterResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url)
                        .toBe('http://example.url.com/ws/rest/v1/encounter/' + uuid + '?!purge');
                    expect(conn.request.method).toBe(RequestMethod.Delete);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: JSON.stringify({}) })));
                });

                const result = service.voidEncounter(uuid);
            })));
    });
});





