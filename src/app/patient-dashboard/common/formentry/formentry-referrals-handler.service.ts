import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, Subject, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

import { Form } from '@ampath-kenya/ngx-openmrs-formentry';
import { Patient } from '../../../models/patient.model';

import { DifferentiatedCareReferralService } from '../patient-referrals/differentiated-care-referral.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { ProgramManagerService } from '../../../program-manager/program-manager.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';

// interfaces
import { ReturnValue } from './../../../interfaces/return-value.interface';
import { Program } from './../../../interfaces/program.interface';
import { ReferredProgram } from './../../../interfaces/referred-program.interface';

// program constants
import { Programs } from './../../../constants/program.constants';

// referral concepts
import { ReferralConcepts } from './../../../constants/referral-concepts.contants';

// form uuids
import { FormUuids } from './../../../constants/forms.constants';

@Injectable()
export class FormentryReferralsHandlerService {
  private PMTCT_PROGRAM: Program = Programs.PMTCT_PROGRAM;
  private STANDARD_PROGRAM: Program = Programs.STANDARD_HIV_PROGRAM;

  constructor(
    public diffCareReferralService: DifferentiatedCareReferralService,
    public localStorageService: LocalStorageService,
    public patientProgramResourceService: PatientProgramResourceService,
    public programManagerService: ProgramManagerService,
    public userDefaultPropertiesService: UserDefaultPropertiesService
  ) {}

