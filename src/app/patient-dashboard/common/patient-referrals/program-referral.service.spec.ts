import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import * as moment from 'moment';
import { of } from 'rxjs';

import { programVisitConfigs } from './program-referral.mock';
import { Patient } from '../../../models/patient.model';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { ProgramReferralService } from './program-referral.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { PatientReferralResourceService } from '../../../etl-api/patient-referral-resource.service';
import { PatientReferralService } from '../../../program-manager/patient-referral-service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { ProgramEnrollmentResourceService } from '../../../openmrs-api/program-enrollment-resource.service';
import { ProgramReferralResourceService } from '../../../etl-api/program-referral-resource.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { SessionStorageService } from '../../../utils/session-storage.service';
import { UserService } from '../../../openmrs-api/user.service';

class FakeCacheStorageService {
  constructor(a, b) {}

  public ready() { return true; }
}

class FakePatientProgramResourceService {}

const testReferralInfo = {
  referralLocation: '876a154d-310d-4caf-8b58-be9dbcc7e753',
  referralVisitEncounter: [
    {
      display: 'COEDMINITIAL 25/06/2019',
      encounterDatetime: '2019-06-25T14:52:27.000+0300',
      encounterProviders: [
        {
          display: 'Test Provider: Unknown',
          uuid: '188690c5-1f3a-42ad-95b3-f6c38b159fc9'
        }
      ],
      encounterType: {
        display: 'COEDMINITIAL',
        uuid: '14c3b999-2d5c-4c2e-b173-5212b9170652'
      },
      form: {
        display: 'HTN-DM POC Tertiary Care Level Initial Visit Form V1.1',
        uuid: '3fab21cb-6276-44ed-886e-0def0deacae2'
      },
      location: {
        display: 'Location Test',
        uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
      },
      obs: [],
      patient: {
        display: '922378077-7 - Test CDM Referral 3',
        uuid: '2b5884f9-a513-4886-8ca3-f0b1395a383a'
      },
      resourceVersion: '1.9',
      uuid: '7c421612-63b4-41ab-a194-06c2bc4952d3',
      visit: {
        display: 'DM-HTN Tertiary visit @ Location Test - 25/06/2019 14:50',
        uuid: 'd5251f9a-ba5f-41a0-900d-44a145a07426'
      },
      voided: false
    }
  ]
};

const testPatient = new Patient({
  baseRoute: 'cdm',
  concept: {
    display: 'HTN-DM PRIMARY CARE',
    uuid: '94251af2-c218-4ed2-a578-fd683d5f44e6'
  },
  enrolledPrograms: {
    dateCompleted: null,
    dateEnrolled: 'Jun 25, 2019',
    display: 'Htn-dm Primary Care',
    isEdit: false,
    isEnrolled: true,
    program: {
      concept: {
        display: 'HTN-DM PRIMARY CARE',
        uuid: '94251af2-c218-4ed2-a578-fd683d5f44e6'
      },
      display: 'HTN-DM PRIMARY CARE',
      openmrsModel: {
        allWorkflows: [
          {
            concept: {
              display: 'CDM MOH DIABETES AND HYPERTENSION CARE WORKFLOW',
              uuid: '2e44d319-9194-4e1a-a292-e28e77ec4821'
            },
            uuid: 'd7af3392-6bfc-4bdd-8a5b-0fab0707f46c'
          }
        ],
        concept: {
          display: 'HTN-DM PRIMARY CARE',
          uuid: '94251af2-c218-4ed2-a578-fd683d5f44e6'
        },
        display: 'HTN-DM PRIMARY CARE',
        uuid: '876a154d-310d-4caf-8b58-be9dbcc7e753'
      }
    },
    programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753',
    referral_completed: false,
    validationError: ''
  },
  uuid: '2b5884f9-a513-4886-8ca3-f0b1395a383a' }
);

const testReferralData = {
  programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753' // HTN-DM TERTIARY CARE
};

const testCurrentUserDefaultLocationObject = {
  display: 'Test Location',
  uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
};

