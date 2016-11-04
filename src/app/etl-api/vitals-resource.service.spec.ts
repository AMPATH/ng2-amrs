import {TestBed} from '@angular/core/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';
import { Http,BaseRequestOptions, ResponseOptions,Response } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import {VitalsResourceService} from './vitals-resource.service';


describe('Vitals Resource Service Unit Tests', () => {

  let backend : MockBackend
    , originalTimeout
    , service : VitalsResourceService
    ,patientUuid='de662c03-b9af-4f00-b10e-2bda0440b03b';

  beforeEach(() => {

    originalTimeout = window.jasmine.DEFAULT_TIMEOUT_INTERVAL;
    window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

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
    window.jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    TestBed.resetTestingModule();
  });

  it('is defined', () => {
    service = TestBed.get(VitalsResourceService);
    expect(service).toBeTruthy();
  });

  it('should make API call with the correct url parameters', () =>{

    backend = TestBed.get(MockBackend);

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toMatch('/patient/(*)/vitals');
      expect(connection.request.url).toContain('startIndex=');
      expect(connection.request.url).toContain('limit=10');

    });


  });

  it('should return the correct parameters from the api', (done) => {

    service = TestBed.get(VitalsResourceService);

    let backend: MockBackend = TestBed.get(MockBackend);

    backend.connections.subscribe((connection: MockConnection) => {

      let options = new ResponseOptions({
        body: JSON.stringify({
          results: [
            {
              startIndex: '0',
              limit: '10',
              result : []
            }
          ]
        })
      });
      connection.mockRespond(new Response(options));
    });

    service.getVitals(patientUuid, 0, 10)
      .subscribe((data) => {
        let _data=data.json();

        expect(_data).toBeTruthy();
        expect(_data.startIndex).toBeDefined();
        expect(_data.limit).toBeDefined();
        expect(_data.result).toBeDefined();

        done();
      });

  });

});
