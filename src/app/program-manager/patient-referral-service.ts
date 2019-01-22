
import {take} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { ProgramService } from '../patient-dashboard/programs/program.service';
import { Patient } from '../models/patient.model';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';
import { ProgramReferralResourceService } from '../etl-api/program-referral-resource.service';
import {
    ProviderResourceService
} from '../openmrs-api/provider-resource.service';
import { PatientProgramResourceService } from '../etl-api/patient-program-resource.service';
import { PatientReferralResourceService } from '../etl-api/patient-referral-resource.service';

@Injectable()
export class PatientReferralService {
  public formsComplete: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private programService: ProgramService,
              private patientProgramResourceService: PatientProgramResourceService,
              private programReferralResourceService: ProgramReferralResourceService,
              private encounterResourceService: EncounterResourceService,
              private providerResourceService: ProviderResourceService,
              private patientReferralResourceService: PatientReferralResourceService) {

  }

  public createUpdatePatientEnrollment(payload) {
    const enrollPayload = this.programService.createEnrollmentPayload(
      payload.programUuid,
      payload.patient,
      payload.dateEnrolled || this.toOpenmrsDateFormat(new Date()),
      payload.dateCompleted ? payload.dateCompleted : null,
      payload.location,
      payload.enrollmentUuid);
    return this.programService.saveUpdateProgramEnrollment(enrollPayload);
  }

  public saveReferralEncounter(encounter: any) {
    return this.programReferralResourceService.saveReferralEncounter(encounter);
  }

  public getReferredByLocation(locationUuid, enrollmentUud?): Observable<any> {
    return this.patientReferralResourceService
      .getReferralByLocationUuid(locationUuid, enrollmentUud);

  }

  public getEncounterProvider(encounterUuid: string): Observable<any> {
    const subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    this.encounterResourceService.getEncounterByUuid(encounterUuid).pipe(
      take(1)).subscribe((encounter) => {
        const encounterProvider: any = _.first(encounter.encounterProviders);
        if (encounterProvider) {
          subject.next(encounterProvider.provider);
        }

      });
    return subject;
  }

  public getUserProviderDetails(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (user && user.person) {
        this.providerResourceService
          .getProviderByPersonUuid(user.person.uuid).pipe(
          take(1)).subscribe(
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

  public fetchAllProgramManagementConfigs(patientUuid): Observable<any> {
    const subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    this.patientProgramResourceService.getPatientProgramVisitConfigs(patientUuid).pipe(
      take(1)).subscribe((programConfigs) => {
      subject.next(programConfigs);
    });
    return subject;
  }

  public getReferralPatientList(params: any) {
    const referralInfo: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    const referralObservable = this.patientReferralResourceService
      .getPatientReferralPatientList({
      endDate: params.endDate,
      locationUuids: params.locationUuids,
      startDate: params.startDate,
      startAge: params.startAge,
      programUuids: params.programUuids,
      startIndex: params.startIndex
    });

    if (referralObservable === null) {
      throw new Error('Null referral provider observable');
    } else {
      referralObservable.take(1).subscribe(
          (referrals) => {
              referralInfo.next(referrals);
           });
  }
    return referralInfo.asObservable();
  }

  public getProgramWorkflows(programUuid) {
    const subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    this.programService.getProgramWorkFlows(programUuid).take(1).subscribe((workflows: any[]) => {
      const programWorkflows = _.filter(workflows, (w) => !w.retired);
      subject.next(programWorkflows.length > 0);
    });
    return subject;
  }

  public getProgramEnrollmentReferralLocation(enrollmentUuid: any) {
    const referral: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    const referralObservable = this.patientReferralResourceService.getReferralByLocationUuid
    (enrollmentUuid);

    if (referralObservable === null) {
      throw new Error('Null referral location observable');
    } else {
      referralObservable.pipe(take(1)).subscribe(
          (referrals) => {
              referral.next(referrals);
           });
  }
    return referral.asObservable();
  }

  public updateReferalNotificationStatus(payload) {
    return this.patientReferralResourceService.updateReferralNotificationStatus(payload);
  }

  public getReferralEncounterDetails(encounterUuid) {
    return this.encounterResourceService.getEncounterByUuid(encounterUuid);
  }

  private toOpenmrsDateFormat(dateToConvert: any): string {
    const date = moment(dateToConvert);
    if (date.isValid()) {
      return date.subtract(3, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
    }
    return '';
  }

}
