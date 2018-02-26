import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  BaseRequestOptions, XHRBackend, Http, RequestMethod,
  ResponseOptions, Response, URLSearchParams
} from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';
import { PatientReferralResourceService } from './patient-referral-resource.service';

const expectedPatientReferralResults = {
  startIndex: 0,
  size: 1,
  result: [
    {
      location: 'location name',
      location_uuid: 'location-uuid',
      program_uuid: 'program_uuid',
      location_id: 13,
      encounter_datetime: '2017-04-26T05:48:32.000Z',
      received_back: 89,
    }
  ],
  indicatorDefinitions: [{

  }]
};

const reportParams = {
  startIndex: undefined,
  startDate: '2017-03-01',
  locationUuids: '08fec056-1352-11df-a1f1-0026b9348838',
  programUuid:'program-uuid',
  limit: undefined,
  endDate: '2017-04-27',
  gender: 'M,F',
  stateUuids: 'stateUuids-uuid',
  startAge: 0,
  endAge: 110
};

const patientList = {
  startIndex: 0,
  size: 3,
  result: [
    {
      person_id: 1817,
      encounter_id: 6774060,
      location_id: 13,
      location_uuid: '08fec056-1352-11df-a1f1-0026b9348838',
      patient_uuid: '5b737014-1359-11df-a1f1-0026b9348838',
      gender: 'F',
      birthdate: '1982-12-11T21:00:00.000Z',
      age: 34

    }
  ]
};

describe('PatientReferralResourceService Tests', () => {
  let service;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [CacheModule],
      providers: [
        PatientReferralResourceService,
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
    inject([PatientReferralResourceService],
      (s: PatientReferralResourceService) => {
        expect(s).toBeTruthy();
      })
  );

  it('Patient referral resource service resource methods should be defined',
    inject([PatientReferralResourceService],
      (s: PatientReferralResourceService) => {
        expect(s.getUrl).toBeDefined();
        expect(s.getPatientListUrl).toBeDefined();
        expect(s.getPatientReferralReport).toBeDefined();
        expect(s.getPatientReferralPatientList).toBeDefined();
      })
  );

  it('should return report urlRequest parameters',
    inject([PatientReferralResourceService, MockBackend],
      (s: PatientReferralResourceService, backend: MockBackend) => {
        let urlParams = s.getUrlRequestParams(reportParams);
        let params = urlParams.toString();
        expect(params).toContain('locationUuids=08fec056-1352-11df-a1f1-0026b9348838');
        expect(params).toContain('endDate=2017-04-27');
        expect(params).toContain('gender=M,F');
        expect(params).toContain('startDate=2017-03-01');
        expect(params).toContain('stateUuids=stateUuids-uuid');
        expect(params).toContain('endAge=110');

      }
    )
  );

  it('should return Patient referral  Report',
    inject([PatientReferralResourceService, MockBackend],
      (s: PatientReferralResourceService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: expectedPatientReferralResults
              }
            )));
        });

        s.getPatientReferralReport(reportParams).subscribe((result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(expectedPatientReferralResults);
        });
      })
  );

  it('should return Patient referral Report Patient List',
    inject([PatientReferralResourceService, MockBackend],
      (s: PatientReferralResourceService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: patientList
              }
            )));
        });

        s.getPatientReferralPatientList(reportParams).subscribe((result) => {
          expect(result).toBeDefined();
          expect(result).toEqual(patientList.result);
        });
      })
  );

});
