import { TestBed, async, inject, flush, fakeAsync } from '@angular/core/testing';

import { AppSettingsService } from '../app-settings/app-settings.service';
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
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('User Default Service Unit Tests', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpTestingController,
        HttpHandler,
        HttpHandler,
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
        CacheModule,
        HttpClientTestingModule
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
      , HttpClient
      , AppSettingsService
    ], (user: UserService
      , localStore: LocalStorageService
      , http: HttpClient
      , appSettings: AppSettingsService) => {
      expect(user).toBeDefined();
      expect(localStore).toBeDefined();
      expect(http).toBeDefined();
      expect(appSettings).toBeDefined();
    }));

  // it('should make API call with the correct url parameters', () => {

  //   backend = TestBed.get(MockBackend);

  //   backend.connections.subscribe((connection: MockConnection) => {

  //     expect(connection.request.method).toBe(RequestMethod.Get);
  //     expect(connection.request.url).toContain('/ws/rest/v1/location?v=default');

  //   });


  // });

  xit('should return the correct parameters from the api',
    inject([UserDefaultPropertiesMockService, HttpTestingController],
      fakeAsync((propertiesResourceService: UserDefaultPropertiesMockService,
         httpTestingController: HttpTestingController) => {

        propertiesResourceService.getLocations().subscribe((response: Response) => {

          const data = response.json();
          expect(data).toBeTruthy();
        });

        flush();

      })));

  it('should return an error from the api',
   inject([UserDefaultPropertiesMockService, HttpTestingController],
      fakeAsync((propertiesResourceService: UserDefaultPropertiesMockService, httpTestingController: HttpTestingController) => {
        propertiesResourceService.getLocations().subscribe((response: Response) => {
          },
          (error: Error) => {
            expect(error).toBeTruthy();
          });
          flush();
      })));

  it('should set and get location property',
    inject([UserDefaultPropertiesMockService, LocalStorageService],
      (propertiesResourceService: UserDefaultPropertiesMockService
        , localStore: LocalStorageService) => {

        expect(propertiesResourceService.getCurrentUserDefaultLocation())
          .toEqual('userDefaultLocationtest');
        propertiesResourceService.setUserProperty('test', '123');
        expect(localStore.getItem('test')).toEqual('123');

      }));

});
