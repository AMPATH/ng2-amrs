import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  BaseRequestOptions, XHRBackend, Http, RequestMethod,
  ResponseOptions, Response
} from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings';
import { ClinicLabOrdersResourceService } from './clinic-lab-orders-resource.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheModule, CacheService } from 'ionic-cache';
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
      orderNumber: 'ORD-28212',
      location_name: 'location Test',
      patient_uuid: '5ed39ae0-1359-11df-a1f1-0026b9348838',
      date_activated: '2017-03-06'
    },
    {
      person_id: 112,
      uuid: 'uuid-2',
      given_name: 'GIven Name',
      middle_name: 'Middle Name',
      family_name: 'Family Name',
      identifiers: 'identifier-11,identifier-22',
      orderNumber: 'ORD-28212',
      location_name: 'location Test',
      patient_uuid: '5ed39ae0-1359-11df-a1f1-0026b9348838',
      date_activated: '2017-03-06'
    }
  ]
};
describe('ClinicLabOrdersResourceService Tests', () => {
  let service;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [CacheModule],
      providers: [
        ClinicLabOrdersResourceService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,
        LocalStorageService,
        DataCacheService,
        CacheService,
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

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should be defined',
    inject([ClinicLabOrdersResourceService], (s: ClinicLabOrdersResourceService) => {
      expect(s).toBeTruthy();
    })
  );

  it('all clinic lab orders resource methods should be defined',
    inject([ClinicLabOrdersResourceService], (s: ClinicLabOrdersResourceService) => {
      expect(s.getClinicLabOrders).toBeDefined();
    })
  );

  it('should return a list containing clinic lab orders for a given date',
    inject([ClinicLabOrdersResourceService, MockBackend],
      (s: ClinicLabOrdersResourceService, backend: MockBackend) => {
        backend.connections.take(1).subscribe((connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toContain('/etl/clinic-lab-orders');
          expect(connection.request.url).toEqual('https://amrsreporting.ampath.or.ke:8002'
            + '/etl/clinic-lab-orders?'
            + 'locationUuids=uuid'
            + '&endDate=2017-02-01'
            + '&startDate=2017-02-01');
          expect(connection.request.url).toContain('locationUuids=uuid');
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: expectedResults
              }
            )));
        });
        s.getClinicLabOrders({
          startDate: '2017-02-01',
          locationUuids: 'uuid',
          endDate: '2017-02-01',
        }).take(1).subscribe((result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(expectedResults.result);
        });
      })
  );

});
