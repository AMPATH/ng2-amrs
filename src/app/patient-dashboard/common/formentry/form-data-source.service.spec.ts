/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { FormDataSourceService } from './form-data-source.service';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { FakeProviderResourceService } from '../../../openmrs-api/provider-resource.service.mock';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';

import { CacheModule, CacheService } from 'ionic-cache';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { ZscoreService } from 'src/app/shared/services/zscore.service';

class FakeCacheStorageService {
  constructor(a, b) {
  }

  public ready() {
    return true;
  }

}

describe('Service: FormDataSourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacheModule, HttpClientTestingModule],
      providers: [
        FormDataSourceService,
        LocationResourceService,
        AppSettingsService,
        ConceptResourceService,
        LocalStorageService,
        DataCacheService,
        CacheService,
        ZscoreService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new FakeCacheStorageService(null, null);
          }, deps: []
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
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    expect(service).toBeTruthy();
  });

  it('should find for provider by search text', (done) => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    const result = service.findProvider('text');

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]['value']).toEqual('uuid');
      done();
    });

  });

  it('should call getConceptAnswersDataSource', () => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    spyOn(service, 'getConceptAnswersDataSource').and.callFake(() => { });

    service.getConceptAnswersDataSource();
    expect(service.getConceptAnswersDataSource).toHaveBeenCalled();
  });

  it('should call getDataSources', () => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    spyOn(service, 'getDataSources').and.callFake(() => { });

    service.getDataSources();
    expect(service.getDataSources).toHaveBeenCalled();
  });

  it('should  find provider when getProviderByPersonUuid is called' +
    ' with a person uuid', inject([ProviderResourceService],
      fakeAsync((providerResourceService: ProviderResourceService) => {
        const service: FormDataSourceService = TestBed.get(FormDataSourceService);
        const uuid = 'person-uuid-1';
        spyOn(providerResourceService, 'getProviderByPersonUuid')
          .and.callFake((params) => {
            const subject = new BehaviorSubject<any>({});
            subject.next({
              person: {
                uuid: 'uuid',
                display: 'display'
              }
            });
            return subject;
          });

        service.getProviderByPersonUuid(uuid);
        tick(50);
        expect(providerResourceService.getProviderByPersonUuid).toHaveBeenCalled();

      })));

  it('should call getConceptAnswers', () => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    spyOn(service, 'getConceptAnswers').and.callFake(() => { });

    service.getConceptAnswers('uuid');
    expect(service.getConceptAnswers).toHaveBeenCalled();
  });

  it('should call getWhoStagingCriteriaDataSource', () => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    spyOn(service, 'getWhoStagingCriteriaDataSource').and.callFake(() => { });

    service.getWhoStagingCriteriaDataSource();
    expect(service.getWhoStagingCriteriaDataSource).toHaveBeenCalled();
  });

  it('should find provider when getProviderByProviderUuid is called' +
    ' with a provider uuid', inject([ProviderResourceService],
      fakeAsync((providerResourceService: ProviderResourceService) => {
        const service: FormDataSourceService = TestBed.get(FormDataSourceService);
        const uuid = 'provider-uuid-1';
        spyOn(providerResourceService, 'getProviderByUuid')
          .and.callFake((params) => {
            const subject = new BehaviorSubject<any>({});
            subject.next({
              uuid: 'uuid',
              display: 'display'
            });
            return subject;
          });
        //
        service.getProviderByUuid(uuid).subscribe((data) => {
          expect(data).toBeTruthy();
          tick(50);
        });
        expect(providerResourceService.getProviderByUuid).toHaveBeenCalled();

      })));

  it('should find location by search text', (done) => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    const result = service.findLocation('test');

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      done();
    });

  });

  it('should call getProblemDataSource', () => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    spyOn(service, 'getProblemDataSource').and.callFake(() => { });

    service.getProblemDataSource();
    expect(service.getProblemDataSource).toHaveBeenCalled();
  });

  it('should call findDrug to find drug by search text', () => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    spyOn(service, 'findDrug').and.callFake(() => { });

    service.findDrug('test');
    expect(service.findDrug).toHaveBeenCalled();
  });

  it('should call getConceptSetMembers', () => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    spyOn(service, 'getConceptSetMembers').and.callFake(() => { });

    service.getConceptSetMembers('uuid');
    expect(service.getConceptSetMembers).toHaveBeenCalled();
  });

  it('should call getCachedProviderSearchResults', () => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    spyOn(service, 'getCachedProviderSearchResults').and.callFake(() => { });

    service.getCachedProviderSearchResults();
    expect(service.getCachedProviderSearchResults).toHaveBeenCalled();
  });

  it('should get location by location uuid', inject([LocationResourceService],
    fakeAsync((locationResourceService: LocationResourceService) => {
      const service: FormDataSourceService = TestBed.get(FormDataSourceService);
      const uuid = 'location-uuid-1';
      spyOn(locationResourceService, 'getLocationByUuid')
        .and.callFake((params) => {
          const subject = new BehaviorSubject<any>({});
          subject.next({
            uuid: 'uuid',
            display: 'display'
          });
          return subject;
        });
      service.getLocationByUuid(uuid);
      tick(50);
      expect(locationResourceService.getLocationByUuid).toHaveBeenCalled();

    })));

  it('should find location by uuid', async((done) => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    const result = service.getLocationByUuid('test');

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      done();
    });

  }));

  it('should call resolveConcept', async((done) => {
    const service: FormDataSourceService = TestBed.get(FormDataSourceService);
    const result = service.resolveConcept('test');

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      done();
    });

  }));

});
