import {
  inject,
  TestBed
} from '@angular/core/testing';

import { AppState } from './app.service';
import { CacheService } from 'ionic-cache';
import { DataCacheService } from './shared/services/data-cache.service';

describe('App', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DataCacheService,
      CacheService,
      AppState
    ]
  }));

  it('should have a name', inject([AppState], (app: AppState) => {
    expect(app).toBeTruthy();
  }));

});
