import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { PatientResourceService } from './patient-resource.service';

// Load the implementations that should be tested

describe('PatientService Unit Tests', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
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
        AppSettingsService,
        LocalStorageService,
        PatientResourceService
      ],
    });
  }));
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([PatientResourceService],
      (patientResourceService: PatientResourceService) => {
        expect(patientResourceService).toBeTruthy();
      }));

  it('should return a patient when the correct uuid is provided', (done) => {

    let patientResourceService: PatientResourceService = TestBed.get(PatientResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let patientUuid = 'xxx-xxx-xxx-xxx';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toContain('patient/' + patientUuid);
      expect(connection.request.url).toContain('v=');
      let options = new ResponseOptions({
        body: JSON.stringify({
        })
      });
      connection.mockRespond(new Response(options));
    });

    patientResourceService.getPatientByUuid(patientUuid)
      .subscribe((response) => {
        done();
      });
  });

  it('should return a list of patients when a matching search string is provided', (done) => {

    let patientResourceService: PatientResourceService = TestBed.get(PatientResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let searchText = 'test';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toContain('q=' + searchText);
      expect(connection.request.url).toContain('v=');

      let options = new ResponseOptions({
        body: JSON.stringify({
          results: [
            {
              uuid: 'xxx-xxx-xxx-xxx',
              identifiers: {}
            }
          ]
        })
      });
      connection.mockRespond(new Response(options));
    });

    patientResourceService.searchPatient(searchText)
      .subscribe((data) => {
        expect(data.length).toBeGreaterThan(0);
        done();
      });

  });

  it('should throw an error when server returns an error response', (done) => {

    let patientResourceService: PatientResourceService = TestBed.get(PatientResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let searchText = 'test';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toContain('q=' + searchText);
      expect(connection.request.url).toContain('v=');

      connection.mockError(new Error('An error occured while processing the request'));
    });

    patientResourceService.searchPatient(searchText)
      .subscribe((response) => {
      },
      (error: Error) => {
        expect(error).toBeTruthy();
        done();
      });
  });
});
