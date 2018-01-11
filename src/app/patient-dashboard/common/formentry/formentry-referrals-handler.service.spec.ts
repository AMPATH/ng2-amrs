/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Observable, Subject } from 'rxjs/Rx';
import * as moment from 'moment';
import { Form } from 'ng2-openmrs-formentry';

import { FormentryReferralsHandlerService } from './formentry-referrals-handler.service';
import { PatientReferralsModule } from '../patient-referrals/patient-referrals.module';
import { PatientReferralService } from
'./../patient-referrals/referral-status/referral-service';
import { Patient } from '../../../models/patient.model';

describe('Service: FormentryReferralsHandler', () => {
  let form: Form;
  let service: FormentryReferralsHandlerService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormentryReferralsHandlerService],
      imports: [
        PatientReferralsModule,
        HttpModule
      ]
    });
  });

  beforeEach(() => {
    form = new Form(null, null, null);
    service = TestBed.get(FormentryReferralsHandlerService);

    // set up spies
    let getQuestionByIdSpy = spyOn(form, 'searchNodeByQuestionId')
      .and.callFake((questionId) => {
        if (questionId === 'rtc') {
          let found = {
            control: {
              value: '2017-12-12'
            }
          };
          return [found];
        }
        if (questionId === 'encDate') {
          let found = {
            control: {
              value: '2017-07-07'
            }
          };
          return [found];
        }

        if (questionId === 'provider') {
          let found = {
            control: {
              value: 'provider-uuid'
            }
          };
          return [found];
        }

        if (questionId === 'location') {
          let found = {
            control: {
              value: 'location-uuid'
            }
          };
          return [found];
        }

        if (questionId === 'referrals') {
          let found = {
            control: {
              value: ['ovc-uuid', service.differentiatedCareConceptUuid]
            }
          };
          return [found];
        }

      });

  });

  it('should inject the service', () => {
    expect(service).toBeTruthy();
  });

  it('should extract required values for making a referral', () => {
    expect(form).toBeTruthy();

    let values = service.extractRequiredValues(form);
    expect(values.hasDifferentiatedCareReferal).toEqual(true);
    expect(moment(values.rtcDate).isSame(moment('2017-12-12'))).toEqual(true);
    expect(moment(values.encounterDatetime).isSame(moment('2017-07-07'))).toEqual(true);
    expect(values.providerUuid).toEqual('provider-uuid');
    expect(values.locationUuid).toEqual('location-uuid');
  });

  it('should refer to differentiated care program when referal is selected',
    (done) => {
      let refService: PatientReferralService =
        TestBed.get(PatientReferralService);
      let patient: Patient = new Patient({ uuid: 'some-uuid', person: {} });
      let expectedResults = {
        success: true
      };

      let diffCareReferalSpy = spyOn(refService, 'referToProgram')
        .and.callFake(() => {
          let sub = new Subject<any>();
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
              result: expectedResults
            }
          );
          done();
        }, (error) => {
          console.error('Did not expect error with the given test case');
        });
    });

});
