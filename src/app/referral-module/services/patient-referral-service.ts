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
    ProviderResourceService
} from '../../openmrs-api/provider-resource.service';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { ProgramsTransferCareService
} from '../../patient-dashboard/programs/transfer-care/transfer-care.service';
import { PatientReferralResourceService } from '../../etl-api/patient-referral-resource.service';

@Injectable()
export class PatientReferralService {
  public formsComplete: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private programService: ProgramService,
              private patientProgramResourceService: PatientProgramResourceService,
              private programReferralResourceService: ProgramReferralResourceService,
              private encounterResourceService: EncounterResourceService,
              private providerResourceService: ProviderResourceService,
              private programsTransferCareService: ProgramsTransferCareService,
              private patientReferralResourceService: PatientReferralResourceService) {

  }

  public enrollPatient(programUuid, patient: Patient, location, state, enrollmentUuid) {
      let enrollPayload = this.programService.createEnrollmentPayload(
        programUuid, patient, this.toOpenmrsDateFormat(new Date()), null,
        location, enrollmentUuid);
      return this.programService.saveUpdateProgramEnrollment(enrollPayload);
  }

  public saveReferralEncounter(encounter: any) {
    return this.programReferralResourceService.saveReferralEncounter(encounter);
  }

  public saveProcessPayload(payload: any) {
    this.programsTransferCareService.savePayload(payload);
  }

  public getProcessPayload() {
    return this.programsTransferCareService.getPayload();
  }

  public getReferredByLocation(enrollmentUuid): Observable<any> {
    return this.patientReferralResourceService
      .getReferralLocationByEnrollmentUuid(enrollmentUuid);

  }

  public setTransferStatus(status: boolean) {
    this.programsTransferCareService.setTransferStatus(status);
  }

  public getEncounterProvider(encounterUuid: string): Observable<any> {
    let subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    this.encounterResourceService.getEncounterByUuid(encounterUuid)
      .subscribe((encounter) => {
        let encounterProvider: any = _.first(encounter.encounterProviders);
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

  public fetchAllProgramManagementConfigs(patientUuid): Observable<any> {
    let subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    this.patientProgramResourceService.getPatientProgramVisitConfigs(patientUuid)
      .subscribe((programConfigs) => {
      subject.next(programConfigs);
    });
    return subject;
  }

  public getPatientEncounters(patient) {
    return this.programsTransferCareService.getPatientEncounters(patient);
  }

  public pickEncountersByLastFilledDate(encounters: any[], date: any) {
    return this.programsTransferCareService.pickEncountersByLastFilledDate(encounters, date);
  }

  public getProviderReferralPatientList(params: any) {
    let referralInfo: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    let referralObservable = this.patientReferralResourceService
      .getPatientReferralPatientList({
      endDate: params.endDate,
      locationUuids: params.locationUuids,
      startDate: params.startDate,
      startAge: params.startAge,
      endAge: params.endAge,
      gender: params.gender,
      programUuids: params.programUuids,
      stateUuids: params.stateUuids,
      providerUuids: params.providerUuids,
      startIndex: params.startIndex,
    });

    if (referralObservable === null) {
      throw new Error('Null referral provider observable');
    } else {
      referralObservable.subscribe(
          (referrals) => {
              referralInfo.next(referrals);
           });
  }
    return referralInfo.asObservable();
  }

  public getProgramWorkflows(programUuid) {
    let subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    this.programService.getProgramWorkFlows(programUuid).subscribe((workflows: any[]) => {
      let programWorkflows = _.filter(workflows, (w) => !w.retired);
      subject.next(programWorkflows.length > 0);
    });
    return subject;
  }

  public getProgramEnrollmentReferralLocation(enrollmentUuid: any) {
    let referral: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    let referralObservable = this.patientReferralResourceService.getReferralLocationByEnrollmentUuid
    (enrollmentUuid);

    if (referralObservable === null) {
      throw new Error('Null referral location observable');
    } else {
      referralObservable.subscribe(
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
    let date = moment(dateToConvert);
    if (date.isValid()) {
      return date.subtract(3, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
    }
    return '';
  }

}
