/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { LocalStorageService } from '../../utils/local-storage.service';

import { HivSummaryService } from './hiv-summary.service';
import { PatientService } from '../patient.service';
import { HivSummaryResourceService } from '../../etl-api/hiv-summary-resource.service';
import { AppSettingsService } from '../../app-settings/app-settings.service';

describe('Service: HivSummary', () => {

  let service: HivSummaryService,
    result: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HivSummaryService,
        HivSummaryResourceService,
        MockBackend,
        LocalStorageService,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
         AppSettingsService
      ]
    });
      service = TestBed.get(HivSummaryService);
      result = service.getHivSummary('de662c03-b9af-4f00-b10e-2bda0440b03b', 0, 20);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });


  it('should load hiv summary', (done) => {
    result.subscribe((results) => {
      if (results) {
      expect(results).toBeTruthy();
       expect(results.length).toBeGreaterThan(0);
       expect(results[0].uuid).toEqual('uuid');
      }
      done();
    });

  });


  it('should return an error when load hiv summary is not successful', (done) => {
    let backend: MockBackend = TestBed.get(MockBackend);

    let patientUuid = 'de662c03-b9af-4f00-b10e-2bda0440b03b';
    let startIndex = 0;

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url)
        .toBe('https://amrsreporting.ampath.or.ke:8002/etl/patient/'
        + patientUuid + '/hiv-summary?startIndex=0&limit=20');

      connection.mockError(new Error('An error occured while processing the request'));
    });

    service.getHivSummary(patientUuid, 0, 20)
      .subscribe((response) => {
    },
      (error: Error) => {
        expect(error).toBeTruthy();
      });
      done();
  });

  it('should determine if viral load is pending and return an object to indicate this ', () => {
      let isPendingViralLoadMock = [
        {
          status: true,
          days: 0
        },
         {
          status: false,
          days: 0
        }
      ];

      result.subscribe((results) => {
        if (results) {
        expect(JSON.stringify(results.isPendingViralLoad))
          .toContain(JSON.stringify(isPendingViralLoadMock));
      }
      });
    }
  );

    it('should determine if CD4 is pending and return an object to indicate this ', () => {
      let isPendingCD4Mock = [
        {
          status: true,
          days: 0
        },
         {
          status: false,
          days: 0
        }
      ];

      result.subscribe((results) => {
        if (results) {
        expect(JSON.stringify(results.isPendingCD4))
          .toContain(JSON.stringify(isPendingCD4Mock));
      }
      });
    }
  );
});

