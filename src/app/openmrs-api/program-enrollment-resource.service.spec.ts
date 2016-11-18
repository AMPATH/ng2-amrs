import { async, inject, TestBed } from '@angular/core/testing';
import {
  BaseRequestOptions, Http, HttpModule, Response,
  ResponseOptions, RequestMethod
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { ProgramEnrollmentResourceService } from './program-enrollment-resource.service';

describe('Service: ProgramEnrollmentResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramEnrollmentResourceService,
        AppSettingsService,
        LocalStorageService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [
        HttpModule
      ]
    });
  });

  let programEnrollmentResponse = {
    results: [
      {
        'uuid': '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
        'display': 'HIV Program',
        'name': 'HIV Program',
        'dateEnrolled': '2011-02-09T00:00:00.000+0300',
        'dateCompleted': '2011-02-09T00:00:00.000+0300',
        'program': {
          'uuid': '922fc86d-ad42-4c50-98a6-b1f310863c07'
        }
      }]
  };

  it('should be defined', async(inject(
    [ProgramEnrollmentResourceService, MockBackend], (service, mockBackend) => {

      expect(service).toBeDefined();
    })));

  it('should return null when PatientUuid not specified', async(inject(
    [ProgramEnrollmentResourceService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        throw new Error('No requests should be made.');
      });

      const result = service.getProgramEnrollmentByPatientUuid(null);

      expect(result).toBeNull();
    })));
  it('should call the right endpoint', async(inject(
    [ProgramEnrollmentResourceService, MockBackend], (service, mockBackend) => {
      let patientUuid = 'uuid';
      mockBackend.connections.subscribe(conn => {
        expect(conn.request.url)
          .toBe('http://example.url.com/ws/rest/v1/programenrollment?v=custom:' +
            '(uuid,display,dateEnrolled,dateCompleted,program:(uuid))&patient=uuid');
        expect(conn.request.method).toBe(RequestMethod.Get);
        conn.mockRespond(new Response(
          new ResponseOptions({body: JSON.stringify(programEnrollmentResponse)})));
      });

      service.getProgramEnrollmentByPatientUuid(patientUuid);
    })));


  it('should return null when params are not specified', async(inject(
    [ProgramEnrollmentResourceService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        throw new Error('No requests should be made.');
      });

      const result = service.getProgramEnrollmentByPatientUuid(null);

      expect(result).toBeNull();
    })));
});





