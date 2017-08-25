
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { AddressComponent } from './address.component';
import { PatientService } from '../../services/patient.service';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';

describe('Component: Address Unit Tests', () => {

  let patientResourceService: PatientResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
        BaseRequestOptions,
        FakeAppFeatureAnalytics,
        PatientService,
        ProgramResourceService,
        PatientProgramService,
        ProgramService,
        RoutesProviderService,
        AddressComponent,
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
          provide: PatientResourceService,
        },
        AppSettingsService,
        LocalStorageService
      ]
    });

    patientResourceService = TestBed.get(PatientResourceService);
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = TestBed.get(AddressComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    expect(component).toBeTruthy();
    done();

  });
  it('should have  the required functions defined and callable', (done) => {
    spyOn(component, 'getPatient').and.callFake((err, data) => { });
    component.getPatient((err, data) => { });
    expect(component.getPatient).toHaveBeenCalled();
    done();

  });

});

