import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import {
  UserDefaultPropertiesService
} from '../../../user-default-properties/user-default-properties.service';

@Injectable()
export class OncologyReferralService {

  constructor(
    private programManagerService: ProgramManagerService,
    public userDefaultPropertiesService: UserDefaultPropertiesService) { }

  public referPatient(patient, referralData: any) {
    const location = localStorage.getItem('referralLocation');
    const referredFromLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    const payload = {
      submittedEncounter: referralData.submittedEncounter,
      referredToLocation: location,
      referredFromLocation: referredFromLocation.uuid,
      patient: patient,
      dateEnrolled: moment().format('YYYY-MM-DD'),
      programUuid: referralData.programUuid
    };
    return this.programManagerService.referPatient(payload);
  }
}
