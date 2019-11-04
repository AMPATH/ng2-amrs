import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppSettingsService } from '../../app-settings/app-settings.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { DepartmentProgramsConfigService } from '../../etl-api/department-programs-config.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { PatientReferralResourceService } from '../../etl-api/patient-referral-resource.service';
import { PatientReferralService } from '../../program-manager/patient-referral.service';
import { PersonResourceService } from '../../openmrs-api/person-resource.service';
import { ProgramEnrollmentResourceService } from '../../openmrs-api/program-enrollment-resource.service';
import { ProgramReferralResourceService } from '../../etl-api/program-referral-resource.service';
import { ProgramReferralStatusComponent } from './program-referral-status.component';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { ProgramWorkFlowResourceService } from '../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../openmrs-api/program-workflow-state-resource.service';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';

class MockCacheStorageService {
  constructor(a, b) { }

  public ready() {
    return true;
  }
}

let component;
let fixture: ComponentFixture<ProgramReferralStatusComponent>;

describe('ProgramReferralStatusComponent: ', () => {
  beforeEach(async(() =>  {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [
        ProgramReferralStatusComponent
      ],
      providers: [
        AppSettingsService,
        CacheService,
        DataCacheService,
        DepartmentProgramsConfigService,
        EncounterResourceService,
        LocalStorageService,
        LocationResourceService,
        PatientProgramResourceService,
        PatientReferralService,
        PatientReferralResourceService,
        PersonResourceService,
        ProgramEnrollmentResourceService,
        ProgramReferralResourceService,
        ProgramResourceService,
        ProgramWorkFlowStateResourceService,
        ProgramWorkFlowResourceService,
        ProgramService,
        ProviderResourceService,
        {
          provide: CacheStorageService,
          useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramReferralStatusComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
