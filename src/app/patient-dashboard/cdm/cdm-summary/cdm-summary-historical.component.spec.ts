import { TestBed, inject, async } from '@angular/core/testing';
import { PatientService } from '../../services/patient.service';
import { CdmSummaryHistoricalComponent } from './cdm-summary-historical.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CdmSummaryResourceService } from '../../../etl-api/cdm-summary-resource.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { CdmSummaryLatestComponent } from './cdm-summary-latest.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Component: CdmSummaryHistorical Unit Tests', () => {
  let component;

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
        AppSettingsService,
        PatientService,
        NgxPaginationModule,
        CdmSummaryHistoricalComponent,
        CdmSummaryResourceService
      ],
      imports: [HttpClientTestingModule]
    });

    component = TestBed.get(CdmSummaryHistoricalComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should have required properties', (done) => {
    expect(component.cdmSummaries.length).toBe(0);
    expect(component.patient).toBeUndefined();
    expect(component.patientUuid).toBeUndefined();
    expect(component.dataLoaded).toBe(false);
    expect(component.loadingCdmSummary).toBe(false);
    expect(component.errors.length).toBe(0);
    done();
  });
});
