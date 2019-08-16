import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, Subject, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

import { Form } from 'ngx-openmrs-formentry';
import { Patient } from '../../../models/patient.model';

import { DifferentiatedCareReferralService } from '../patient-referrals/differentiated-care-referral.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';

@Injectable()
export class FormentryReferralsHandlerService {
  public differentiatedCareConceptUuid = '7c6f0599-3e3e-4f42-87a2-2ce66f1e96d0';

  constructor(
    public diffCareReferralService: DifferentiatedCareReferralService,
    public localStorageService: LocalStorageService,
    public patientProgramResourceService: PatientProgramResourceService,
    public programManagerService: ProgramManagerService,
    public userDefaultPropertiesService: UserDefaultPropertiesService) { }

  public handleFormReferrals(patient: Patient, form: Form): Observable<any> {
    const values = this.extractRequiredValues(form);
    const subject = new Subject<any>();

    if (values.hasDifferentiatedCareReferal) {
      this.handleDifferentiatedCareReferal(patient, values).pipe(
        take(1)).subscribe((results) => {
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

  public handleProgramReferral(patient: Patient, referralData: any) {
    return this.refer(patient, referralData);
  }

  public refer(patient: Patient, referralData: any): Observable<any> {
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

  public handleDifferentiatedCareReferal(patient: Patient, values: {
    'hasDifferentiatedCareReferal': boolean,
    'rtcDate': Date,
    'encounterDatetime': Date,
    'providerUuid': string,
    'locationUuid': string
  }): Observable<any> {
    return this.diffCareReferralService.referToDifferentiatedCare(patient, values.providerUuid,
      values.encounterDatetime, values.rtcDate, values.locationUuid);
  }

  public extractRequiredValues(form: Form): {
    'hasDifferentiatedCareReferal': boolean,
    'rtcDate': Date,
    'encounterDatetime': Date,
    'providerUuid': string,
    'locationUuid': string
  } {

    const returnValue = {
      'hasDifferentiatedCareReferal': false,
      'rtcDate': null,
      'encounterDatetime': null,
      'providerUuid': '',
      'locationUuid': ''
    };

    // has differentiaded care referal;
    const referrals = this.getQuestionValue(form, 'referrals');
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

  private getQuestionValue(form: Form, questionId: string) {
    const nodes = form.searchNodeByQuestionId(questionId);
    if (nodes.length > 0) {
      return nodes[0].control.value;
    }
  }
}
