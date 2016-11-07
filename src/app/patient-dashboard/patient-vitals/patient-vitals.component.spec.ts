import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';

// Load the implementations that should be tested
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { VitalsResourceService} from '../../etl-api/vitals-resource.service'
import { PatientVitalsComponent } from './patient-vitals.component';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';

describe('LoginComponent Unit Tests', () => {

  let fakeAppFeatureAnalytics : AppFeatureAnalytics,service,component;

  beforeEach(() => {

    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    service = TestBed.get(VitalsResourceService);
    component = new PatientVitalsComponent(service,fakeAppFeatureAnalytics);

    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        AppSettingsService,
        VitalsResourceService
      ]
    })
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have required properties', ()=> {

    expect(component.encounters).toBeTruthy();
    expect(component.isBusy).toBeTruthy();
    expect(component.nextStartIndex).toBeTruthy();
    expect(component.dataLoaded).toBeTruthy();
    expect(component.experiencedLoadingError).toBeTruthy();
    expect(component.patientUuid).toBeTruthy();

  });

  it('should have all the required functions', () => {
    expect(component.ngOnInit()).toBeDefined();
    expect(component.loadVitals()).toBeDefined();
    expect(component.loadMoreVitals()).toBeDefined();
  });


});


