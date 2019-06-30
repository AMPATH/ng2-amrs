import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import * as moment from 'moment';
import { Subject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Form } from 'ngx-openmrs-formentry';

import { Patient } from '../../../models/patient.model';
import { PatientReferralsModule } from '../patient-referrals/patient-referrals.module';

import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { DifferentiatedCareReferralService } from '../patient-referrals/differentiated-care-referral.service';
import { FormentryReferralsHandlerService } from './formentry-referrals-handler.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { PatientReferralResourceService } from '../../../etl-api/patient-referral-resource.service';
import { PatientReferralService } from '../../../program-manager/patient-referral.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { ProgramReferralResourceService } from '../../../etl-api/program-referral-resource.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties';
import { testReferralInfo, testProgramVisitConfig, testUnenrollmentPayload,
  testPatient2, testReferralPayload, programVisitConfigs } from './mock/formentry-referrals-handler.mock';

class FakeCacheStorageService {
  constructor(a, b) {}

  public ready() { return true; }
}

const programManagerServiceStub = {
  editProgramEnrollments: () => of(testUnenrollmentPayload),
  referPatient: () => of(testReferralPayload)
};

const patientProgramResourceServiceStub = {
  getPatientProgramVisitConfigs: () => of(programVisitConfigs).pipe(delay(50))
};

const testCurrentUserDefaultLocationObject = {
  display: 'Test Location',
  uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
};

const testReferralData = {
  programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753' // HTN-DM TERTIARY CARE
};

let localStorageService;
let userDefaultPropertiesService;

describe('Service: FormentryReferralsHandler', () => {
  let form: Form;
  let service: FormentryReferralsHandlerService;
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

  localStorageService = jasmine.createSpyObj('LocalStorageService',
  ['getItem', 'getObject', 'setObject', 'setItem']);
  userDefaultPropertiesService = jasmine.createSpyObj('UserDefaultPropertiesService',
    ['getCurrentUserDefaultLocationObject']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        PatientReferralsModule
      ],
      providers: [
        CacheService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new FakeCacheStorageService(null, null);
          }, deps: []
        },
        DataCacheService,
        FormentryReferralsHandlerService,
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
        ProgramService,
        {
          provide: ProgramManagerService,
          useValue: programManagerServiceStub
        },
        ProgramReferralResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        {
          provide: UserDefaultPropertiesService,
          useValue: userDefaultPropertiesService
        }
      ]
    });

    service = TestBed.get(FormentryReferralsHandlerService);
  });

  beforeEach(() => {
    form = new Form(null, null, null);

    // set up spies
    const getQuestionByIdSpy = spyOn(form, 'searchNodeByQuestionId')
      .and.callFake((questionId) => {
        if (questionId === 'rtc') {
          const found = {
            control: {
              value: '2017-12-12'
            }
          };
          return [found];
        }
        if (questionId === 'encDate') {
          const found = {
            control: {
              value: '2017-07-07'
            }
          };
          return [found];
        }

        if (questionId === 'provider') {
          const found = {
            control: {
              value: 'provider-uuid'
            }
          };
          return [found];
        }

        if (questionId === 'location') {
          const found = {
            control: {
              value: 'location-uuid'
            }
          };
          return [found];
        }

        if (questionId === 'referrals') {
          const found = {
            control: {
              value: ['ovc-uuid', service.differentiatedCareConceptUuid]
            }
          };
          return [found];
        }

      });

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should extract required values for making a referral', () => {
    expect(form).toBeTruthy();

    const values = service.extractRequiredValues(form);
    expect(values.hasDifferentiatedCareReferal).toEqual(true);
    expect(moment(values.rtcDate).isSame(moment('2017-12-12'))).toEqual(true);
    expect(moment(values.encounterDatetime).isSame(moment('2017-07-07'))).toEqual(true);
    expect(values.providerUuid).toEqual('provider-uuid');
    expect(values.locationUuid).toEqual('location-uuid');
  });

  it('should refer to differentiated care program when handleFormReferrals is invoked', (done) => {
    const diffService: DifferentiatedCareReferralService = TestBed.get(DifferentiatedCareReferralService);
    const patient: Patient = new Patient({ uuid: 'some-uuid', person: {} });
    const expectedResults = {
      success: true
    };

    const diffCareReferralSpy = spyOn(diffService, 'referToDifferentiatedCare')
      .and.callFake(() => {
        const sub = new Subject<any>();
        setTimeout(() => {
          sub.next(expectedResults);
        }, 50);
        return sub;
      });

    service.handleFormReferrals(patient, form)
      .subscribe((results) => {
        expect(results).toEqual(
          {
            success: true,
            differentiatedCare: expectedResults
          }
        );
        done();
      }, (error) => {
        console.error('Did not expect error with the given test case');
      });
    }
  );

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

  it('should unenroll the patient from any enrolled programs that are incompatible with the selected program',
    async(() => {
      const programUnenrollmentObs = service.unenrollFromIncompatiblePrograms(testPatient2,
        testProgramVisitConfig[testReferralData.programUuid]);
      programUnenrollmentObs.subscribe(res => {
        expect(res[0]).toEqual(testUnenrollmentPayload);
        expect((res[0].dateCompleted).getTime()).toEqual((testUnenrollmentPayload.dateCompleted).getTime());
      }, err => {
        fail('Expected unenrollment payload, not an error');
      });
  }));

  it('should refer a patient to the selected program in the selected location', async(() => {
    const patientReferralStatus = service.refer(testPatient2, testReferralData);

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
