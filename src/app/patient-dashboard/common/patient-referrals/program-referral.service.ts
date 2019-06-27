import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';

import { LocalStorageService } from '../../../utils/local-storage.service';
import { Patient } from '../../../models/patient.model';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';

@Injectable()
export class ProgramReferralService {
  public allPatientProgramVisitConfigs: any = {};

  constructor(
    private localStorageService: LocalStorageService,
    private patientProgramResourceService: PatientProgramResourceService,
    private programManagerService: ProgramManagerService,
    private userDefaultPropertiesService: UserDefaultPropertiesService) {
  }

  public referPatient(patient: Patient, referralData: any): Observable<any> {
    const patientReferralStatus = new Subject<any>();
    this.getProgramVisitConfigs(patient, referralData.programUuid).pipe(take(1))
      .subscribe(programConfig => {
        // construct unenrollment payload for incompatible programs
        const programs: any[] = [];
        const enrolledPrograms = _.filter(patient.enrolledPrograms, 'isEnrolled');
        _.each(enrolledPrograms, (enrolled: any) => {
          if (_.includes(programConfig.incompatibleWith, enrolled.programUuid)) {
            _.merge(enrolled, {
              dateCompleted: new Date()
            });
            programs.push(enrolled);
          }
        });
        // unenroll from incompatible programs and then construct enrollment payload
        this.programManagerService.editProgramEnrollments('stop', patient, programs)
          .subscribe(res => {
            // enroll to the referred program
            const enrollmentPayload = this.createEnrollmentPayload(patient, referralData);
            this.programManagerService.referPatient(enrollmentPayload).subscribe(resp => {
              patientReferralStatus.next(resp);
            }, err => {
              patientReferralStatus.error(err);
            });
          }, err => {
            console.error('Error enrolling to the program: ', err);
            patientReferralStatus.error(err);
          }
        );
      }, err => {
        console.error('Error unenrolling from program: ', err);
        patientReferralStatus.error(err);
      }
    );
    return patientReferralStatus;
  }

  public createEnrollmentPayload(patient, referralData): any {
    const referralLocation = this.localStorageService.getItem('referralLocation');
    const referralVisitEncounter = this.localStorageService.getItem('referralVisitEncounter');
    const referredFromLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    const enrollmentPayload = {
      submittedEncounter: JSON.parse(referralVisitEncounter),
      referredToLocation: referralLocation,
      referredFromLocation: referredFromLocation.uuid,
      patient: patient,
      dateEnrolled: moment().format('YYYY-MM-DD'),
      programUuid: referralData.programUuid
    };
    return enrollmentPayload;
  }

  public getProgramVisitConfigs(patient: Patient, programUuid: string): Observable<any> {
    const programConfigLoaded: Subject<boolean> = new Subject<boolean>();
    this.patientProgramResourceService.getPatientProgramVisitConfigs(patient.uuid).pipe(shareReplay(), take(1))
      .subscribe(programConfigs => {
        if (programConfigs) {
          programConfigLoaded.next(programConfigs[programUuid]);
        }
      }, error => {
        programConfigLoaded.error(error);
      }
    );
    return programConfigLoaded.asObservable();
  }
}
