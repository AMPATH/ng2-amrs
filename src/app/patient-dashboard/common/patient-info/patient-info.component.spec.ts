/* tslint:disable:no-unused-variable */
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';

import { PatientInfoComponent } from './patient-info.component';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { PatientService } from '../../services/patient.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { AppSettingsService } from '../../../app-settings';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService
} from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';

describe('Component: PatientInfo', () => {
  let component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        PatientInfoComponent,
        PatientService,
        ProgramService,
        PatientProgramService,
        RoutesProviderService,
        ProgramResourceService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
        AppSettingsService,
        LocalStorageService,
        PatientResourceService,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AppFeatureAnalytics, useFactory: () => {
            return new FakeAppFeatureAnalytics();
          }, deps: []
        }
      ]

    });
    component = TestBed.get(PatientInfoComponent);
  });

  it('should create an instance', () => {

    expect(component).toBeTruthy();
  });
});
