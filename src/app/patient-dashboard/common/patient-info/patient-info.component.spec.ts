/* tslint:disable:no-unused-variable */
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
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService
} from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Component: PatientInfo', () => {
  let component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        PatientInfoComponent,
        PatientService,
        ProgramService,
        PatientProgramService,
        RoutesProviderService,
        ProgramResourceService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        EncounterResourceService,
        AppSettingsService,
        LocalStorageService,
        PatientResourceService,
        {
          provide: AppFeatureAnalytics, useFactory: () => {
            return new FakeAppFeatureAnalytics();
          }, deps: []
        }
      ]

    });
    component = TestBed.get(PatientInfoComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
