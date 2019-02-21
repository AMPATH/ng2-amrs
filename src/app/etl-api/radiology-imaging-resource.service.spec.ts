import { async, inject, TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService, CacheModule } from 'ionic-cache';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { RadiologyImagingResourceService } from './radiology-imaging-resource.service';

class MockCacheStorageService {
    constructor(a, b) { }

    public ready() {
        return true;
    }
}

describe('Service : Radio Imaging  Resource Service Unit Tests', () => {
    let service, httpMock;
    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [CacheModule, HttpClientTestingModule],
            providers: [
                RadiologyImagingResourceService,
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                },
                AppSettingsService,
                LocalStorageService,
                DataCacheService,
                CacheService
            ]

        });
        service = TestBed.get(RadiologyImagingResourceService);
        httpMock = TestBed.get(HttpTestingController);

    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });


    it('Should be defined with all the dependancies', async(() => {
        expect(service).toBeDefined();
    }));

});
