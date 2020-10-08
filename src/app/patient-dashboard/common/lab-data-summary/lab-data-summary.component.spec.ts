/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { LabDataSummaryComponent } from './lab-data-summary.component';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';

describe('Component: Lab Data Summary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AppFeatureAnalytics,
          useFactory: () => {
            return new FakeAppFeatureAnalytics();
          },
          deps: []
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    const fakeAppFeatureAnalytics: AppFeatureAnalytics = TestBed.get(
      AppFeatureAnalytics
    );
    const component = new LabDataSummaryComponent(fakeAppFeatureAnalytics);
    expect(component).toBeTruthy();
  });
});
