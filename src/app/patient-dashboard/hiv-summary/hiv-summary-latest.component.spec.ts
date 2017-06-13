import { TestBed, inject, async } from '@angular/core/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { HivSummaryService } from './hiv-summary.service';
import { HivSummaryLatestComponent } from './hiv-summary-latest.component';
import { PatientService } from '../patient.service';
import { HivSummaryResourceService } from '../../etl-api/hiv-summary-resource.service';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { ProgramEnrollmentResourceService }
  from '../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';

describe('Component: HivSummaryLatest Unit Tests', () => {

  let hivSummaryService: HivSummaryService,
    patientService: PatientService, component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HivSummaryService,
        HivSummaryResourceService,
        PatientService,
        PatientResourceService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
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
         LocalStorageService
      ]
    });

    hivSummaryService = TestBed.get(HivSummaryService);
    patientService = TestBed.get(PatientService);

    component = new HivSummaryLatestComponent(hivSummaryService, patientService);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });

  it('should have required properties', (done) => {

    expect(component.hivSummary).toBeUndefined();
    expect(component.loadingHivSummary).toBe(false);
    expect(component.errors.length).toBe(0);
    expect(component.patient).toBeUndefined();
    expect(component.patientUuid).toBeUndefined();
    expect(component.subscription).toBeUndefined();

    done();

  });

  it('should have all the required functions defined and callable', (done) => {

    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();

    spyOn(component, 'getPatient').and.callThrough();
    component.getPatient();
    expect(component.getPatient).toHaveBeenCalled();
    done();

    spyOn(component, 'loadHivSummary').and.callThrough();
    component.loadHivSummary();
    expect(component.loadHivSummary).toHaveBeenCalled();
    done();

  });

});