  public handleFormReferrals(patient: Patient, form: Form): Observable<any> {
    const values = this.extractRequiredValues(form);
    const subject = new Subject<any>();

    if (values.hasDifferentiatedCareReferal) {
      this.handleDifferentiatedCareReferal(patient, values)
        .pipe(take(1))
        .subscribe(
          (results) => {
            subject.next({
              success: true,
              differentiatedCare: results
            });
          },
          (error) => {
            subject.next({
              success: false,
              differentiatedCare: error
            });
          }
        );
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
    this.getPatientProgramVisitConfigs(patient, referralData.programUuid)
      .pipe(take(1))
      .subscribe(
        (programConfig) => {
          this.unenrollFromIncompatiblePrograms(
            patient,
            programConfig
          ).subscribe(
            (res) => {
              const enrollmentPayload = this.createEnrollmentPayload(
                patient,
                referralData
              );
              this.programManagerService
                .referPatient(enrollmentPayload)
                .subscribe(
                  (resp) => {
                    patientReferralStatus.next(resp);
                  },
                  (err) => {
                    patientReferralStatus.error(err);
                  }
                );
            },
            (err) => {
              console.error('Error enrolling to the program: ', err);
              patientReferralStatus.error(err);
            }
          );
        },
        (err) => {
          console.error('Error unenrolling from incompatible programs: ', err);
          patientReferralStatus.error(err);
        }
      );
    return patientReferralStatus;
  }

  public getPatientProgramVisitConfigs(
    patient: Patient,
    programUuid: string
  ): Observable<any> {
    const programConfigLoaded: Subject<any> = new Subject<any>();
    this.patientProgramResourceService
      .getPatientProgramVisitConfigs(patient.uuid)
      .pipe(take(1))
      .subscribe(
        (programConfigs) => {
          if (programConfigs) {
            programConfigLoaded.next(programConfigs[programUuid]);
          }
        },
        (error) => {
          console.error('Error fetching program visit configs: ', error);
          programConfigLoaded.error(error);
        }
      );
    return programConfigLoaded.asObservable();
  }

  public unenrollFromIncompatiblePrograms(
    patient: Patient,
    programConfig: any
  ): Observable<any> {
    const batchProgramUnenrollments: Array<Observable<any>> = [];
    const enrolledIncompatiblePrograms: any[] = [];
    const enrolledPrograms = _.filter(patient.enrolledPrograms, 'isEnrolled');
    _.each(enrolledPrograms, (enrolledProgram: any) => {
      if (
        _.includes(programConfig.incompatibleWith, enrolledProgram.programUuid)
      ) {
        enrolledIncompatiblePrograms.push(enrolledProgram);
      }
    });
    batchProgramUnenrollments.push(
      this.programManagerService.editProgramEnrollments(
        'stop',
        patient,
        enrolledIncompatiblePrograms
      )
    );
    return forkJoin(batchProgramUnenrollments);
  }

  public createEnrollmentPayload(patient, referralData): any {
    const referralLocation = this.localStorageService.getItem(
      'referralLocation'
    );
    const referralVisitEncounter = this.localStorageService.getItem(
      'referralVisitEncounter'
    );
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

  public handleDifferentiatedCareReferal(
    patient: Patient,
    values: {
      hasDifferentiatedCareReferal: boolean;
      rtcDate: Date;
      encounterDatetime: Date;
      providerUuid: string;
      locationUuid: string;
    }
  ): Observable<any> {
    return this.diffCareReferralService.referToDifferentiatedCare(
      patient,
      values.providerUuid,
      values.encounterDatetime,
      values.rtcDate,
      values.locationUuid
    );
  }

  public extractRequiredValues(form: Form): ReturnValue {
    const returnValue: ReturnValue = {
      hasDifferentiatedCareReferal: false,
      isInterMovementForm: false,
      hasInterFacilityReferral: false,
      hasTransitionReferral: false,
      hasTbTreatmentReferral: false,
      hasPmtctReferral: false,
      hasActgReferral: false,
      hasInpatientCareReferral: false,
      hasBackToCareReferral: false,
      hasPppReferral: false,
      hasPatientPreferenceReferral: false,
      hasStandardHivCareReferral: false,
      rtcDate: null,
      encounterDatetime: null,
      providerUuid: '',
      locationUuid: '',
      hivReferralLocationUuid: ''
    };

    const formUuid = form.schema.uuid ? form.schema.uuid : '';

    // has differentiaded care referal;
    const referrals_1 = this.getQuestionValue(form, 'referrals');
    const internalMvmentData = this.getQuestionValue(form, 'careType');
    const interMovementQstnAns = this.getQuestionValue(form, 'internalMove');
    // validating if selected option is DC care and referrals is blank. Adult and youth forms are different
    const referrals =
      referrals_1 === undefined
        ? this.getQuestionValue(form, 'patientReferrals')
        : referrals_1;
    if (
      Array.isArray(referrals) &&
      referrals.indexOf(ReferralConcepts.differentiatedCareConceptUuid) >= 0
    ) {
      returnValue.hasDifferentiatedCareReferal = true;
    }

    // has selected yes for internal movement
    if (interMovementQstnAns === 'a899b35c-1350-11df-a1f1-0026b9348838') {
      returnValue.hasInterFacilityReferral = true;
    }

    // has transition referral

    if (internalMvmentData === ReferralConcepts.TRANSITION_CONCEPT) {
      returnValue.hasTransitionReferral = true;
    }

    // has TB referral
    if (internalMvmentData === ReferralConcepts.TB_REFERRAL_CONCEPT) {
      returnValue.hasTbTreatmentReferral = true;
    }

    // haS PMTCT referral
    if (internalMvmentData === ReferralConcepts.MCH_PROGRAM_CONCEPT) {
      returnValue.hasPmtctReferral = true;
    }

    // has ACTG referral
    if (internalMvmentData === ReferralConcepts.ACTG_REFERRAL_CONCEPT) {
      returnValue.hasActgReferral = true;
    }

    // has Patient care referral
    if (
      internalMvmentData === ReferralConcepts.IN_PATIENT_CARE_REFERRAL_CONCEPT
    ) {
      returnValue.hasInpatientCareReferral = true;
    }

    // has Back to CCC referral
    if (internalMvmentData === ReferralConcepts.BACK_TO_CCC_REFERRAL_CONCEPT) {
      returnValue.hasBackToCareReferral = true;
    }

    // has PPP referral
    if (internalMvmentData === ReferralConcepts.PPP_REFERRAL_CONCEPT) {
      returnValue.hasPppReferral = true;
    }

    // has Personal Preference referral
    if (internalMvmentData === ReferralConcepts.PATIENT_PREFERENCE_CONCEPT) {
      returnValue.hasPatientPreferenceReferral = true;
    }

    // has Standard HIV Care Referral
    if (
      internalMvmentData === ReferralConcepts.STANDARD_HIV_CARE_REFERRAL_CONCEPT
    ) {
      returnValue.hasStandardHivCareReferral = true;
    }

    if (internalMvmentData && internalMvmentData.length > 0) {
      returnValue.hivReferralLocationUuid = this.getQuestionValue(
        form,
        'referedFacility'
      );
      returnValue.isInterMovementForm = this.isInterMovementForm(formUuid);
    }

    // rtcdate
    returnValue.rtcDate = this.getQuestionValue(form, 'rtc');
    returnValue.encounterDatetime = this.getQuestionValue(form, 'encDate');
    returnValue.providerUuid = this.getQuestionValue(form, 'provider');
    returnValue.locationUuid = this.getQuestionValue(form, 'location');

    return returnValue;
  }

  public getReferralProgram(referralObj: any): ReferredProgram {
    const refProgram: ReferredProgram = {
      uuid: '',
      name: '',
      locationUuid: '',
      providerUuid: '',
      referralMetaData: referralObj
    };
    if (referralObj.hasPmtctReferral) {
      refProgram.uuid = this.PMTCT_PROGRAM.uuid;
      refProgram.name = this.PMTCT_PROGRAM.name;
    } else {
      refProgram.uuid = this.STANDARD_PROGRAM.uuid;
      refProgram.name = this.STANDARD_PROGRAM.name;
    }

    refProgram.locationUuid = referralObj.hivReferralLocationUuid;
    refProgram.providerUuid = referralObj.providerUuid;

    return refProgram;
  }

  public isInterMovementForm(formUuid: string): boolean {
    return formUuid === FormUuids.INTERNAL_MOVEMENT_FORM_UUID;
  }

  private getQuestionValue(form: Form, questionId: string) {
    const nodes = form.searchNodeByQuestionId(questionId);
    if (nodes.length > 0) {
      return nodes[0].control.value;
    }
  }
}
