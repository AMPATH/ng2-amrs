import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { VitalsResourceService } from './vitals-resource.service';


describe('Vitals Resource Service Unit Tests', () => {

  let backend: MockBackend, patientUuid = 'de662c03-b9af-4f00-b10e-2bda0440b03b';

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
        VitalsResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([VitalsResourceService], (vitalsResourceService: VitalsResourceService) => {
      expect(vitalsResourceService).toBeTruthy();
    }));

  it('should make API call with the correct url parameters', () => {

    backend = TestBed.get(MockBackend);

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch('/patient/(*)/vitals');
      expect(connection.request.url).toContain('startIndex=');
      expect(connection.request.url).toContain('limit=20');

    });


  });

  it('should return the correct parameters from the api',
    async(inject([VitalsResourceService, MockBackend],
      (vitalsResourceService: VitalsResourceService, mockBackend: MockBackend) => {

        mockBackend.connections.subscribe(c =>
          c.mockError(new Error('An error occured while processing the request')));

        vitalsResourceService.getVitals(patientUuid, 0, 20).subscribe((data) => { },
          (error: Error) => {
            expect(error).toBeTruthy();

          });

      })));

});
