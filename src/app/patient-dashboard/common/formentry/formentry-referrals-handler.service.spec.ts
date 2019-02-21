/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';

import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';
import { Form } from 'ngx-openmrs-formentry/dist/ngx-formentry';

import { FormentryReferralsHandlerService } from './formentry-referrals-handler.service';
import { PatientReferralsModule } from '../patient-referrals/patient-referrals.module';
import { DifferentiatedCareReferralService } from '../patient-referrals/differentiated-care-referral.service';
import { Patient } from '../../../models/patient.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: FormentryReferralsHandler', () => {
  let form: Form;
  let service: FormentryReferralsHandlerService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormentryReferralsHandlerService],
      imports: [
        PatientReferralsModule,
        HttpClientTestingModule
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
    });

});
