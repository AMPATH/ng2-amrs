
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { CacheService } from 'ionic-cache/ionic-cache';
import { DataCacheService } from './data-cache.service';
// Load the implementations that should be tested

describe('Service : DataCacheService Unit Tests', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        CacheService,
        DataCacheService
      ],
    });
  }));
  afterEach(() => {
    TestBed.resetTestingModule();
  });

    it('should be injected with all dependencies',
    inject([DataCacheService], (dataCache: DataCacheService) => {
        expect(dataCache).toBeTruthy();
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
