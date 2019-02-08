import { TestBed, inject } from '@angular/core/testing';
import { DrugOrderService } from './drug-order.service';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocationResourceService } from 'src/app/openmrs-api/location-resource.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { OderSetResourceService } from 'src/app/openmrs-api/oder-set-resource.service';
import { ProviderResourceService } from 'src/app/openmrs-api/provider-resource.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { DrugResourceService } from 'src/app/openmrs-api/drug-resource.service';
import { PersonResourceService } from 'src/app/openmrs-api/person-resource.service';
import { DataCacheService } from 'src/app/shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

class MockCacheStorageService {
    constructor(a, b) { }
    public ready() {
        return true;
    }
  }
describe('DrugOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      providers: [DrugOrderService,
        AppSettingsService,
        LocalStorageService,
        LocationResourceService,
        OrderResourceService,
        DataCacheService,
        ConceptResourceService,
        OderSetResourceService,
        {
            provide: CacheStorageService, useFactory: () => {
                return new MockCacheStorageService(null, null);
            }
        },
          CacheService,
        ProviderResourceService,
        DrugResourceService,
        DomSanitizer,
        OrderResourceService,
        PersonResourceService

    ]
    });
  });

  it('should be created', inject([DrugOrderService], (service: DrugOrderService) => {
    expect(service).toBeTruthy();
  }));
});
