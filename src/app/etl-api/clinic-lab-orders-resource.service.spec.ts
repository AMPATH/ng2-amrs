import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { ClinicLabOrdersResourceService } from './clinic-lab-orders-resource.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CacheModule,
        HttpClientTestingModule
      ],
      providers: [
        HttpClient,
        ClinicLabOrdersResourceService,
        AppSettingsService,
        LocalStorageService,
        DataCacheService,
        CacheService
      ]
    });
  });

  afterEach(() => {
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
    inject([ClinicLabOrdersResourceService, HttpTestingController],
      (s: ClinicLabOrdersResourceService, httpMock: HttpTestingController) => {

        const url = 'https://amrsreporting.ampath.or.ke:8002'
          + '/etl/clinic-lab-orders?'
          + 'locationUuids=uuid'
          + '&endDate=2017-02-01'
          + '&startDate=2017-02-01';

        s.getClinicLabOrders({
          startDate: '2017-02-01',
          locationUuids: 'uuid',
          endDate: '2017-02-01',
        }).subscribe((result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(expectedResults.result);
        });
      })
  );

});
