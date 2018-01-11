import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import { Form } from 'ng2-openmrs-formentry';

import { PatientReferralService } from
'./../patient-referrals/referral-status/referral-service';
import { Patient } from '../../../models/patient.model';

@Injectable()
export class FormentryReferralsHandlerService {
  public differentiatedCareConceptUuid = '7c6f0599-3e3e-4f42-87a2-2ce66f1e96d0';
  public mdtConceptUuid = 'a9431295-9862-405b-b694-534f093ca0ad';

  constructor(
    public patientReferralService: PatientReferralService) { }

  public handleFormReferals(patient: Patient, form: Form): Observable<any> {
    let values = this.extractRequiredValues(form);
    let subject = new Subject<any>();

    if (values.hasDifferentiatedCareReferal || values.hasMDTRefferal) {
      this.handleReferal(patient, values)
        .subscribe((results) => {
          subject.next(
            {
              success: true,
              result: results
            }
          );
        }, (error) => {
          subject.next(
            {
              success: false,
              result: error
            }
          );
        });

    }else {
      subject.next({
        success: true,
        result: null
      });
    }
    return subject.asObservable();
  }

  public handleReferal(patient: Patient, values: {
    'hasDifferentiatedCareReferal': boolean,
    'hasMDTRefferal': boolean,
    'rtcDate': Date,
    'encounterDatetime': Date,
    'providerUuid': string,
    'locationUuid': string
  }): Observable<any> {

     let programUuid: string ;
    // if patient has been refreed to Diff care or MDT

     if (values.hasDifferentiatedCareReferal || values.hasMDTRefferal) {

      if (values.hasDifferentiatedCareReferal) {
        programUuid = '334c9e98-173f-4454-a8ce-f80b20b7fdf0';
      } else {
        // if its MDT
        programUuid = 'c4246ff0-b081-460c-bcc5-b0678012659e';
      }
      return this.patientReferralService.referToProgram(patient, values.providerUuid,
        values.encounterDatetime, values.rtcDate, values.locationUuid, programUuid);

    }
  }
  public extractRequiredValues(form: Form): {
    'hasDifferentiatedCareReferal': boolean,
    'hasMDTRefferal': boolean,
    'rtcDate': Date,
    'encounterDatetime': Date,
    'providerUuid': string,
    'locationUuid': string
  } {

    let returnValue = {
      'hasDifferentiatedCareReferal': false,
      'hasMDTRefferal': false,
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

    // has mdt referral
    if (Array.isArray(referrals) &&
      referrals.indexOf(this.mdtConceptUuid) >= 0) {
      returnValue.hasMDTRefferal = true;
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