const testProgramVisitConfigs = {
  '876a154d-310d-4caf-8b58-be9dbcc7e753': {
    'name': 'HTN-DM PRIMARY CARE',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [
      'b731ba72-cf99-4176-9fcd-37cd186400c7',
      'bd9a8b06-73c7-44a8-928c-5e72247f4c1d'
    ],
    'HidevisibleLocations': [
      {
        'uuid': '0900880a-1352-11df-a1f1-0026b9348838',
        'display': 'Chepsaita'
      },
      {
        'uuid': '96d2964e-8cec-4eca-ad05-a9c1fb29a045',
        'display': 'Cheramei'
      },
      {
        'uuid': '2003e950-5b62-4330-a94c-cf8165f75084',
        'display': 'Murgusi'
      },
      {
        'uuid': '441451e5-aabd-4e71-87dd-8b7c5f651434',
        'display': 'Cheplaskei'
      },
      {
        'uuid': 'f030c7f2-9790-41d0-a704-f5a164909d17',
        'display': 'Sugoi A'
      },
      {
        'uuid': 'a27cec49-110c-41a1-9a6f-964d6ac2359d',
        'display': 'Sugoi B'
      },
      {
        'uuid': 'd09c6925-1e9a-4973-921d-d0014d7825ec',
        'display': 'Chepkemel'
      },
      {
        'uuid': 'e8c7759a-c99a-46de-82f8-d7c9f67eb237',
        'display': 'Sambut'
      },
      {
        'uuid': '00ce435c-3f27-4e89-a7f8-80fd102ff410',
        'display': 'Ngenyilel'
      },
      {
        'uuid': 'e05cbb83-9418-4ebc-9240-ae2512d70321',
        'display': 'Kapyemit'
      },
      {
        'uuid': 'e2546b92-17df-4640-a38b-c4f30b0cfd81',
        'display': 'Murgor Hills'
      },
      {
        'uuid': '3e04788f-6761-412a-8db6-08a713f59afc',
        'display': 'Osorongai'
      },
      {
        'uuid': 'd83e9d9e-8211-414d-8269-7b9308184b82',
        'display': 'West Clinic Health Centre'
      }
    ],
    'stateChangeForms': [
      {
        'type': 'inCare',
        'uuid': '72443cac-4822-4dce-8460-794af7af8167',
        'forms': [

        ]
      },
      {
        'type': 'referred',
        'uuid': '0c5565c5-45cf-40ab-aa6d-5694aeabae18',
        'forms': [
          {
            'uuid': '6a50f1d5-9f33-41ae-b2e7-7fd8267c181e',
            'required': true
          }
        ]
      },
      {
        'type': 'referredBack',
        'uuid': '15977097-13b7-4186-80a7-a78535f27866',
        'forms': [
          {
            'uuid': '6a50f1d5-9f33-41ae-b2e7-7fd8267c181e',
            'required': true
          }
        ]
      }
    ],
    'visitTypes': [
      {
        'uuid': '8072afd0-0cd9-409e-914d-1833e83943f7',
        'name': 'DM-HTN Primary Care Visit',
        'transitionStateOnVisitStart': {
          'state': 'inCare',
          'uuid': '72443cac-4822-4dce-8460-794af7af8167'
        },
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '1871ce37-7def-4335-972f-9861195ba683',
            'display': 'CDMDispensary'
          }
        ]
      }
    ]
  },
};

let localStorageService;
let userDefaultPropertiesService;
let patientProgramResourceService;

describe('Service: ProgramReferralService', () => {
  let service: ProgramReferralService;
  localStorageService = jasmine.createSpyObj('LocalStorageService', ['getItem', 'getObject', 'setObject', 'setItem']);
  patientProgramResourceService = jasmine.createSpyObj('PatientProgramResourceService', ['getPatientProgramVisitConfigs']);
  userDefaultPropertiesService = jasmine.createSpyObj('UserDefaultPropertiesService', ['getCurrentUserDefaultLocationObject']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        AppSettingsService,
        CacheService,
        DataCacheService,
        EncounterResourceService,
        {
          provide: LocalStorageService,
          useValue: localStorageService
        },
        {
          provide: PatientProgramResourceService,
          useValue: patientProgramResourceService
        },
        PatientReferralService,
        PatientReferralResourceService,
        PersonResourceService,
        ProgramEnrollmentResourceService,
        ProgramManagerService,
        ProgramReferralService,
        ProgramReferralResourceService,
        ProgramResourceService,
        ProgramService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ProviderResourceService,
        SessionStorageService,
        UserService,
        {
          provide: UserDefaultPropertiesService,
          useValue: userDefaultPropertiesService
        },
        {
          provide: CacheStorageService, useFactory: () => {
            return new FakeCacheStorageService(null, null);
          }, deps: []
        },
      ]
    });

    service = TestBed.get(ProgramReferralService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an enrollment payload and return it', () => {
    localStorageService.getItem.and.returnValues(testReferralInfo.referralLocation,
      JSON.stringify(testReferralInfo.referralVisitEncounter));
    userDefaultPropertiesService.getCurrentUserDefaultLocationObject.and.returnValue(
      testCurrentUserDefaultLocationObject);

    const enrollmentPayload = service.createEnrollmentPayload(testPatient, testReferralData);
    expect(enrollmentPayload.patient).toEqual(testPatient);
    expect(enrollmentPayload.programUuid).toEqual(testReferralData.programUuid);
    expect(enrollmentPayload.dateEnrolled).toEqual(moment().format('YYYY-MM-DD'));
    expect(enrollmentPayload.referredToLocation).toEqual(testReferralInfo.referralLocation);
    expect(enrollmentPayload.referredFromLocation).toEqual(testCurrentUserDefaultLocationObject.uuid);
    expect(enrollmentPayload.submittedEncounter).toEqual(testReferralInfo.referralVisitEncounter);
  });

  xit('should return the observable result of fetching program visit configs', (done: DoneFn) => {
    patientProgramResourceService.getPatientProgramVisitConfigs.and.returnValue(of(testProgramVisitConfigs));
    service.getProgramVisitConfigs(testPatient, testReferralData.programUuid)
      .subscribe(programConfig => {
        console.log('programConfig: ', programConfig);
        expect(programConfig).toEqual(programVisitConfigs[testReferralData.programUuid]);
        done();
      }, err => {
        fail('Expected program visit config object, not an error');
      }
    );
  });
});
