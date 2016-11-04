
import { TestBed, async } from '@angular/core/testing';

import { VitalsResourceService} from '../../etl-api/vitals-resource.service'
import { PatientVitalsComponent } from './patient-vitals.component';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';

describe('Component: PatientVitals', () => {
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
    let service = TestBed.get(VitalsResourceService);
    let component = new PatientVitalsComponent(service,fakeAppFeatureAnalytics);
    expect(component).toBeTruthy();
  });
});


