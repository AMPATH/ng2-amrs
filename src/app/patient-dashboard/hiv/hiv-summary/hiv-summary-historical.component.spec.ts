import { TestBed, inject, async } from '@angular/core/testing';
import { HivSummaryService } from './hiv-summary.service';
import { HivSummaryHistoricalComponent } from './hiv-summary-historical.component';
import { PatientService } from '../../services/patient.service';
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
import {
  ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import {
  ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Component: HivSummaryHistorical Unit Tests', () => {

  let hivSummaryService: HivSummaryService,
    patientService: PatientService, component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        HivSummaryService,
        HivSummaryResourceService,
        PatientService,
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
        LocalStorageService
      ]

    });

    hivSummaryService = TestBed.get(HivSummaryService);
    patientService = TestBed.get(PatientService);

    component = new HivSummaryHistoricalComponent(hivSummaryService, patientService);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });

  it('should have required properties', (done) => {
    expect(component.hivSummaries.length).toBe(0);
    expect(component.patient).toBeUndefined();
    expect(component.patientUuid).toBeUndefined();
    expect(component.dataLoaded).toBe(false);
    expect(component.loadingHivSummary).toBe(false);
    expect(component.errors.length).toBe(0);
    done();

  });

  it('should have all the required functions defined and callable', (done) => {

    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();

    spyOn(component, 'loadHivSummary').and.callThrough();
    component.loadHivSummary();
    expect(component.loadHivSummary).toHaveBeenCalled();

    spyOn(component, 'getPatient').and.callThrough();
    component.getPatient();
    expect(component.getPatient).toHaveBeenCalled();

    done();

  });

  it('should return true of column exists and has a value', (done) => {

  const testHasColumn = {
    'med_pickup_rtc_date': '2019-08-26'
  };
  const testNoCol = {
  };

  const testHasNullColValue = {
    'med_pickup_rtc_date': null
  };

  expect(component.hasColumnData(testHasColumn, 'med_pickup_rtc_date')).toBe(true);
  expect(component.hasColumnData(testNoCol, 'med_pickup_rtc_date')).toBe(false);
  expect(component.hasColumnData(testHasNullColValue, 'med_pickup_rtc_date')).toBe(false);

  done();

  });

});
