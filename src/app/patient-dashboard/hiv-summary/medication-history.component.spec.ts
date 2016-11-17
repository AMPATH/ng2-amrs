
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { MedicationHistoryComponent } from './madication-history.component';
import { MedicationHistoryResourceService } from
  '../../etl-api/medication-history-resource.service';

describe('Component: Medication History Unit Tests', () => {

  let medicationHistoryResourceService: MedicationHistoryResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component;

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
          provide: MedicationHistoryResourceService,
        },
        AppSettingsService,
        LocalStorageService
      ]
    });

    medicationHistoryResourceService = TestBed.get(MedicationHistoryResourceService);
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = new MedicationHistoryComponent(medicationHistoryResourceService,
      fakeAppFeatureAnalytics);

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
    done();

  });

  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'fetchMedicationHistory').and.callFake((err, data) => { });
    component.fetchMedicationHistory('report', 'uuid', (err, data) => { });
    expect(component.fetchMedicationHistory).toHaveBeenCalled();
    spyOn(component, 'getPatient').and.callFake((err, data) => { });
    component.getPatient( (err, data) => { });
    expect(component.getPatient).toHaveBeenCalled();


    done();

  });

});
