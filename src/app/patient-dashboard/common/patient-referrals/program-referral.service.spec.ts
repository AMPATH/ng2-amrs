import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
import { PatientReferralService } from '../../../program-manager/patient-referral.service';
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
import { programVisitConfigs } from './program-referral.mock';

class FakeCacheStorageService {
  constructor(a, b) {}

  public ready() { return true; }
}

const patientProgramResourceServiceStub = {
  getPatientProgramVisitConfigs: () => of(programVisitConfigs).pipe(delay(50))
};

const testUnenrollmentPayload = {
  dateCompleted: new Date()
};

const testReferralPayload = {
  dateEnrolled: '2019-06-25',
  encounter: '3a82d53a-55af-4aef-a99b-126b4625632f',
  notificationStatus: null,
  patient: '2b5884f9-a513-4886-8ca3-f0b1395a383a',
  patientProgram: 'f8a0092c-8d10-4298-800a-80e7336670ac',
  programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753',
  provider: 'a9cecb3c-b8e2-4ce7-8307-2b622c17d5dd',
  referralReason: '',
  referredFromLocation: 'a9cecb3c-b8e2-4ce7-8307-2b622c17d5dd',
  referredToLocation: '18c343eb-b353-462a-9139-b16606e6b6c2',
  state: null
};

const programManagerServiceStub = {
  editProgramEnrollments: () => of(testUnenrollmentPayload),
  referPatient: () => of(testReferralPayload)
};

const testReferralInfo = {
  referralLocation: '18c343eb-b353-462a-9139-b16606e6b6c2',
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
  allIdentifiers: '880730066-3',
  commonIdentifiers: {
    ampathMrsUId: '880730066-3',
    amrsMrn: '',
    cCC: '',
    kenyaNationalId: ''
  },
  display: '880730066-3 - Test CDM Referral',
  openmrsModel: {
    display: '880730066-3 - Test CDM Referral',
    person: {
      age: 59,
      birthdate: '1960-06-11T00:00:00.000+0300',
      birthdateEstimated: false,
      causeOfDeath: null,
      dead: false,
      deathDate: null,
      display: 'Test CDM Referral',
      gender: 'M',
      uuid: '96b45a63-b04c-4eb0-b122-2bcf384ccff3'
    }
  },
  enrolledPrograms: [
    {
      baseRoute: 'cdm',
      concept: {
        display: 'HTN-DM PRIMARY CARE',
        uuid: '94251af2-c218-4ed2-a578-fd683d5f44e6'
      },
      dateCompleted: null,
      dateEnrolled: '2019-06-25',
      dateEnrolledView: '25-06-2019',
      encounter_uuid: 'c417c963-f878-43ba-b561-59bba0a6bd8d',
      enrolledProgram: {
        dateCompleted: null,
        dateEnrolled: 'Jun 25, 2019',
        display: 'Htn-dm Primary Care',
        openmrsModel: {
          dateCompleted: null,
          dateEnrolled: '2019-06-25T00:00:00.000+0300',
          display: 'HTN-DM Primary Care',
          program: {
            uuid: '876a154d-310d-4caf-8b58-be9dbcc7e753'
          },
          states: [],
          uuid: 'd0534eab-072b-4b19-98ac-5405d35a03f0',
          voided: false
        },
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
        states: [],
        uuid: 'd0534eab-072b-4b19-98ac-5405d35a03f0',
        voided: false
      },
      isEdit: false,
      isEnrolled: true,
      isFocused: false,
      programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753',
      validationError: ''
    },
    {
      baseRoute: 'cdm',
      concept: {
        display: 'HTN-DM TERTIARY CARE',
        uuid: '1c1d2ed4-382c-4088-a936-25910d86a30e'
      },
      dateCompleted: null,
      dateEnrolled: '2019-06-24',
      dateEnrolledView: '24-06-2019',
      encounter_uuid: 'c417c963-f878-43ba-b561-59bba0a78bhg',
      enrolledProgram: {
        dateCompleted: null,
        dateEnrolled: 'Jun 24, 2019',
        display: 'Htn-dm Tertiary Care',
        openmrsModel: {
          dateCompleted: null,
          dateEnrolled: '2019-06-24T00:00:00.000+0300',
          display: 'HTN-DM TERTIARY CARE',
          program: {
            uuid: 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d'
          },
          states: [],
          uuid: '79c8f1b8-30f9-4619-9944-ab06bba61547',
          voided: false
        },
        program: {
          concept: {
            display: 'HTN-DM TERTIARY CARE',
            uuid: '1c1d2ed4-382c-4088-a936-25910d86a30e'
          },
          display: 'HTN-DM TERTIARY CARE'
        },
        programUuid: 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d',
        states: [],
        uuid: '79c8f1b8-30f9-4619-9944-ab06bba61547',
        voided: false
      },
      isEdit: false,
      isEnrolled: true,
      isFocused: false,
      programUuid: 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d',
      validationError: ''
    },
  ],
  uuid: '2b5884f9-a513-4886-8ca3-f0b1395a383a'
});

