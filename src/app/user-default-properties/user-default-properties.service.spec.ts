import { TestBed, async, inject, flush, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { UserService } from '../openmrs-api/user.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { UserDefaultPropertiesMockService } from './user-default-properties.service.mock';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheModule, CacheService } from 'ionic-cache';
import {
  FakeRetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry-mock.service';
import {
  RetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry.service';

describe('User Default Service Unit Tests', () => {

  let httpMock: HttpTestingController;
  let userSettings: UserDefaultPropertiesMockService;
  let appSettings: AppSettingsService;
  const getUrl = 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/location?v=default';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
        HttpClientTestingModule,
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
    userSettings = TestBed.get(UserDefaultPropertiesMockService);
    appSettings = TestBed.get(AppSettingsService);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
    new LocalStorageService().remove('test');
  });

  it('should be injected with all dependencies',
    inject([UserService, LocalStorageService, AppSettingsService],
      (user: UserService, localStore: LocalStorageService, appSettingsServ: AppSettingsService) => {
        expect(user).toBeDefined();
        expect(localStore).toBeDefined();
        expect(appSettingsServ).toBeDefined();
      }));

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
