import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import { of, Observable } from 'rxjs';
import { HivProgramSnapshotComponent } from './hiv-program-snapshot.component';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';

import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TodaysVitalsService } from '../../common/todays-vitals/todays-vitals.service';
import { VisitResourceService } from 'src/app/openmrs-api/visit-resource.service';
import { VitalsDatasource } from '../../common/todays-vitals/vitals.datasource';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { PatientService } from '../../services/patient.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { ProgramService } from '../../programs/program.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
import { FakeAppFeatureAnalytics } from 'src/app/shared/app-analytics/app-feature-analytcis.mock';
import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';

const summaryResult = {
  'encounter_datetime': '2017-04-25T07:54:20.000Z',
  'location_uuid': '123',
  'rtc_date': '2017-05-22T21:00:00.000Z',
  'arv_start_date': '2017-04-24T21:00:00.000Z',
  'cur_arv_meds': 'ZIDOVUDINE AND LAMIVUDINE, LOPINAVIR AND RITONAVIR',
  'vl_1': 927,
  'is_clinical_encounter': 1,
  'vl_1_date': '2016-12-01T21:00:00.000Z',
  'encounter_type_name': 'YOUTHRETURN',
};

class FakeHivSummaryResourceService {
  constructor() {
  }

  getHivSummary(patientUuid, startIndex, size) {
    return of([summaryResult]);
  }
}

class FakeAppSettingsService {
  constructor() {
  }

  getOpenmrsServer() {
    return 'openmrs-url';
  }
}

class FakeLocationResourceService {
  constructor() {
  }

  getLocationByUuid(locationUuid, fromCache) {
    return Observable.of(
      {
        uuid: '123'
      }
    );
  }
}

describe('Component: HivProgramSnapshotComponent', () => {
  let hivService: HivSummaryResourceService,
    appSettingsService: AppSettingsService, component, fixture;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ZeroVlPipe,
        {
          provide: HivSummaryResourceService,
          useClass: FakeHivSummaryResourceService
        },
        {
          provide: AppSettingsService,
          useClass: FakeAppSettingsService
        },
        {
          provide: LocationResourceService,
          useClass: FakeLocationResourceService
        },
        TodaysVitalsService,
        VisitResourceService,
        VitalsDatasource,
        TodaysVitalsService,
        EncounterResourceService,
        ProgramWorkFlowResourceService,
        PatientService,
        PatientProgramService,
        ProgramResourceService,
        ProgramService,
        RoutesProviderService,
        PatientResourceService,
        FakeAppFeatureAnalytics,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,

      ],
      declarations: [HivProgramSnapshotComponent, ZeroVlPipe]
    }).compileComponents().then(() => {
      hivService = TestBed.get(HivSummaryResourceService);
      appSettingsService = TestBed.get(AppSettingsService);
      fixture = TestBed.createComponent(HivProgramSnapshotComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should have required properties', (done) => {
    expect(component.hasError).toEqual(false);
    expect(component.hasData).toEqual(false);
    expect(component.patientData).toEqual({});
    expect(component.location).toEqual({});
    done();
  });

  it('should set patient data and location when `getHivSummary` is called',
    inject([HivSummaryResourceService],
      (hs: HivSummaryResourceService) => {
        component.getHivSummary('uuid');
        expect(component.patientData).toEqual(summaryResult);
        // expect(component.location).toEqual({ uuid: '123' });
      })
  );

});