const testReferralData = {
  programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753' // HTN-DM TERTIARY CARE
};

const testCurrentUserDefaultLocationObject = {
  display: 'Test Location',
  uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
};

const testProgramVisitConfig = {
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
        'forms': []
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

describe('Service: ProgramReferralService', () => {
  let service: ProgramReferralService;
  localStorageService = jasmine.createSpyObj('LocalStorageService',
    ['getItem', 'getObject', 'setObject', 'setItem']);
  userDefaultPropertiesService = jasmine.createSpyObj('UserDefaultPropertiesService',
    ['getCurrentUserDefaultLocationObject']);

  beforeEach(async(() => {
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
          useValue: patientProgramResourceServiceStub
        },
        PatientReferralService,
        PatientReferralResourceService,
        PersonResourceService,
        ProgramEnrollmentResourceService,
        {
          provide: ProgramManagerService,
          useValue: programManagerServiceStub
        },
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
  }));

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

  it('should fetch program visit configs and return the config that corresponds to the selected program',
    async(() => {
    const programConfigs = service.getPatientProgramVisitConfigs(testPatient,
      testReferralData.programUuid);
    expect(programConfigs).toBeDefined();
    expect(programConfigs).toEqual(jasmine.any(Observable));
    programConfigs.subscribe(programConfig => {
      expect(programConfig).toEqual(testProgramVisitConfig[testReferralData.programUuid]);
      expect(programConfig.name).toEqual('HTN-DM PRIMARY CARE');
      expect(programConfig.dataDependencies).toEqual(
        testProgramVisitConfig[testReferralData.programUuid].dataDependencies);
      expect(programConfig.incompatibleWith).toContain('b731ba72-cf99-4176-9fcd-37cd186400c7');
      expect(programConfig.incompatibleWith).toContain('bd9a8b06-73c7-44a8-928c-5e72247f4c1d');
      expect(programConfig.HidevisibleLocations.length).toEqual(13, 'Hide 13 Locations');
      expect(programConfig.stateChangeForms).toEqual(
        testProgramVisitConfig[testReferralData.programUuid].stateChangeForms);
      expect(programConfig.visitTypes[0].name).toEqual('DM-HTN Primary Care Visit');
      expect(programConfig.visitTypes[0].encounterTypes.length).toEqual(2, 'Two visit types');
    }, err => {
      fail('Expected program configs, not an error');
    });
  }));

  it('should unenroll the patient from enrolled programs that are incompatible with the selected program',
    async(() => {
      const programUnenrollmentObs = service.unenrollFromIncompatiblePrograms(testPatient,
        testProgramVisitConfig[testReferralData.programUuid]);
      programUnenrollmentObs.subscribe(res => {
        expect(res[0]).toEqual(testUnenrollmentPayload);
        expect((res[0].dateCompleted).getTime()).toEqual((testUnenrollmentPayload.dateCompleted).getTime());
      }, err => {
        fail('Expected unenrollment payload, not an error');
      });
  }));

  it('should refer a patient to the selected program in the selected location', async(() => {
    const patientReferralStatus = service.referPatient(testPatient, testReferralData);

    localStorageService.getItem.and.returnValues(testReferralInfo.referralLocation,
      JSON.stringify(testReferralInfo.referralVisitEncounter));
    userDefaultPropertiesService.getCurrentUserDefaultLocationObject.and.returnValue(
      testCurrentUserDefaultLocationObject);

    patientReferralStatus.subscribe(res => {
      expect(res.notificationStatus).toEqual(null);
      expect(res.patientProgram).toBeDefined();
      expect(res.referralReason).toBeDefined();
      expect(res.referredFromLocation).toBeDefined();
      expect(res.referredToLocation).toEqual(testReferralInfo.referralLocation);
      expect(res.programUuid).toEqual(testReferralData.programUuid);
    }, err => {
      fail('Expected referral payload, not an error');
    });
  }));
});
