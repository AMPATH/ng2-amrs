
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { ProviderResourceService } from './provider-resource.service';
import { PersonResourceService } from './person-resource.service';

// Load the implementations that should be tested

describe('Service : ProviderResourceService Unit Tests', () => {

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
        ProviderResourceService,
        PersonResourceService
      ],
    });
  }));
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([ProviderResourceService, PersonResourceService],
      (providerResourceService: ProviderResourceService,
       personResourceService: PersonResourceService) => {
        expect(providerResourceService).toBeTruthy();
        expect(personResourceService).toBeTruthy();
      }));

  it('should return a provider when the correct uuid is provided', (done) => {

    let providerResourceService: ProviderResourceService = TestBed.get(ProviderResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let providerUuid = 'xxx-xxx-xxx-xxx';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toContain('provider/' + providerUuid);
      expect(connection.request.url).toContain('v=');
      let options = new ResponseOptions({
        body: JSON.stringify({
        })
      });
      connection.mockRespond(new Response(options));
    });

    providerResourceService.getProviderByUuid(providerUuid)
      .subscribe((response) => {
        done();
      });
  });
  it('should return a list of providers a matching search string is provided', (done) => {

    let provideresourceService: ProviderResourceService = TestBed.get(ProviderResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let searchText = 'test';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toContain('q=' + searchText);
      expect(connection.request.url).toContain('v=');

      let options = new ResponseOptions({
        body: JSON.stringify({
          results: [
            {
              uuid: 'uuid',
              identifier: ''
            }
          ]
        })
      });
      connection.mockRespond(new Response(options));
    });

    provideresourceService.searchProvider(searchText)
      .subscribe((data) => {
        expect(data.length).toBeGreaterThan(0);
        done();
      });

  });
  it('should throw an error when server returns an error response', (done) => {

    let providerResourceService: ProviderResourceService = TestBed.get(ProviderResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let searchText = 'test';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toContain('q=' + searchText);
      expect(connection.request.url).toContain('v=');

      connection.mockError(new Error('An error occured while processing the request'));
    });

    providerResourceService.searchProvider(searchText)
      .subscribe((response) => {
        },
        (error: Error) => {
          expect(error).toBeTruthy();
          done();
        });
  });
});
