import { CohortUserResourceService } from './cohort-user-resource.service';
import { async, inject , TestBed } from '@angular/core/testing';
import {  BaseRequestOptions, Http, HttpModule, Response,
    ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';

fdescribe('Service : CohortUserResourceService Unit Tests', () => {

     beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CohortUserResourceService,
                MockBackend,
                BaseRequestOptions,
                    {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                AppSettingsService,
                LocalStorageService
                ]
           });
      });

let mockCohortResponse = [
        {
            'name': 'adult',
            'description': 'int',
            'date_created': '2010-05-06T13:17:48.000Z',
            'cohort_id': 6,
            'uuid': 'a8d586ac-018e-40b6-8778-87b09d762c06',
            'role': 'admin',
            'access': 'public'
        },
        {
            'name': 'anc cohort',
            'description': '',
            'date_created': '2011-01-24T07:52:04.000Z',
            'cohort_id': 9,
            'uuid': '92430dc6-3fbc-4c36-9d33-0e64cbf263c6',
            'role': 'admin',
            'access': 'private'
        }
  ];

it('should construct CohortUser Service', async(inject(
                 [CohortUserResourceService, MockBackend], (service, mockBackend) => {
                 expect(service).toBeDefined();
      })));

it('Should return null in getCohortbyUserUuid with no parameter', async(inject(
            [CohortUserResourceService, MockBackend], (service, mockBackend) => {
            let response = service.getCohortbyUserUuid(null);
            expect(response).toBeNull();

    })));
describe('Get Cohort(s) by user uuid', () => {
    it('should hit right endpoint for getCohortbyUserUuid and get right response', async(inject(
           [CohortUserResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('/etl/cohort-user');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                });
                 service.getCohortbyUserUuid('5a9b0882-13a9-11df-a1f1-0026b9348838')
                    .subscribe(res => {
                         expect(res).toEqual(mockCohortResponse);
                });
    })));

});
});
