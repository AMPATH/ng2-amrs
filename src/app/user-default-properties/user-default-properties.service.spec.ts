import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { UserService } from '../openmrs-api/user.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { UserDefaultPropertiesMockService } from './user-default-properties.service.mock';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { FakeRetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry-mock.service';
import { RetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry.service';

describe('User Default Service Unit Tests', () => {

  let backend: MockBackend;

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
        UserDefaultPropertiesMockService,
        {
          provide: RetrospectiveDataEntryService, useFactory: () => {
          return new FakeRetrospectiveDataEntryService();
        }
        },
        AppSettingsService,
        LocalStorageService,
        SessionStorageService,
        DataCacheService,
        CacheService,
        UserService
      ],
      imports: [
        CacheModule
      ]
    });

  });

  afterEach(() => {
    TestBed.resetTestingModule();
    new LocalStorageService().remove('test');
  });

  it('should be injected with all dependencies',
    inject([UserService
      , LocalStorageService
      , Http
      , AppSettingsService
    ], (user: UserService
      , localStore: LocalStorageService
      , http: Http
      , appSettings: AppSettingsService) => {
      expect(user).toBeDefined();
      expect(localStore).toBeDefined();
      expect(http).toBeDefined();
      expect(appSettings).toBeDefined();
    }));

  it('should make API call with the correct url parameters', () => {

    backend = TestBed.get(MockBackend);

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toContain('/ws/rest/v1/location?v=default');

    });

  });

  it('should return the correct parameters from the api',
    async(inject([UserDefaultPropertiesMockService, MockBackend],
      (propertiesResourceService: UserDefaultPropertiesMockService, mockBackend: MockBackend) => {

        let mockResponse = new Response(new ResponseOptions({
          body: {
            results: []
          }
        }));

        mockBackend.connections.subscribe((c) => c.mockRespond(mockResponse));

        propertiesResourceService.getLocations().subscribe((response: Response) => {

          let data = response.json();

          expect(data).toBeTruthy();
          expect(data.results).toBeDefined();
          expect(data.results.length).toEqual(0);
        });

      })));

  it('should return an error from the api',
    async(inject([UserDefaultPropertiesMockService, MockBackend],
      (propertiesResourceService: UserDefaultPropertiesMockService, mockBackend: MockBackend) => {

        mockBackend.connections.subscribe((c) =>
          c.mockError(new Error('An error occured while processing the request')));

        propertiesResourceService.getLocations().subscribe((response: Response) => {
          },
          (error: Error) => {
            expect(error).toBeTruthy();
          });
      })));

  it('should set and get location property',
    async(inject([UserDefaultPropertiesMockService, LocalStorageService], (
      propertiesResourceService: UserDefaultPropertiesMockService,
      localStore: LocalStorageService) => {

        expect(propertiesResourceService.getCurrentUserDefaultLocation())
          .toEqual('userDefaultLocationtest');
        propertiesResourceService.setUserProperty('test', '123');
        expect(localStore.getItem('test')).toEqual('123');

      })));

});
