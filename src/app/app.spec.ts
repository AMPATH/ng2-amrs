import {
  inject,
  TestBed
} from '@angular/core/testing';

// Load the implementations that should be tested
import { App } from './app.component';
import { AppState } from './app.service';
import { CacheService } from 'ionic-cache/ionic-cache';
import { DataCacheService } from './shared/services/data-cache.service';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AppState,
      App,
      DataCacheService,
      CacheService
    ]}));

  it('should have a name', inject([ App ], (app: App) => {
    expect(app.name).toBeTruthy();
  }));

});
