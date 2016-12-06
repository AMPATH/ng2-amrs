/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { HivSummaryComponent } from './hiv-summary.component';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';

describe('Component: Hiv Summary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AppFeatureAnalytics, useFactory: () => {
          return new FakeAppFeatureAnalytics();
        }, deps: []
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    let fakeAppFeatureAnalytics: AppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    let component = new HivSummaryComponent(fakeAppFeatureAnalytics);
    expect(component).toBeTruthy();
  });
});

