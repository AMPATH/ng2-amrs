import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';
import { DatePipe } from '@angular/common';

import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { PatientProgramResourceService } from './patient-program-resource.service';

describe('Patient Program Resource Service Unit Tests', () => {

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
        PatientProgramResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([PatientProgramResourceService],
      (patientProgramResourceService: PatientProgramResourceService) => {
        expect(patientProgramResourceService).toBeTruthy();
      }));

  it('should make API call with the correct url parameters', (done) => {
    backend = TestBed.get(MockBackend);
    let patientProgramResourceService: PatientProgramResourceService =
      TestBed.get(PatientProgramResourceService);
    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url)
        .toContain(
          'etl/patient-program/79803198-2d23-49cd-a7b3-4f672bd8f659'
        );
      let options = new ResponseOptions({
        body: JSON.stringify({})
      });
      connection.mockRespond(new Response(options));
    });
    patientProgramResourceService.getPatientPrograms(patientUuid)
      .subscribe((response) => {
        done();
      });

  });
  it('should return an error the api throws an error',
    async(inject([PatientProgramResourceService, MockBackend],
      (patientProgramResourceService: PatientProgramResourceService,
       mockBackend: MockBackend) => {

        mockBackend.connections.subscribe((c) =>
          c.mockError(new Error('An error occured while processing the request')));

        patientProgramResourceService.getPatientPrograms(patientUuid)
          .subscribe((data) => {
            },
            (error: Error) => {
              expect(error).toBeTruthy();
            });
      })));

  it('should make API call with the correct url parameters while trying to fetch' +
    'program by patient uuid and prog uuid ', (done) => {
    backend = TestBed.get(MockBackend);
    let patientProgramResourceService: PatientProgramResourceService =
      TestBed.get(PatientProgramResourceService);
    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url)
        .toContain(
          'etl/patient-program/79803198-2d23-49cd-a7b3-4f672bd8f659/program/program-uuid'
        );
      let options = new ResponseOptions({
        body: JSON.stringify({})
      });
      connection.mockRespond(new Response(options));
    });
    patientProgramResourceService
      .getPatientProgramByProgUuid(patientUuid, 'program-uuid')
      .subscribe((response) => {
        done();
      });

  });
  it('should return an error the api throws an error while trying to fetch' +
    ' program by patient uuid and prog uuid  ',
    async(inject([PatientProgramResourceService, MockBackend],
      (patientProgramResourceService: PatientProgramResourceService,
       mockBackend: MockBackend) => {

        mockBackend.connections.subscribe((c) =>
          c.mockError(new Error('An error occured while processing the request')));

        patientProgramResourceService
          .getPatientProgramByProgUuid(patientUuid, 'program-uuid')
          .subscribe((data) => {
            },
            (error: Error) => {
              expect(error).toBeTruthy();
            });
      })));
});
