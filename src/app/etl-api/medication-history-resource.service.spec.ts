
import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { MedicationHistoryResourceService } from './medication-history-resource.service';

describe('Medication Resource Service Unit Tests', () => {

  let backend: MockBackend, patientUuid = 'de662c03-b9af-4f00-b10e-2bda0440b03b';
  let report = 'medical-history-report';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        MedicationHistoryResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([MedicationHistoryResourceService],
      (medicationHistoryResourceService: MedicationHistoryResourceService) => {
      expect(medicationHistoryResourceService).toBeTruthy();
    }));

  it('should make API call with the correct url parameters', () => {
    backend = TestBed.get(MockBackend);
    let params = {
      report: 'medical-history-report',
      patientUuId: 'uuid'
    };

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch('');
      expect(connection.request.url)
        .toBe('https://amrsreporting.ampath.or.ke:8003/etl/get-report-by-report-name?' +
          'report=medical-history-report&patientUuid=6662626'
        );
      expect(connection.request.url).toContain('report=' + params.report);
      expect(connection.request.url).toContain('patientUuId=' + params.patientUuId);
    });

  });
  it('should return the correct parameters from the api',
    async(inject([MedicationHistoryResourceService, MockBackend],
      (medicationHistoryResourceService: MedicationHistoryResourceService,
       mockBackend: MockBackend) => {

        mockBackend.connections.subscribe((c) =>
          c.mockError(new Error('An error occured while processing the request')));

        medicationHistoryResourceService.getReport(report , patientUuid).subscribe((data) => { },
          (error: Error) => {
            expect(error).toBeTruthy();

          });
      })));

});
