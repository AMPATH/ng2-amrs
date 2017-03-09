

import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { PatientReminderResourceService } from './patient-reminder-resource.service';
import { DatePipe } from '@angular/common';

describe('Patient Reminder Resource Service Unit Tests', () => {

  let backend: MockBackend, patientUuid = '79803198-2d23-49cd-a7b3-4f672bd8f659';
  let report = 'clinical-reminder-report';
  let datePipe = new DatePipe('en-US');
  let referenceDate: any = datePipe.transform(new Date(), 'yyyy-MM-dd');
  console.log('reference', referenceDate);
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
    let params = {
      startIndex: '0',
      limit: '1',
      indicators: 'needs_vl_coded,overdue_vl_lab_order,' +
      'months_since_last_vl_date,new_viral_load_present,' +
      'ordered_vl_has_error,is_on_inh_treatment',
      referenceDate: referenceDate
    };
    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url)
        .toBe(
        'https://amrsreporting.ampath.or.ke:8002/etl/get-report-by-report-name?' +
        'indicators=needs_vl_coded,overdue_vl_lab_order,' +
        'months_since_last_vl_date,new_viral_load_present,' +
        'ordered_vl_has_error,is_on_inh_treatment' +
        '&limit=1&patientUuid=79803198-2d23-49cd-a7b3-4f672bd8f659' +
        '&referenceDate=' + params.referenceDate +
        '&report=clinical-reminder-report&startIndex=0'
        );
      let options = new ResponseOptions({
        body: JSON.stringify({
        })
      });
      connection.mockRespond(new Response(options));
    });
    patientReminderResourceService.getPatientLevelReminders(patientUuid)
      .subscribe((response) => {
        done();
      });

  });
  it('should return the correct parameters from the api',
    async(inject([PatientReminderResourceService, MockBackend],
      (patientReminderResourceService: PatientReminderResourceService,
        mockBackend: MockBackend) => {
        let params = {
          startIndex: '0',
          limit: '1',
          indicators: 'needs_vl_coded,overdue_vl_lab_order,' +
          'months_since_last_vl_date,new_viral_load_present,' +
          'ordered_vl_has_error,is_on_inh_treatment',
          referenceDate: referenceDate
        };

        mockBackend.connections.subscribe(c =>
          c.mockError(new Error('An error occured while processing the request')));

        patientReminderResourceService.getPatientLevelReminders(patientUuid)
          .subscribe((data) => { },
          (error: Error) => {
            expect(error).toBeTruthy();

          });
      })));

});
