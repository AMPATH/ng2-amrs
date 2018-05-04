import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';
import { DatePipe } from '@angular/common';

import { AppSettingsService } from '../app-settings/app-settings.service';
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

  it('should make API call to get program enrollment visit types for a certain patient', (done) => {
    backend = TestBed.get(MockBackend);
    let patientProgramResourceService: PatientProgramResourceService =
      TestBed.get(PatientProgramResourceService);
    let appsetting =
      TestBed.get(AppSettingsService);

    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url)
        .toEqual(
        appsetting.getEtlRestbaseurl().trim() +
        'patient/79803198-2d23-49cd-a7b3-4f672bd8f659' +
        '/program/prog-uuid/enrollment/enroll-uuid' +
        '?intendedLocationUuid=location-uuid'
        );
      let options = new ResponseOptions({
        body: JSON.stringify({ uuid: 'uuid' })
      });
      connection.mockRespond(new Response(options));
    });
    patientProgramResourceService.getPatientProgramVisitTypes(patientUuid,
      'prog-uuid', 'enroll-uuid', 'location-uuid')
      .subscribe((response) => {
        expect(response).toEqual({ uuid: 'uuid' });
        done();
      });

  });

  it('should make API call to get all program visit configs', (done) => {
    backend = TestBed.get(MockBackend);
    let patientProgramResourceService: PatientProgramResourceService =
      TestBed.get(PatientProgramResourceService);
    let appsetting =
      TestBed.get(AppSettingsService);

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url)
        .toEqual(
        appsetting.getEtlRestbaseurl().trim() +
        'program-visit-configs'
        );
      let options = new ResponseOptions({
        body: JSON.stringify({})
      });
      connection.mockRespond(new Response(options));
    });
    patientProgramResourceService.getAllProgramVisitConfigs()
      .subscribe((response) => {
        done();
      });

  });
  it('should make API call to get patient program visit configs', (done) => {
    backend = TestBed.get(MockBackend);
    let patientProgramResourceService: PatientProgramResourceService =
      TestBed.get(PatientProgramResourceService);
    let appsetting =
      TestBed.get(AppSettingsService);

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url)
        .toEqual(
          appsetting.getEtlRestbaseurl().trim() +
          'patient-program-config?patientUuid=uuid'
        );
      let options = new ResponseOptions({
        body: JSON.stringify({})
      });
      connection.mockRespond(new Response(options));
    });
    patientProgramResourceService.getPatientProgramVisitConfigs('uuid')
      .subscribe((response) => {
        done();
      });

  });
  it('should return an error when fetching all program configs fail',
    async(inject([PatientProgramResourceService, MockBackend],
      (patientProgramResourceService: PatientProgramResourceService,
        mockBackend: MockBackend) => {

        mockBackend.connections.subscribe(c =>
          c.mockError(new Error('An error occured while processing the request')));

        patientProgramResourceService.getAllProgramVisitConfigs()
          .subscribe((data) => {
          },
          (error: Error) => {
            expect(error).toBeTruthy();
          });
      })));
});
