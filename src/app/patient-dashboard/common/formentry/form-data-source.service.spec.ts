/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { FormDataSourceService } from './form-data-source.service';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { FakeProviderResourceService } from '../../../openmrs-api/provider-resource.service.mock';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { CacheModule, CacheService } from 'ionic-cache';
import { AppSettingsService } from '../../../app-settings';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { DataCacheService } from '../../../shared/services/data-cache.service';

describe('Service: FormDataSourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacheModule],
      providers: [
        FormDataSourceService,
        LocationResourceService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,
        ConceptResourceService,
        LocalStorageService,
        DataCacheService,
        CacheService,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: ProviderResourceService, useFactory: () => {
          return new FakeProviderResourceService(null, null, null);
        }, deps: []
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    let service: FormDataSourceService = TestBed.get(FormDataSourceService);
    expect(service).toBeTruthy();
  });

  it('should find for provider by search text', (done) => {
    let service: FormDataSourceService = TestBed.get(FormDataSourceService);
    let result = service.findProvider('text');

    result.take(1).subscribe((results) => {
      expect(results).toBeTruthy();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]['value']).toEqual('uuid');
      done();
    });

  });

  it('should  find provider when getProviderByPersonUuid is called' +
    ' with a person uuid', inject([ProviderResourceService],
    fakeAsync((providerResourceService: ProviderResourceService) => {
      let service: FormDataSourceService = TestBed.get(FormDataSourceService);
      let uuid: string = 'person-uuid-1';
      spyOn(providerResourceService, 'getProviderByPersonUuid')
        .and.callFake((params) => {
        let subject = new BehaviorSubject<any>({});
        subject.next({
          person: {
            uuid: 'uuid',
            display: 'display'
          }
        });
        return subject;
      });
      //
      service.getProviderByPersonUuid(uuid);
      tick(50);
      expect(providerResourceService.getProviderByPersonUuid).toHaveBeenCalled();

    })));

  it('should find provider when getProviderByProviderUuid is called' +
    ' with a provider uuid', inject([ProviderResourceService],
    fakeAsync((providerResourceService: ProviderResourceService) => {
      let service: FormDataSourceService = TestBed.get(FormDataSourceService);
      let uuid: string = 'provider-uuid-1';
      spyOn(providerResourceService, 'getProviderByUuid')
        .and.callFake((params) => {
        let subject = new BehaviorSubject<any>({});
        subject.next({
          uuid: 'uuid',
          display: 'display'
        });
        return subject;
      });
      //
      service.getProviderByUuid(uuid);
      tick(50);
      expect(providerResourceService.getProviderByUuid).toHaveBeenCalled();

    })));

  it('should find location by search text', (done) => {
    let service: FormDataSourceService = TestBed.get(FormDataSourceService);
    let result = service.findLocation('test');

    result.take(1).subscribe((results) => {
      expect(results).toBeTruthy();
      done();
    });

  });

  it('should get location by location uuid', inject([LocationResourceService],
    fakeAsync((locationResourceService: LocationResourceService) => {
      let service: FormDataSourceService = TestBed.get(FormDataSourceService);
      let uuid: string = 'location-uuid-1';
      spyOn(locationResourceService, 'getLocationByUuid')
        .and.callFake((params) => {
        let subject = new BehaviorSubject<any>({});
        subject.next({
          uuid: 'uuid',
          display: 'display'
        });
        return subject;
      });
      //
      service.getLocationByUuid(uuid);
      tick(50);
      expect(locationResourceService.getLocationByUuid).toHaveBeenCalled();

    })));

});
