import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions,
   ResponseOptions, RequestMethod } from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';

import { AppSettingsService } from '../app-settings';
import { HivSummaryResourceService } from './hiv-summary-resource.service';


describe('HivSummaryService Unit Tests', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [
        MockBackend,
        BaseRequestOptions,
        LocalStorageService,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        AppSettingsService,
        HivSummaryResourceService
      ],
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([HivSummaryResourceService], (hivSummaryResourceService: HivSummaryResourceService) =>
      expect(hivSummaryResourceService).toBeTruthy()));

  it('should make API call with the correct url parameters', () => {

    let hivSummaryResourceService: HivSummaryResourceService = TestBed
    .get(HivSummaryResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    let startIndex = '0';
    let limit = '20';

    backend.connections.take(1).subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url)
      .toBe('https://amrsreporting.ampath.or.ke:8002/etl/patient/'
      + patientUuid + '/hiv-summary?startIndex=0&limit=20' );

    });
  });

  it('should return a list of Hiv summary record', (done) => {
    let hivSummaryResourceService: HivSummaryResourceService = TestBed
    .get(HivSummaryResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    let startIndex = 0;
    let limit = 20;

    backend.connections.take(1).subscribe((connection: MockConnection) => {

      let options = new ResponseOptions({
        body: JSON.stringify({
          startIndex: '0',
          size: '20',
          result: [
            {
              'person_id': 5404,
              'uuid': '5b82f9da-1359-11df-a1f1-0026b9348838'
            },
             {
              'person_id': 5404,
              'uuid': '5b82f9da-1359-11df-a1f1-0026b9348838'
            }
          ]
        })
      });
      connection.mockRespond(new Response(options));
    });
    hivSummaryResourceService.getHivSummary(patientUuid, startIndex, limit)
      .take(1).subscribe((data) => {
      expect(data).toBeTruthy();
      expect(data.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should throw an error when server returns an error response', (done) => {

    let hivSummaryResourceService: HivSummaryResourceService = TestBed
    .get(HivSummaryResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    let startIndex = 0;
    let limit = 20;

    backend.connections.take(1).subscribe((connection: MockConnection) => {

      connection.mockError(new Error('An error occured while processing the request'));
    });

    hivSummaryResourceService.getHivSummary(patientUuid, startIndex, limit)
      .take(1).subscribe((response) => {
      },
      (error: Error) => {
        expect(error).toBeTruthy();
        done();
      });
  });

});
