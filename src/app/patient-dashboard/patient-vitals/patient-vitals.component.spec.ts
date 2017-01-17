import { PatientVitalsService } from './patient-vitals.service';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { PatientVitalsComponent } from './patient-vitals.component';
import { PatientService } from '../patient.service';
import { VitalsResourceService } from '../../etl-api/vitals-resource.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService } from '../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';

describe('Component: Vitals Unit Tests', () => {

  let patientVitalsService: PatientVitalsService, patientService: PatientService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        PatientVitalsService,
        VitalsResourceService,
        BaseRequestOptions,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
        PatientService,
        PatientResourceService,
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
        AppSettingsService,
        LocalStorageService
      ]
    });

    patientVitalsService = TestBed.get(PatientVitalsService);
    patientService = TestBed.get(PatientService);
    component = new PatientVitalsComponent(patientVitalsService, patientService);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });

  it('should have required properties', (done) => {

    expect(component.vitals.length).toBe(0);
    expect(component.patient).toBeUndefined();
    expect(component.dataLoaded).toBe(false);
    expect(component.loadingVitals).toBe(false);
    expect(component.errors.length).toBe(0);

    done();

  });

  it('should have all the required functions defined and callable', (done) => {

    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();

    spyOn(component, 'loadVitals').and.callThrough();
    component.loadVitals();
    expect(component.loadVitals).toHaveBeenCalled();

    done();

  });

});
