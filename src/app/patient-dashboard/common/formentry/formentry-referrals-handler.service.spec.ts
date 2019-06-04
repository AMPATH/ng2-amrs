/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import * as moment from 'moment';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { Form } from 'ngx-openmrs-formentry';

import { Patient } from '../../../models/patient.model';
import { PatientReferralsModule } from '../patient-referrals/patient-referrals.module';

import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { DifferentiatedCareReferralService } from '../patient-referrals/differentiated-care-referral.service';
import { FormentryReferralsHandlerService } from './formentry-referrals-handler.service';
import { OncologyReferralService } from '../patient-referrals/oncology-referral.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { PatientReferralService } from '../../../program-manager/patient-referral-service';
import { ProgramService } from '../../programs/program.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { ProgramReferralResourceService } from '../../../etl-api/program-referral-resource.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';
import { PatientReferralResourceService } from '../../../etl-api/patient-referral-resource.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties';

class FakeCacheStorageService {
  constructor(a, b) {}

  public ready() { return true; }
}

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

  const userDefaultPropertiesServiceSpy = jasmine.createSpyObj('UserDefaultPropertiesService', ['getCurrentUserDefaultLocationObject']);
  const getCurrentUserDefaultLocationObjectSpy = userDefaultPropertiesServiceSpy.getCurrentUserDefaultLocationObject.and.returnValue(
    { display: 'Test Location', uuid: 'test-location-uuid' }
  );
  const oncServiceSpy = jasmine.createSpyObj('OncologyReferralService', ['referPatient']);
  const referPatientSpy = oncServiceSpy.referPatient.and.returnValue(new BehaviorSubject<any>(testResults));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CacheService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new FakeCacheStorageService(null, null);
          }, deps: []
        },
        DataCacheService,
        FormentryReferralsHandlerService,
        OncologyReferralService,
        PatientProgramResourceService,
        PatientReferralService,
        PatientReferralResourceService,
        ProgramService,
        ProgramManagerService,
        ProgramReferralResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        {
          provide: OncologyReferralService, useValue: oncServiceSpy
        },
        {
          provide: UserDefaultPropertiesService, useValue: userDefaultPropertiesServiceSpy
        },
      ],
      imports: [
        HttpClientTestingModule,
        PatientReferralsModule
      ]
    });
  });

  beforeEach(() => {
    form = new Form(null, null, null);
    service = TestBed.get(FormentryReferralsHandlerService);

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

  it('should inject the service', () => {
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

  it('should refer to differentiated care program when referal is selected',
    (done) => {
      const diffService: DifferentiatedCareReferralService =
        TestBed.get(DifferentiatedCareReferralService);
      const patient: Patient = new Patient({ uuid: 'some-uuid', person: {} });
      const expectedResults = {
        success: true
      };

      const diffCareReferalSpy = spyOn(diffService, 'referToDifferentiatedCare')
        .and.callFake(() => {
          const sub = new Subject<any>();
          setTimeout(() => {
            sub.next(expectedResults);
          }, 50);
          return sub;
        });

      service.handleFormReferals(patient, form)
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

  it('should effect an oncology referral when handleOncologyReferral is invoked', () => {
    console.log('Inside formentry-referrals.handler.service.spec');
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

    service.handleOncologyReferral(testPatient, testReferralData)
      .subscribe(
        (results) => {
          expect(referPatientSpy).toHaveBeenCalledTimes(1);
          expect(results).toEqual(testResults);
        },
        (error) => {
          console.log('Unexpected error occured: ', error);
        }
      );
  });
});
