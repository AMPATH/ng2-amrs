import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    BaseRequestOptions, XHRBackend, Http, RequestMethod,
    ResponseOptions, Response
} from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DailyScheduleResourceService } from './daily-scheduled-resource.service';
import { CacheService } from 'ionic-cache/ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
const expectedResults = {
    startIndex: 0,
    size: 3,
    result: [
        {
            person_id: 111,
            uuid: 'uuid-1',
            given_name: 'GIven Name',
            middle_name: 'Middle Name',
            family_name: 'Family Name',
            identifiers: 'identifier-1,identifier-2',
            gender: 'M',
            age: 66
        },
        {
            person_id: 112,
            uuid: 'uuid-2',
            given_name: 'GIven Name',
            middle_name: 'Middle Name',
            family_name: 'Family Name',
            identifiers: 'identifier-11,identifier-22',
            gender: 'F',
            age: 47
        }
    ]
};
describe('DailyScheduleResourceService Tests', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                DailyScheduleResourceService,
                MockBackend,
                BaseRequestOptions,
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory:
                    (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ]
        });
    });

    it('should be defined',
        inject([DailyScheduleResourceService], (s: DailyScheduleResourceService) => {
            expect(s).toBeTruthy();
        })
    );

    it('all daily schedule resource methods should be defined',
        inject([DailyScheduleResourceService], (s: DailyScheduleResourceService) => {
            expect(s.getDailyVisits).toBeDefined();
            expect(s.getDailyAppointments).toBeDefined();
            expect(s.getDailyHasNotReturned).toBeDefined();
        })
    );

    it('should return a list containing daily appointments for a given date',
        inject([DailyScheduleResourceService, MockBackend],
            (s: DailyScheduleResourceService, backend: MockBackend) => {
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toContain('/etl/daily-appointments/2017-02-01');
                    expect(connection.request.url).toEqual('https://amrsreporting.ampath.or.ke:8002'
                        + '/etl/daily-appointments/2017-02-01?'
                        + 'startIndex=0&startDate=2017-02-01&locationUuids=uuid&limit=300');
                    expect(connection.request.url).toContain('locationUuids=uuid');
                    expect(connection.request.url).toContain('limit=300');
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: expectedResults
                        }
                        )));
                });
                s.getDailyAppointments({
                    startDate: '2017-02-01',
                    startIndex: undefined,
                    locationUuids: 'uuid',
                    limit: undefined
                }).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(expectedResults.result);
                });
            })
    );

    it('should return a list containing visits for a given date',
        inject([DailyScheduleResourceService, MockBackend],
            (s: DailyScheduleResourceService, backend: MockBackend) => {
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toContain('/etl/daily-visits/2017-02-01');
                    expect(connection.request.url).toContain('locationUuids=uuid');
                    expect(connection.request.url).toContain('limit=100');
                    expect(connection.request.url).toEqual('https://amrsreporting.ampath.or.ke:8002'
                        + '/etl/daily-visits/2017-02-01?startIndex=0'
                        + '&startDate=2017-02-01&locationUuids=uuid&limit=100');
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: expectedResults
                        }
                        )));
                });
                s.getDailyVisits({
                    startDate: '2017-02-01',
                    startIndex: '0',
                    locationUuids: 'uuid',
                    limit: '100'
                }).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(expectedResults.result);
                });
            })
    );


    it('should return a list containing daily-has-not-returned for a given date',
        inject([DailyScheduleResourceService, MockBackend],
            (s: DailyScheduleResourceService, backend: MockBackend) => {
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).
                        toContain('/etl/daily-has-not-returned/2017-02-01');
                    expect(connection.request.url).toEqual('https://amrsreporting.ampath.or.ke:8002'
                        + '/etl/daily-has-not-returned/2017-02-01?'
                        + 'startIndex=0&startDate=2017-02-01&locationUuids=uuid&limit=100');
                    expect(connection.request.url).toContain('locationUuids=uuid');
                    expect(connection.request.url).toContain('limit=100');
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: expectedResults
                        }
                        )));
                });
                s.getDailyHasNotReturned({
                    startDate: '2017-02-01',
                    startIndex: '0',
                    locationUuids: 'uuid',
                    limit: '100'
                }).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(expectedResults.result);
                });
            })
    );

});
