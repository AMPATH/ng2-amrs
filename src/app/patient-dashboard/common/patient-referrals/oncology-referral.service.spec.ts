import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BehaviorSubject } from 'rxjs';

import { Patient } from '../../../models/patient.model';

import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { OncologyReferralService } from './oncology-referral.service';
import { PatientReferralResourceService } from '../../../etl-api/patient-referral-resource.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { PatientReferralService } from '../../../program-manager/patient-referral-service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { ProgramEnrollmentResourceService } from '../../../openmrs-api/program-enrollment-resource.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { ProgramReferralResourceService } from '../../../etl-api/program-referral-resource.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { SessionStorageService } from '../../../utils/session-storage.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties';
import { UserService } from '../../../openmrs-api/user.service';

class FakeCacheStorageService {
  constructor(a, b) {}

  public ready() { return true; }
}

let getCurrentUserDefaultLocationObjectSpy;
let programManagerServiceSpy;
let referPatientSpy;
let userDefaultPropertiesServiceSpy;
const testPatient = new Patient({display: '123456 - Test Patient', uuid: 'test-patient-uuid'});

const testResults = {
  dateCompleted: null,
  dateEnrolled: '2019-04-09T00:00:00:00.000+0300',
  location: {
    display: 'Test Location 1',
    uuid: 'test-location-uuid-1'
  },
  outcome: null,
  patient: testPatient,
  program: {
    allWorkflows: [],
    name: 'BREAST CANCER SCREENING',
    uuid: '142939b0-28a9-4649-baf9-a9d012bf3b3d'
  },
  states: [],
  uuid: 'test-result-uuid',
  voided: false
};

describe('Service: OncologyReferralService', () => {
  let service: OncologyReferralService;

  beforeEach(() => {
    programManagerServiceSpy = jasmine.createSpyObj('ProgramManagerService', ['referPatient']);
    userDefaultPropertiesServiceSpy = jasmine.createSpyObj('UserDefaultPropertiesService', ['getCurrentUserDefaultLocationObject']);
    referPatientSpy = programManagerServiceSpy.referPatient.and.returnValue(new BehaviorSubject<any>(testResults));
    getCurrentUserDefaultLocationObjectSpy = userDefaultPropertiesServiceSpy.getCurrentUserDefaultLocationObject.and.returnValue(
      { display: 'Test Location', uuid: 'test-location-uuid' }
    );

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AppSettingsService,
        CacheService,
        DataCacheService,
        EncounterResourceService,
        LocalStorageService,
        OncologyReferralService,
        PatientProgramResourceService,
        PatientReferralResourceService,
        PersonResourceService,
        ProgramReferralResourceService,
        PatientReferralService,
        ProgramEnrollmentResourceService,
        ProgramResourceService,
        ProgramService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ProviderResourceService,
        SessionStorageService,
        UserService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new FakeCacheStorageService(null, null);
          }, deps: []
        },
        {
          provide: ProgramManagerService, useValue: programManagerServiceSpy
        },
        {
          provide: UserDefaultPropertiesService, useValue: userDefaultPropertiesServiceSpy
        },
      ]
    });

    service = TestBed.get(OncologyReferralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have all its methods defined', () => {
    expect(service.referPatient).toBeTruthy();
  });

  it('initiates an oncology referral and emits an observable response containing the referral payload', (done) => {
    const testReferralData = {
      programUuid: 'active-program-uuid',
      submittedEncounter: [
        {
          display: 'ONCOLOGYREFERRAL 08/04/2019',
          encounterDatetime: '2019-04-08T21:44:24.000+0300',
          encounterProviders: [{
            display: 'Test Provider',
            uuid: 'test-provider-uuid'
          }],
          encounterType: {
            display: 'ONCOLOGYREFERRAL',
            uuid: 'test-encounter-type-uuid'
          },
          form: {
            display: 'Oncology POC Screening Referral Form V1.0',
            uuid: 'test-form-uuid'
          },
          location: {
            display: 'Location Test',
            uuid: 'test-location-uuid-2'
          },
          obs: [
            {
              display: 'REFERRALS ORDERED, FREETEXT: Testing referral',
              uuid: 'b156764e-40ad-47ee- from test-location-uuid-1 to test-location-uuid-28e3a-bcdf3659879c'
            }
          ],
          orders: [],
          patient: {
            display: '0000011 - Test Oncology Referral',
            uuid: 'test-patient-uuid'
          },
          resourceVersion: '1.9',
          uuid: 'test-submitted-encounter-uuid',
          visit: null,
          voided: false
        }
      ]
    };

    service.referPatient(new Patient({ display: '1234567 - Test Patient' }), testReferralData)
      .subscribe(
        (result) => {
          // expect(getCurrentUserDefaultLocationObjectSpy).toHaveBeenCalledTimes(1);
          expect(referPatientSpy).toHaveBeenCalledTimes(1);
          expect(result).toEqual(testResults);
          done();
        },
        (error) => {
          console.error('Unexpected error: ', error);
        }
      );
  });
});
