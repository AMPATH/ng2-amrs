/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, inject } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { FormDataSourceService } from './form-data-source.service';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { FakeProviderResourceService } from '../../openmrs-api/provider-resource.service.mock';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { ConceptResourceService } from '../../openmrs-api/concept-resource.service';

describe('Service: FormDataSourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormDataSourceService,
        LocationResourceService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,
        ConceptResourceService,
        LocalStorageService,
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

    result.subscribe((results) => {
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
          .and.callFake(function (params) {
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
        expect(providerResourceService.getProviderByPersonUuid).toHaveBeenCalled();

      })));

  it('should find provider when getProviderByProviderUuid is called' +
    ' with a provider uuid', inject([ProviderResourceService],
      fakeAsync((providerResourceService: ProviderResourceService) => {
        let service: FormDataSourceService = TestBed.get(FormDataSourceService);
        let uuid: string = 'provider-uuid-1';
        spyOn(providerResourceService, 'getProviderByUuid')
          .and.callFake(function (params) {
            let subject = new BehaviorSubject<any>({});
            subject.next({
              uuid: 'uuid',
              display: 'display'
            });
            return subject;
          });
        //
        service.getProviderByUuid(uuid);
        expect(providerResourceService.getProviderByUuid).toHaveBeenCalled();

      })));

  it('should find location by search text', (done) => {
    let service: FormDataSourceService = TestBed.get(FormDataSourceService);
    let result = service.findLocation('test');

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      done();
    });

  });

  it('should get location by location uuid', (done) => {
    let service: FormDataSourceService = TestBed.get(FormDataSourceService);
    let result = service.getLocationByUuid('08feae7c-1352-11df-a1f1-0026b9348838');

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      done();
    });

  });

});
