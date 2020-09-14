import { TestBed, inject, async } from '@angular/core/testing';

import * as _ from 'lodash';

import { FileUploadResourceService } from '../../../etl-api/file-upload-resource.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { PatientService } from '../../services/patient.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocatorMapComponent } from './locator-map.component';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';

describe('Component: Lab Test Orders Unit Tests', () => {
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocatorMapComponent,
        FileUploadResourceService,
        AppSettingsService,
        LocalStorageService,
        PatientService,
        PatientResourceService,
        PatientProgramService,
        RoutesProviderService,
        ProgramService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ProgramResourceService,
        EncounterResourceService,
        PersonResourceService
      ],
      imports: [HttpClientTestingModule]
    });

    component = TestBed.get(LocatorMapComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    expect(component).toBeTruthy();
    done();
  });
});
