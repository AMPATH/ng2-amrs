import { Injectable } from '@angular/core';

import { Observable ,  Subject } from 'rxjs';
import { Form } from 'ngx-openmrs-formentry/dist/ngx-formentry';

import { DifferentiatedCareReferralService } from
  '../patient-referrals/differentiated-care-referral.service';
import { Patient } from '../../../models/patient.model';

@Injectable()
export class FormentryReferralsHandlerService {
  public differentiatedCareConceptUuid = '7c6f0599-3e3e-4f42-87a2-2ce66f1e96d0';

  constructor(public diffCareReferralService: DifferentiatedCareReferralService) { }

  public handleFormReferals(patient: Patient, form: Form): Observable<any> {
    let values = this.extractRequiredValues(form);
    let subject = new Subject<any>();

    if (values.hasDifferentiatedCareReferal) {
      this.handleDifferentiatedCareReferal(patient, values)
        .subscribe((results) => {
          subject.next(
            {
              success: true,
              differentiatedCare: results
            }
          );
        }, (error) => {
          subject.next(
            {
              success: false,
              differentiatedCare: error
            }
          );
        });
    } else {
      subject.next({
        success: true,
        differentiatedCare: null
      });
    }
    return subject.asObservable();
  }

  public handleDifferentiatedCareReferal(patient: Patient, values: {
    'hasDifferentiatedCareReferal': boolean,
    'rtcDate': Date,
    'encounterDatetime': Date,
    'providerUuid': string,
    'locationUuid': string
  }): Observable<any> {
    return this.diffCareReferralService
      .referToDifferentiatedCare(patient, values.providerUuid,
      values.encounterDatetime, values.rtcDate, values.locationUuid);
  }
  public extractRequiredValues(form: Form): {
    'hasDifferentiatedCareReferal': boolean,
    'rtcDate': Date,
    'encounterDatetime': Date,
    'providerUuid': string,
    'locationUuid': string
  } {

    let returnValue = {
      'hasDifferentiatedCareReferal': false,
      'rtcDate': null,
      'encounterDatetime': null,
      'providerUuid': '',
      'locationUuid': ''
    };

    // has differentiaded care referal;
    let referrals = this.getQuestionValue(form, 'referrals');
    if (Array.isArray(referrals) &&
      referrals.indexOf(this.differentiatedCareConceptUuid) >= 0) {
      returnValue.hasDifferentiatedCareReferal = true;
    }

    // rtcdate
    returnValue.rtcDate = this.getQuestionValue(form, 'rtc');
    returnValue.encounterDatetime = this.getQuestionValue(form, 'encDate');
    returnValue.providerUuid = this.getQuestionValue(form, 'provider');
    returnValue.locationUuid = this.getQuestionValue(form, 'location');

    return returnValue;
  }

  private getQuestionValue(form: Form, quesitonId: string) {
    let nodes = form.searchNodeByQuestionId(quesitonId);
    if (nodes.length > 0) {
      return nodes[0].control.value;
    }
  }

}
