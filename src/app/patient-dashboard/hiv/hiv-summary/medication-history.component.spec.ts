import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { MedicationHistoryComponent } from './medication-history.component';
import { MedicationHistoryResourceService } from '../../../etl-api/medication-history-resource.service';
import { PatientService } from '../../services/patient.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { ProgramEnrollmentResourceService } from '../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Component: Medication History Unit Tests', () => {
  let medicationHistoryResourceService: MedicationHistoryResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics,
    component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PatientService,
        ProgramService,
        ProgramResourceService,
        FakeAppFeatureAnalytics,
        MedicationHistoryComponent,
        PatientResourceService,
        PatientProgramService,
        RoutesProviderService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: MedicationHistoryResourceService
        },
        AppSettingsService,
        LocalStorageService
      ]
    });

    medicationHistoryResourceService = TestBed.get(
      MedicationHistoryResourceService
    );
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = TestBed.get(MedicationHistoryComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should have required properties', (done) => {
    expect(component.encounters.length).toBe(0);
    done();
  });

  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'fetchMedicationHistory').and.callFake((err, data) => {});
    component.fetchMedicationHistory('report', 'uuid', (err, data) => {});
    expect(component.fetchMedicationHistory).toHaveBeenCalled();
    spyOn(component, 'getPatient').and.callFake((err, data) => {});
    component.getPatient((err, data) => {});
    expect(component.getPatient).toHaveBeenCalled();

    done();
  });
});
