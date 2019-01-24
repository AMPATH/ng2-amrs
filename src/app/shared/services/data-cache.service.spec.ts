
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from './data-cache.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
// Load the implementations that should be tested

class MockCacheStorageService {
  constructor(a, b) {}

  public ready() {
    return true;
  }
}
describe('Service : DataCacheService Unit Tests', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        CacheService,
        DataCacheService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        }
      ],
      imports: [
        CacheModule,
        HttpClientTestingModule
      ]
    });
  }));
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([DataCacheService], (dataCache: DataCacheService) => {
      expect(dataCache).toBeDefined();
    }));

  it('should have all methods defined',
    inject([DataCacheService], (dataCache: DataCacheService) => {
      expect(dataCache.setDefaulTime).toBeDefined();
      expect(dataCache.cacheRequest).toBeDefined();
      expect(dataCache.clearExpired).toBeDefined();
      expect(dataCache.clearAll).toBeDefined();
      expect(dataCache.disableCache).toBeDefined();
      expect(dataCache.cacheSingleRequest).toBeDefined();
    }));
});
