import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { LocalStorageService } from '../../../utils/local-storage.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { SelectDepartmentService } from '../../../shared/services/select-department.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';

@Injectable()
export class ProgramReferralService {
  constructor(
    private selectDepartmentService: SelectDepartmentService,
    private localStorageService: LocalStorageService,
    private programManagerService: ProgramManagerService,
    private userDefaultPropertiesService: UserDefaultPropertiesService
  ) {}

  /*
    Step 1 is to distinguish between CDM referrals and HEMATO-ONCOLOGY referrals:

    CDM referrals need to:
      - get the patient_program_config
      - filter config and get the program object
      - look for incompatible programs and unenroll from those programs
      - construct an enrollment payload and pass it on to referPatient

    HEMATO-ONCOLOGY referrals need to:
      - construct an enrollment payload and pass it on to programManagerService#referPatient
  */

  public referPatient(patient, referralData: any) {
    const department = this.selectDepartmentService.getUserSetDepartment();

    if (department === 'CDM') {
      // Construct referralPayload
    } else if (department === 'HEMATO-ONCOLOGY') {
      // Construct referralPayload
      const referralLocation =
        this.localStorageService.getItem('referralLocation');
      const referralVisitEncounter = this.localStorageService.getItem(
        'referralVisitEncounter'
      );
      const referredFromLocation =
        this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
      const payload = {
        submittedEncounter: JSON.parse(referralVisitEncounter),
        referredToLocation: referralLocation,
        referredFromLocation: referredFromLocation.uuid,
        patient: patient,
        dateEnrolled: moment().format('YYYY-MM-DD'),
        programUuid: referralData.programUuid
      };
      return this.programManagerService.referPatient(payload);
    }
  }
}
