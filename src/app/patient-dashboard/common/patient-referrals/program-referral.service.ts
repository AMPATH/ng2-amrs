import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { forkJoin, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { Patient } from '../../../models/patient.model';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';

@Injectable()
export class ProgramReferralService {
  constructor(
    private localStorageService: LocalStorageService,
    private patientProgramResourceService: PatientProgramResourceService,
    private programManagerService: ProgramManagerService,
    private userDefaultPropertiesService: UserDefaultPropertiesService) {
  }

  public referPatient(patient: Patient, referralData: any): Observable<any> {
    const patientReferralStatus = new Subject<any>();
    this.getPatientProgramVisitConfigs(patient, referralData.programUuid).pipe(take(1))
      .subscribe(programConfig => {
        this.unenrollFromIncompatiblePrograms(patient, programConfig)
          .subscribe(res => {
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
        console.error('Error unenrolling from incompatible programs: ', err);
        patientReferralStatus.error(err);
      }
    );
    return patientReferralStatus;
  }

  public getPatientProgramVisitConfigs(patient: Patient, programUuid: string): Observable<any> {
    const programConfigLoaded: Subject<any> = new Subject<any>();
    this.patientProgramResourceService.getPatientProgramVisitConfigs(patient.uuid).pipe(take(1))
      .subscribe(programConfigs => {
        if (programConfigs) {
          programConfigLoaded.next(programConfigs[programUuid]);
        }
      }, error => {
        console.error('Error fetching program visit configs: ', error);
        programConfigLoaded.error(error);
      }
    );
    return programConfigLoaded.asObservable();
  }

  public unenrollFromIncompatiblePrograms(patient: Patient, programConfig: any): Observable<any> {
    const batchProgramUnenrollments: Array<Observable<any>> = [];
    const enrolledIncompatiblePrograms: any[] = [];
    const enrolledPrograms = _.filter(patient.enrolledPrograms, 'isEnrolled');
    _.each(enrolledPrograms, (enrolledProgram: any) => {
      if (_.includes(programConfig.incompatibleWith, enrolledProgram.programUuid)) {
        enrolledIncompatiblePrograms.push(enrolledProgram);
      }
    });
    batchProgramUnenrollments.push(
      this.programManagerService.editProgramEnrollments('stop', patient, enrolledIncompatiblePrograms)
    );
    return forkJoin(batchProgramUnenrollments);
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
}
