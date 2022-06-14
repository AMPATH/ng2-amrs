import { TestBed, inject, async } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { HivSummaryService } from './hiv-summary.service';
import { HivSummaryLatestComponent } from './hiv-summary-latest.component';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
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
import { PatientService } from '../../services/patient.service';
import { CervicalCancerScreeningSummaResourceService } from './../../../etl-api/cervical-cancer-screening-summary-resource.service';
import { Covid19ResourceService } from './../../../etl-api/covid-19-resource-service';
import { DataCacheService } from './../../../shared/services/data-cache.service';

interface Covid19StatusSummary {
  vaccination_status: string;
  vaccination_status_code: string;
  vaccination_status_code_message: string;
  date_given_first_dose?: Date;
  first_dose_vaccine_administered: string;
  date_given_second_dose?: Date;
  second_dose_vaccine_administered: string;
}
const mockCovid19StatusSummaryResponse: Covid19StatusSummary = {
  vaccination_status: '1',
  vaccination_status_code: '1',
  vaccination_status_code_message: '',
  date_given_first_dose: new Date(),
  first_dose_vaccine_administered: 'ASTRAZENECA',
  date_given_second_dose: new Date(),
  second_dose_vaccine_administered: 'MODERNA'
};

class FakeCovid19ResourceService {
  constructor() {}
  getCovid19VaccinationStatus(): Observable<Covid19StatusSummary> {
    return Observable.of(mockCovid19StatusSummaryResponse);
  }
}

describe('Component: HivSummaryLatest Unit Tests', () => {
  let hivSummaryService: HivSummaryService,
    patientResourceService: PatientResourceService,
    patientService: PatientService,
    encounterService: EncounterResourceService,
    cervicalCancerScreeningSummaResourceService: CervicalCancerScreeningSummaResourceService,
    covid19VaccineService: Covid19ResourceService,
    component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HivSummaryService,
        HivSummaryResourceService,
        PatientResourceService,
        ProgramService,
        ProgramResourceService,
        PatientProgramService,
        RoutesProviderService,
        PatientResourceService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        AppSettingsService,
        LocalStorageService,
        PatientService,
        CervicalCancerScreeningSummaResourceService,
        {
          provide: Covid19ResourceService,
          useFactory: () => {
            return new FakeCovid19ResourceService();
          }
        }
      ]
    });

    hivSummaryService = TestBed.get(HivSummaryService);
    patientResourceService = TestBed.get(PatientResourceService);
    patientService = TestBed.get(PatientService);
    encounterService = TestBed.get(EncounterResourceService);
    cervicalCancerScreeningSummaResourceService = TestBed.get(
      CervicalCancerScreeningSummaResourceService
    );
    covid19VaccineService = TestBed.get(Covid19ResourceService);

    component = new HivSummaryLatestComponent(
      hivSummaryService,
      encounterService,
      patientService,
      patientResourceService,
      cervicalCancerScreeningSummaResourceService,
      covid19VaccineService
    );
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
    expect(component.subscription).toBeDefined();

    done();
  });

  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();

    spyOn(component, 'loadHivSummary').and.callThrough();
    component.loadHivSummary();
    expect(component.loadHivSummary).toHaveBeenCalled();

    spyOn(component, 'loadPatient').and.callThrough();
    component.loadPatient();
    expect(component.loadPatient).toHaveBeenCalled();
    done();
  });
});
