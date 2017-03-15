import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    BaseRequestOptions, XHRBackend, Http, RequestMethod,
    ResponseOptions, Response
} from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DefaulterListResourceService } from './defaulter-list-resource.service';
import { CacheService } from 'ionic-cache/ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
const expectedResults = {
    startIndex: 0,
    size: 3,
    result: [
        {
            patient_uuid: 'patient-uuid',
            person_id: 102322,
            encounter_id: 636033226,
            location_id: 1,
            location_uuid: '08feae7c-1352-11df-a1f1-0026b9348838',
            days_since_rtc: 30,
            encounter_datetime: '2016-09-19T21:00:00.000Z',
            rtc_date: '2017-02-06T21:00:00.000Z',
            arv_start_date: '2009-09-15T21:00:00.000Z',
            encounter_type_name: 'ADULTNONCLINICALMEDICATION',
            person_name: 'Peter kenya Munya',
            phone_number: null,
            identifiers: '24371MT-9, 009421138-0, 15204-21078',
            filed_id: '38-11-42-09-0',
            gender: 'M',
            birthdate: '1965-12-31T21:00:00.000Z',
            birthdate_estimated: 0,
            dead: 0,
            death_date: null,
            cause_of_death: null,
            creator: 50842,
            date_created: '2009-09-19T05:28:30.000Z',
            changed_by: 131180,
            date_changed: '2010-02-15T06:40:49.000Z',
            voided: 0,
            voided_by: null,
            date_voided: null,
            void_reason: null,
            uuid: 'a4ce27ae-f1e5-4893-9248-50332de6281e',
            deathdate_estimated: 0,
            birthtime: null,
            age: 51
        },
        {
            patient_uuid: 'patient-uuid',
            person_id: 35432803,
            encounter_id: 658032945,
            location_id: 1,
            location_uuid: 'location-uuid',
            days_since_rtc: 31,
            encounter_datetime: '2017-01-08T21:00:00.000Z',
            rtc_date: '2017-02-05T21:00:00.000Z',
            arv_start_date: '2011-05-16T21:00:00.000Z',
            encounter_type_name: 'ADULTRETURN',
            person_name: 'man me toa',
            phone_number: '0727091346',
            identifiers: '295169210-8, 15204-25723',
            filed_id: '10-92-16-95-2',
            gender: 'F',
            birthdate: '1975-12-31T21:00:00.000Z',
            birthdate_estimated: 0,
            dead: 0,
            death_date: null,
            cause_of_death: null,
            creator: 83039,
            date_created: '2011-05-03T07:38:31.000Z',
            changed_by: 165060,
            date_changed: '2013-08-05T09:02:05.000Z',
            voided: 0,
            voided_by: null,
            date_voided: null,
            void_reason: null,
            uuid: '2f8213c6-5c26-4889-ba28-7f28dadd237e',
            deathdate_estimated: 0,
            birthtime: null,
            age: 41
        }
    ]
};
describe('DefaulterListResourceService Tests', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                DefaulterListResourceService,
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
        inject([DefaulterListResourceService], (s: DefaulterListResourceService) => {
            expect(s).toBeTruthy();
        })
    );

    it('all defaulter list resource methods should be defined',
        inject([DefaulterListResourceService], (s: DefaulterListResourceService) => {
            expect(s.getDefaulterList).toBeDefined();
            expect(s.getUrl).toBeDefined();
        })
    );

    it('should return a list containing list of defaulters for a given '
        + ' date range and location ',
        inject([DefaulterListResourceService, MockBackend],
            (s: DefaulterListResourceService, backend: MockBackend) => {
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toContain('/etl/defaulter-list');
                    expect(connection.request.url).toEqual('https://amrsreporting.ampath.or.ke:8002'
                        + '/etl/defaulter-list?startIndex=0&defaulterPeriod=30&maxDefaultPeriod=100'
                        + '&locationUuids=uuid&limit=300');
                    expect(connection.request.url).toContain('locationUuids=uuid');
                    expect(connection.request.url).toContain('limit=300');
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: expectedResults
                        }
                        )));
                });
                s.getDefaulterList({
                    defaulterPeriod: 30,
                    maxDefaultPeriod: 100,
                    startIndex: undefined,
                    locationUuids: 'uuid',
                    limit: undefined
                }).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(expectedResults.result);
                });
            })
    );


});

