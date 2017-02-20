import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  Http, Response, Headers, BaseRequestOptions,
  ResponseOptions, RequestMethod
} from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';

import { AppSettingsService } from '../app-settings/app-settings.service';
import {
  HivPatientClinicalSummaryResourceService
} from './hiv-patient-clinical-summary-resource.service';

describe('HivPatientClinicalSummaryResourceService Unit Tests', () => {

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
        HivPatientClinicalSummaryResourceService
      ],
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([HivPatientClinicalSummaryResourceService],
      (hivPatientClinicalSummaryResourceService: HivPatientClinicalSummaryResourceService) =>
        expect(hivPatientClinicalSummaryResourceService).toBeTruthy()));

  it('should make API call with the correct url parameters', () => {

    let hivPatientClinicalSummaryResourceService: HivPatientClinicalSummaryResourceService = TestBed
      .get(HivPatientClinicalSummaryResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';

    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url)
        .toContain(patientUuid + '/hiv-patient-clinical-summary');
      expect(connection.request.url).toContain('startIndex=');
      expect(connection.request.url).toContain('limit=');
    });
    expect(hivPatientClinicalSummaryResourceService
      .fetchPatientSummary(patientUuid));
  });

  it('should return correct success body response with correct result', (done) => {
    let hivPatientClinicalSummaryResourceService: HivPatientClinicalSummaryResourceService = TestBed
      .get(HivPatientClinicalSummaryResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    backend.connections.subscribe((connection: MockConnection) => {

      let options = new ResponseOptions({
        body: {
          patientUuid: 'uuid',
          notes: [],
          vitals: [],
          hivSummaries: [],
          reminders: [],
          labDataSummary: []
        }
      });
      connection.mockRespond(new Response(options));
    });
    hivPatientClinicalSummaryResourceService
      .fetchPatientSummary(patientUuid)
      .subscribe((data) => {
        expect(data).toBeTruthy();
        expect(data.patientUuid).toBeDefined();
        expect(data.notes).toBeDefined();
        expect(data.vitals).toBeDefined();
        expect(data.hivSummaries).toBeDefined();
        expect(data.reminders).toBeDefined();
        expect(data.labDataSummary).toBeDefined();
        done();
      });
  });

  it('should throw an error when server returns an error response', (done) => {

    let hivPatientClinicalSummaryResourceService: HivPatientClinicalSummaryResourceService = TestBed
      .get(HivPatientClinicalSummaryResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';

    backend.connections.subscribe((connection: MockConnection) => {

      connection.mockError(new Error('An error occured while processing the request'));
    });

    hivPatientClinicalSummaryResourceService
      .fetchPatientSummary(patientUuid)
      .subscribe((response) => {
        },
        (error: Error) => {
          expect(error).toBeTruthy();
          done();
        });
  });

});
