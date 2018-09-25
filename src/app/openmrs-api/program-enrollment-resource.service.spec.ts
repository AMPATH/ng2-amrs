import { async, inject, TestBed } from '@angular/core/testing';
import {
  BaseRequestOptions, Http, HttpModule, Response,
  ResponseOptions, RequestMethod
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings';
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

  afterAll(() => {
    TestBed.resetTestingModule();
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

  let programEnrollmentStateResponse = {
    'uuid': 'bfede778-de9e-4551-b4f0-633c8a27ef28',
    'display': 'HIV Treatment',
    'states': [{
      'state': {
        'uuid': 'sddsdsfsdsff',
        'concept': { 'uuid': 'concept-uuid', 'display': 'concept-name' }
      }
    }]
  };

  let stateUpdateResponse = {
      'state': {
        'uuid': 'sddsdsfsdsff',
        'description': null,
        'retired': false,
        'concept': {
          'uuid': '9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          'display': 'BLOOD SUGAR',
          'name': {
            'display': 'BLOOD SUGAR',
            'uuid': '9BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
            'name': 'BLOOD SUGAR',
            'locale': 'en',
            'localePreferred': true,
            'conceptNameType': 'FULLY_SPECIFIED'
          }
        }
      }
    };

  it('should be defined', async(inject(
    [ProgramEnrollmentResourceService, MockBackend], (service, mockBackend) => {

      expect(service).toBeDefined();
    })));

  it('should return null when PatientUuid not specified', async(inject(
    [ProgramEnrollmentResourceService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.take(1).subscribe((conn) => {
        throw new Error('No requests should be made.');
      });

      const result = service.getProgramEnrollmentByPatientUuid(null);

      expect(result).toBeNull();
    })));
  it('should call the right endpoint when fetching program enrollment', async(inject(
    [ProgramEnrollmentResourceService, MockBackend], (service, mockBackend) => {
      let patientUuid = 'uuid';
      let serverUrl = 'http://example.url.com/';
      mockBackend.connections.take(1).subscribe((conn) => {
        expect(conn.request.url)
          .toBe(serverUrl + 'ws/rest/v1/programenrollment?v=custom:(uuid,display,voided' +
            ',dateEnrolled,dateCompleted,location,program:(uuid),states:(uuid,startDate,endDate,' +
            'state:(uuid,initial,terminal,concept:(uuid,display))))&patient=uuid');
        expect(conn.request.method).toBe(RequestMethod.Get);
        conn.mockRespond(new Response(
          new ResponseOptions({ body: JSON.stringify(programEnrollmentResponse) })));
      });

      service.getProgramEnrollmentByPatientUuid(patientUuid);
    })));

  it('should call the right endpoint when fetching program enrollment states', async(inject(
    [ProgramEnrollmentResourceService, MockBackend], (service, mockBackend) => {
      let programEnrollmentUuid = 'program-enrollment-uuid';
      let serverUrl = 'http://example.url.com/';
      mockBackend.connections.take(1).subscribe((conn) => {
        expect(conn.request.url)
          .toBe(serverUrl + 'ws/rest/v1/programenrollment/program-enrollment-uuid?v=' +
          'custom:(uuid,display,states:(uuid,startDate,endDate,state:(uuid,concept:(uuid,display' +
            '))))');
        expect(conn.request.method).toBe(RequestMethod.Get);
        conn.mockRespond(new Response(
          new ResponseOptions({ body: JSON.stringify(programEnrollmentStateResponse) })));
      });

      service.getProgramEnrollmentStates(programEnrollmentUuid);
    })));

  it('should call the right endpoint when updating the patient enrollment state', async(inject(
    [ProgramEnrollmentResourceService, MockBackend], (service, mockBackend) => {
      let programEnrollmentUuid = 'programenrollment-uuid';
      let payload = {
        'uuid': 'uuid-1', 'state': 'state-uuid',
        'startDate': '2011-02-06', 'endDate': '2011-02-08'
      };
      mockBackend.connections.take(1).subscribe((conn) => {
        expect(conn.request.url)
          .toBe('http://example.url.com/ws/rest/v1/programenrollment/programenrollment-uuid/' +
          'state/uuid-1');
        expect(conn.request.method).toBe(RequestMethod.Post);
        conn.mockRespond(new Response(
          new ResponseOptions({ body: JSON.stringify(programEnrollmentResponse) })));
      });

      service.updateProgramEnrollmentState(programEnrollmentUuid, payload);
    })));



  it('should return null when params are not specified', async(inject(
    [ProgramEnrollmentResourceService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.take(1).subscribe((conn) => {
        throw new Error('No requests should be made.');
      });

      const result = service.getProgramEnrollmentByPatientUuid(null);

      expect(result).toBeNull();
    })));
});





