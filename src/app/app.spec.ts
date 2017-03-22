import {
  inject,
  TestBed
} from '@angular/core/testing';

// Load the implementations that should be tested
import { App } from './app.component';
import { AppState } from './app.service';
import { CacheService } from 'ionic-cache/ionic-cache';
import { DataCacheService } from './shared/services/data-cache.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  let router = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AppState,
      App,
      DataCacheService,
      CacheService,
      { provide: Router, useValue: router },
      {
        provide: ActivatedRoute,
        useValue: {
          queryParams: Observable.of({ }),
          params: Observable.of({ }),
          data: Observable.of({}),
          snapshot: { params: {} }
        }
      },
      Title
    ]}));

  it('should have a name', inject([ App ], (app: App) => {
    expect(app.name).toBeTruthy();
  }));

});
