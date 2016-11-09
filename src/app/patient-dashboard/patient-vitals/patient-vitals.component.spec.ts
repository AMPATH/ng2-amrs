import {MockBackend,} from '@angular/http/testing';
import {Http, BaseRequestOptions,Response,ResponseOptions} from '@angular/http';
import { TestBed, inject,async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import {AppSettingsService} from '../../app-settings/app-settings.service';
import {LocalStorageService} from '../../utils/local-storage.service';
import { VitalsResourceService} from '../../etl-api/vitals-resource.service';
import { MockVitalsResourceService} from '../../etl-api/vitals-resource.service.mock';
import { PatientVitalsComponent } from './patient-vitals.component';

describe('Component: Vitals Unit Tests', () => {

  let vitalsResourceService: VitalsResourceService , fakeAppFeatureAnalytics: AppFeatureAnalytics ,component;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        FakeAppFeatureAnalytics,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: VitalsResourceService,
          useClass: MockVitalsResourceService
        },
        AppSettingsService,
        LocalStorageService
      ]
    });

    vitalsResourceService = TestBed.get(VitalsResourceService);
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component=new PatientVitalsComponent(vitalsResourceService,fakeAppFeatureAnalytics);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });

  it('should have required properties', (done) => {

    expect(component.encounters.length).toBe(0);
    expect(component.isBusy).toBeUndefined();
    expect(component.nextStartIndex).toBe('0');
    expect(component.dataLoaded).toBe(false);
    expect(component.experiencedLoadingError).toBe(false);
    expect(component.patientUuid).toBe('');

    done();

  });

  it('should have all the required functions defined and callable', (done) => {

    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();

    spyOn(component, 'loadVitals').and.callFake((err,data)=>{});
    component.loadVitals('','0','10',(err,data)=>{});
    expect(component.loadVitals).toHaveBeenCalled();

    spyOn(component, 'loadMoreVitals').and.callThrough();
    component.loadMoreVitals();
    expect(component.loadMoreVitals).toHaveBeenCalled();

    done();

  });

});
