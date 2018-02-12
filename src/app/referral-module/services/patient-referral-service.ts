import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { Patient } from '../../models/patient.model';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { ProgramReferralResourceService } from '../../etl-api/program-referral-resource.service';
import {
    ReferralProviderResourceService
} from '../../etl-api/referral-provider-resource.service';
import {
    ProviderResourceService
} from '../../openmrs-api/provider-resource.service';

@Injectable()
export class PatientReferralService {
  constructor(private programService: ProgramService,
              private programReferralResourceService: ProgramReferralResourceService,
              private encounterResourceService: EncounterResourceService,
              private providerResourceService: ProviderResourceService,
              private referralResourceService: ReferralProviderResourceService) {

  }

  public enrollPatient(programUuid, patient: Patient, location, state, enrollmentUuid) {
      let enrollPayload = this.programService.createEnrollmentPayload(
        programUuid, patient, this.toOpenmrsDateFormat(new Date()), null,
        location, enrollmentUuid);
      _.merge(enrollPayload, {'states': [{
        'state': state.uuid,
        'startDate': this.toOpenmrsDateFormat(new Date())
      }]});
      return this.programService.saveUpdateProgramEnrollment(enrollPayload);
  }

  public saveReferralEncounter(encounter: any) {
    return this.programReferralResourceService.saveReferralEncounter(encounter);
  }

  public generateReferralEncounterPayload(referralInfo: any): Observable<any> {
    let subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    this.encounterResourceService.getEncounterTypes('v')
      .subscribe((encounterTypes) => {
        let referralType = _.find(encounterTypes, (eType: any) => {
          return eType.display === 'REFERRAL';
        });
        let payload = _.merge(referralInfo, {
          encounterDatetime: this.toOpenmrsDateFormat(new Date()),
          // Format to required openmrs date
          encounterType: referralType.uuid
        });
        subject.next(payload);
      });
    return subject;
  }

public getReferalProviders(locationUuid, providerUuids, stateUuids, startIndex, limit) {
        let referralInfo: BehaviorSubject<any> = new BehaviorSubject<any>([]);
        let referralObservable = this.referralResourceService.getReferralProviders(locationUuid,
        providerUuids, stateUuids,
        startIndex, limit);

        if (referralObservable === null) {
            throw new Error('Null referral provider observable');
        } else {
            referralObservable.subscribe(
                (referrals) => {
                    console.log(referrals);
                    referralInfo.next(referrals.result);
                 });
        }
        return referralInfo.asObservable();
    }

  public getUserProviderDetails(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (user && user.person) {
        this.providerResourceService
          .getProviderByPersonUuid(user.person.uuid)
          .subscribe(
          (provider) => {
            resolve(provider);
          },
          (error) => {
            reject(error);
          }
          );
      } else {
        reject('User is required');
      }
    });
  }

  private toOpenmrsDateFormat(dateToConvert: any): string {
    let date = moment(dateToConvert);
    if (date.isValid()) {
      return date.subtract(3, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
    }
    return '';
  }

}
