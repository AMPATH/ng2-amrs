/* tslint:disable:no-unused-variable 

import { TestBed, async } from '@angular/core/testing';
import { FormsComponent } from './forms.component';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';

describe('Component: Forms', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          FormsComponent,
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
    const component = TestBed.get(FormsComponent);
    expect(component).toBeTruthy();
  });
});*/


