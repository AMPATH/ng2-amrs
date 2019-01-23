import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { PatientReferralService } from './patient-referral-service';
import { UserService } from '../openmrs-api/user.service';

import { BehaviorSubject, Observable, forkJoin } from 'rxjs';

import { Patient } from '../models/patient.model';
import { ProgramService } from '../patient-dashboard/programs/program.service';
import { take } from 'rxjs/operators';
import { PersonResourceService } from '../openmrs-api/person-resource.service';

@Injectable()
export class ProgramManagerService {
  public availablePrograms: any[] = [];
  public requiredProgramQuestions: any[] = [];
  public referralCompleteStatus: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private patientReferralService: PatientReferralService,
              private programService: ProgramService,
              private personResourceService: PersonResourceService,
              private userService: UserService) {

  }

  public enrollPatient(payload) {
    return this.patientReferralService.createUpdatePatientEnrollment(payload);
  }

  public referPatient(payload) {
    const encounter: any = _.first(payload.submittedEncounter);
    _.extend(payload, {
      notificationStatus: null,
      referralReason: '',
      state: null
    });
    if (encounter) {
      _.extend(payload, {encounter: encounter.uuid});
      this.handleReferralWithEncounter(payload);
    } else {
      this.handleReferralWithProvider(payload);
    }
    return this.referralCompleteStatus;
  }

  public editProgramEnrollments(theChange: string, patient: Patient, programs: any[], newLoc) {
    const programBatch: Array<Observable<any>> = [];
    _.each(programs, (program: any) => {
      const location = program.enrolledProgram._openmrsModel.location.uuid;
      const unenrollPayload = this.programService.createEnrollmentPayload(
        program.programUuid, patient, this.toOpenmrsDateFormat(program.dateEnrolled || program.enrolledProgram.dateEnrolled),
        this.toOpenmrsDateFormat(program.dateCompleted), location ,
        program.enrolledProgram._openmrsModel.uuid);
      // if intra-ampath, unenroll and enroll in the new location
      if (theChange === 'location') {
        const enrollPayload = this.programService.createEnrollmentPayload(
          program.programUuid, patient, this.toOpenmrsDateFormat(program.dateEnrolled),
          null,
          newLoc, '');
        programBatch.push(this.programService.saveUpdateProgramEnrollment(unenrollPayload));
        programBatch.push(this.programService.saveUpdateProgramEnrollment(enrollPayload));
      } else {
        // just unenroll
        programBatch.push(this.programService.saveUpdateProgramEnrollment(unenrollPayload));
      }
    });
    return forkJoin(programBatch);
  }

  public updatePersonHealthCenter(payload: any) {
    const personUuid = payload.person.uuid;
    delete payload.person;
    return this.personResourceService.saveUpdatePerson(personUuid, payload);
  }

  private handleReferralWithProvider(payload): void {
    const currentUser = this.userService.getLoggedInUser();
    this.patientReferralService.getUserProviderDetails(currentUser)
      .then((provider) => {
        if (provider) {
          _.extend(payload, {provider: provider.uuid});
          this.enrollPatientInReferredProgram(payload);
        }
      });
  }

  private handleReferralWithEncounter(payload: any): void {
    this.patientReferralService.getEncounterProvider(payload.encounter)
      .subscribe((provider) => {
        if (provider) {
          _.extend(payload, {provider: provider.uuid});
          this.enrollPatientInReferredProgram(payload);
        }
      });
  }

  private enrollPatientInReferredProgram(programInfo) {
    // 1. Enroll patient
    this.patientReferralService.createUpdatePatientEnrollment({
      programUuid: programInfo.programUuid,
      patient: programInfo.patient,
      location: programInfo.referredToLocation,
      dateEnrolled: programInfo.dateEnrolled,
      enrollmentUuid: ''
    }).subscribe((enrollment) => {
        // 2. Save encounter
        _.extend(programInfo, {
          patientProgram: enrollment.uuid,
          patient : programInfo.patient.uuid
        });
        delete programInfo.submittedEncounter;
        this.saveReferral(programInfo, enrollment);

      },
      (error) => {
        this.handleError(error);
      });
  }

  private saveReferral(programInfo, enrollment) {
    this.patientReferralService.saveReferralEncounter(programInfo)
      .subscribe((savedEncounter) => {
        // 3. complete referral if its referring back
        if (programInfo.patient_referral_id) {
          this.patientReferralService.updateReferalNotificationStatus({
            patient_referral_id: programInfo.patient_referral_id,
            notificationStatus: 1
          }).subscribe((response) => {
            this.handleSuccessfulReferral(response);
          }, (error) => {
            console.log('updateReferalNotificationStatus error ====> ', error);
            // complete the referral anyway
            this.handleError(error);
          });
        } else {
          this.handleSuccessfulReferral(enrollment);
        }
      }, (error) => {
        this.handleError(error);
      });
  }

  private handleSuccessfulReferral(response) {
    this.referralCompleteStatus.next(response);
  }

  private handleError(err) {
    this.referralCompleteStatus.error(err);
  }

  private toOpenmrsDateFormat(dateToConvert: any): string {
    const date = moment(dateToConvert);
    if (date.isValid()) {
      return date.subtract(3, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
    }
    return '';
  }
}
