import { PatientVitalsService } from './patient-vitals.service';
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientVitalsComponent } from './patient-vitals.component';
import { PatientService } from '../../services/patient.service';
import { VitalsResourceService } from '../../../etl-api/vitals-resource.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import {
  ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import {
  ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ZscoreService } from 'src/app/shared/services/zscore.service';
import { SelectDepartmentService } from 'src/app/shared/services/select-department.service';

describe('Component: Vitals Unit Tests', () => {

  let localStorageService: LocalStorageService, selectDepartmentService: SelectDepartmentService,
   patientVitalsService: PatientVitalsService, patientService: PatientService,
    component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientVitalsService,
        VitalsResourceService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        EncounterResourceService,
        PatientService,
        ProgramService,
        PatientProgramService,
        SelectDepartmentService,
        ProgramResourceService,
        RoutesProviderService,
        PatientResourceService,
        FakeAppFeatureAnalytics,
        ZscoreService,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        AppSettingsService,
        LocalStorageService
      ],
      imports: [HttpClientTestingModule]
    });

    patientVitalsService = TestBed.get(PatientVitalsService);
    patientService = TestBed.get(PatientService);
    selectDepartmentService = TestBed.get(SelectDepartmentService);
    localStorageService = TestBed.get(LocalStorageService);
    component = new PatientVitalsComponent(patientVitalsService, patientService,
      selectDepartmentService, localStorageService);

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
    expect(component.isDepartmentOncology).toBe(false);

    done();

  });

});
