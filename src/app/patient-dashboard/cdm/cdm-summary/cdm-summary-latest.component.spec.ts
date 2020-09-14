import { TestBed, inject, async } from '@angular/core/testing';
import { PatientService } from '../../services/patient.service';
import { CdmSummaryResourceService } from '../../../etl-api/cdm-summary-resource.service';
import { CdmSummaryLatestComponent } from './cdm-summary-latest.component';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';

describe('Component: CdmSummaryLatest Unit Tests', () => {
  let component: CdmSummaryLatestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppSettingsService,
        PatientService,
        PatientResourceService,
        LocalStorageService,
        PatientProgramService,
        RoutesProviderService,
        ProgramService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ProgramResourceService,
        EncounterResourceService,
        CdmSummaryLatestComponent,
        CdmSummaryResourceService
      ],
      imports: [HttpClientTestingModule]
    });
    component = TestBed.get(CdmSummaryLatestComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should have all the required functions defined', (done) => {
    expect(component.getPatient).toBeDefined();
    expect(component.loadCdmSummary).toBeDefined();
    done();
  });
});
