import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { TodaysVitalsComponent } from './todays-vitals.component';
import { PatientService } from '../patient.service';
import { VisitResourceService } from '../../openmrs-api/visit-resource.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { Patient } from '../../models/patient.model';

import { Vital } from '../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';
import { FakeVisitResourceService } from '../../openmrs-api/fake-visit-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';

describe('Component: Vitals Unit Tests', () => {

  let vitalsService: TodaysVitalsService, patientService: PatientService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        TodaysVitalsService,
        BaseRequestOptions,
        PatientService,
        PatientResourceService,
        FakeAppFeatureAnalytics,
        VisitResourceService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
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
          provide: VisitResourceService,
          useClass: FakeVisitResourceService
        },
        AppSettingsService,
        LocalStorageService
      ]
    });

    patientService = TestBed.get(PatientService);
    vitalsService = TestBed.get(TodaysVitalsService);

    component = new TodaysVitalsComponent(patientService, vitalsService);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });

  it('should have required properties', (done) => {

    expect(component.todaysVitals.length).toBe(0);
    expect(component.patient).toBeUndefined();
    expect(component.loadingTodaysVitals).toBe(false);
    expect(component.errors.length).toBe(0);

    done();

  });

  it('should have all the required functions defined and callable', (done) => {

    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    spyOn(component, 'loadTodaysVitals').and.callThrough();
    component.loadTodaysVitals();
    expect(component.loadTodaysVitals).toHaveBeenCalled();

    done();

  });

});
