import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';
import { DatePipe } from '@angular/common';

import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { PatientReminderResourceService } from './patient-reminder-resource.service';

describe('Patient Reminder Resource Service Unit Tests', () => {

  let backend: MockBackend, patientUuid = '79803198-2d23-49cd-a7b3-4f672bd8f659';
  let datePipe = new DatePipe('en-US');
  let referenceDate: any = datePipe.transform(new Date(), 'yyyy-MM-dd');
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
        PatientReminderResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([PatientReminderResourceService],
      (patientReminderResourceService: PatientReminderResourceService) => {
        expect(patientReminderResourceService).toBeTruthy();
      }));

  it('should make API call with the correct url parameters', (done) => {
    backend = TestBed.get(MockBackend);
    let patientReminderResourceService: PatientReminderResourceService =
      TestBed.get(PatientReminderResourceService);
    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url)
        .toContain(
          'etl/patient/79803198-2d23-49cd-a7b3-4f672bd8f659/hiv-clinical-reminder/' + referenceDate
        );
      let options = new ResponseOptions({
        body: JSON.stringify({})
      });
      connection.mockRespond(new Response(options));
    });
    patientReminderResourceService.getPatientLevelReminders(patientUuid)
      .subscribe((response) => {
        done();
      });

  });
  it('should return an error the api throws an error',
    async(inject([PatientReminderResourceService, MockBackend],
      (patientReminderResourceService: PatientReminderResourceService,
       mockBackend: MockBackend) => {

        mockBackend.connections.subscribe(c =>
          c.mockError(new Error('An error occured while processing the request')));

        patientReminderResourceService.getPatientLevelReminders(patientUuid)
          .subscribe((data) => {
            },
            (error: Error) => {
              expect(error).toBeTruthy();
            });
      })));

});
