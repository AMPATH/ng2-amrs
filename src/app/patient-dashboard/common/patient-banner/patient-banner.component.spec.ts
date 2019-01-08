/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { PatientBannerComponent } from './patient-banner.component';
import { PatientService } from '../../services/patient.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
describe('Component: PatientBanner', () => {
  let component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientBannerComponent,
        PatientService,
        PatientResourceService,
        AppSettingsService,
        LocalStorageService,
        PatientProgramService,
        RoutesProviderService,
        ProgramService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ProgramResourceService,
        EncounterResourceService
      ],
      imports: [ HttpClientTestingModule ]
    });
    component = TestBed.get(PatientBannerComponent);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
