import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppState } from './app.service';
import { DataCacheService } from './shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { PouchdbService } from './pouchdb-service/pouchdb.service';

class MockCacheStorageService {
  constructor(a, b) { }

  public ready() {
    return true;
  }
}

describe('AppComponent', () => {
  let appComponent: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent
      ],
      providers: [AppComponent, AppState, DataCacheService, CacheService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        }, PouchdbService
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    appComponent = TestBed.get(AppComponent);
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });
  it('should return true', () => {
    expect(appComponent).toBeDefined();
  });
});
