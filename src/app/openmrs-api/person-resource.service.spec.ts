


import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { PersonResourceService } from './person-resource.service';


// Load the implementations that should be tested

describe('Service: PersonResourceService Unit Tests', () => {

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
        PersonResourceService
      ],
    });
  }));
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([PersonResourceService],
      (personResourceService: PersonResourceService) => {
        expect(personResourceService).toBeTruthy();
      }));

  it('should return a person when the correct uuid is provided', (done) => {

    let personResourceService: PersonResourceService = TestBed.get(PersonResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let personuid = 'uuid';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toContain('person/' + personuid);
      expect(connection.request.url).toContain('v=');
      let options = new ResponseOptions({
        body: JSON.stringify({
        })
      });
      connection.mockRespond(new Response(options));
    });

    personResourceService.getPersonByUuid(personuid)
      .subscribe((response) => {
        done();
      });
  });
});

