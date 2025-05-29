import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { FormentryComponent } from './formentry.component';
import { Patient } from '../../../models/patient.model';
import { SelectDepartmentService } from 'src/app/shared/services/select-department.service';

// form uuids
import { FormUuids } from './../../../constants/forms.constants';
// program constants
import { Programs } from './../../../constants/program.constants';

@Injectable()
export class PatientTransferService {
  public componentRef: FormentryComponent;
  private patient: Patient;
  private transferState: BehaviorSubject<any> = new BehaviorSubject(null);
  private INTERNAL_MOVEMENT_FORM_UUID = FormUuids.INTERNAL_MOVEMENT_FORM_UUID;
  private YES_CONCEPT = 'a899b35c-1350-11df-a1f1-0026b9348838';
  private YES_ELIGIBLE_FOR_DELIVERY_CONCEPT =
    'a899b35c-1350-11df-a1f1-0026b9348838';
  private COMMUNITY_PHARMACY_CONCEPT = '33363568-fb62-4063-b0ac-e37be1d23514';

  constructor(private selectSetDepartmentService: SelectDepartmentService) {}

  public handleProgramManagerRedirects(
    data: any,
    patient: Patient
  ): BehaviorSubject<any> {
    this.patient = patient;
    this.setTransferLocation();
    // getting program manager data to edit from local storage
    // check if patient status was filled
    const patientCareStatus = this.getPatientStatusQuestion();
    const referralQuestion = this.getReferralsQuestion();
    const patientCategorizatonStatus = this.getPatientCategorizationQstn();
    const patientCommunityModelStatus = this.getPatientCommunityModelQstn();
    const internalMovementQuestion = this.getInternalMovementQstn();
    const force =
      patientCareStatus.length > 0 &&
      !_.isEmpty(_.first(patientCareStatus).control.value);
    const queryParams = {};
    if (this.shouldRedirectToProgramManager(patientCareStatus, force)) {
      this.componentRef.preserveFormAsDraft = false;

      /*
       * Do not save transfer out options when
        submitting transfer out form
       */
      if (this.componentRef.formUuid !== FormUuids.TRANSFER_OUT_FORM_UUID) {
        this.saveTransferOptionsIfSpecified();
      }

      if (this.componentRef.formUuid === FormUuids.TRANSFER_OUT_FORM_UUID) {
        // patient care status in transfer out form is non-ampath
        if (
          _.first(patientCareStatus).control.value ===
            'a8aaf3e2-1350-11df-a1f1-0026b9348838' ||
          _.first(patientCareStatus).control.value ===
            '67cd2f9f-228e-417d-94c4-d77e1a6c3453'
        ) {
          // all active programs should be stopped
          _.merge(queryParams, {
            stop: this.selectSetDepartmentService.getUserSetDepartment(),
            notice: 'other'
          });
        }

        // patient care status in transfer out form is ampath
        if (
          _.first(patientCareStatus).control.value ===
          'a89c2e5c-1350-11df-a1f1-0026b9348838'
        ) {
          _.merge(queryParams, {
            change: this.selectSetDepartmentService.getUserSetDepartment(),
            notice: 'location'
          });
        }
      }
      // MCH/PMTCT concept
      // Transfer to MNCH for PMTCT care concept
      if (
        _.includes(
          [
            '1f09e809-8ea3-45e6-a71f-16e6a0d72390',
            'a8a17d80-1350-11df-a1f1-0026b9348838'
          ],
          _.first(patientCareStatus).control.value
        )
      ) {
        // PMTCT programUuid
        _.merge(queryParams, {
          program: '781d897a-1359-11df-a1f1-0026b9348838',
          notice: 'pmtct'
        });
      }
      if (this.loadTransferOutForm()) {
        this.transferState.next({
          transfer: true,
          loadTransferOutForm: true
        });
      } else {
        this.transferState.next({ transfer: true, params: queryParams });
      }
    }
    if (referralQuestion.length > 0) {
      // Enhanced adherence HIV Program
      if (
        _.includes(
          _.first(referralQuestion).control.value,
          'a9431295-9862-405b-b694-534f093ca0ad'
        )
      ) {
        // Enhanced adherence HIV Program
        _.merge(queryParams, {
          program: Programs.VIREMIA_PROGRAM.uuid,
          notice: 'adherence'
        });
        const location: any = this.componentRef.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
        localStorage.setItem('transferLocation', location.uuid);
      }
      // HIV Differentiated Program
      if (
        _.includes(
          _.first(referralQuestion).control.value,
          '7c6f0599-3e3e-4f42-87a2-2ce66f1e96d0'
        )
      ) {
        // HIV Differentiated Program
        _.merge(queryParams, {
          program: Programs.DIFFERENTIATED_SERVICE_DELIVERY_PROGRAM.uuid,
          notice: 'dc'
        });
        const location: any = this.componentRef.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
        localStorage.setItem('transferLocation', location.uuid);
      }
    }
    if (internalMovementQuestion.length > 0) {
      // Internal Movement

      if (this.containsInternalMovementAnwer(internalMovementQuestion)) {
        // Standard HIV Program
        _.merge(queryParams, {
          program: Programs.STANDARD_HIV_PROGRAM.uuid,
          notice: 'sh'
        });
        this.transferState.next({
          transfer: true,
          loadInternalMovementForm: this.shouldLoadInternalMovementForm(
            this.componentRef.formUuid
          )
        });
      }
    } else {
      this.transferState.next({ loadInternalMovementForm: false });
    }

    if (patientCategorizatonStatus) {
      if (this.loadProjectBeyondForm()) {
        this.transferState.next({
          transfer: true,
          loadProjectBeyondForm: true
        });
      }
    }

    if (patientCommunityModelStatus) {
      // set uuid to local storage
      // check for uuid in localstorage and run below code if its true
      localStorage.setItem(
        'community_model_uuid',
        this.COMMUNITY_PHARMACY_CONCEPT
      );
    }

    if (
      !patientCommunityModelStatus &&
      localStorage.getItem('community_model_uuid')
    ) {
      if (this.loadCommunityPharmacyForm()) {
        this.transferState.next({
          transfer: true,
          loadCommunityPharmacyForm: true
        });
      }
    }
    return this.transferState;
  }

  public prefillTransferOptions(): void {
    const careStatus = this.searchNodeByQuestionId('careStatus');
    if (careStatus.length > 0) {
      /**
       * I was not successful to set the value without simulating a click.
       *  Again, I could not simulate without having some little delay.
       * There could be a better way. Note also that this is DOM manipulation
       *  inside a service which shouldn't be happening
       */
      // TODO find an Angular way of doing this without having to use VanillaJS
      // some delay just to ensure the question has been rendered then simulate
      // a click before setting value.
      setTimeout(() => {
        const element: HTMLElement = document.getElementById(
          'careStatusid'
        ) as HTMLElement;
        element.click();
        careStatus[0].control.setValue(localStorage.getItem('careStatus'));
      }, 30);
      /**
       * Using setTimeout not the best idea. But because of form renderer delay
       *  in adding options to select controls, I had to
       * add some delay
       */
      // give some time for the hidden options to be shown
      setTimeout(() => {
        let transferLocation = this.searchNodeByQuestionId(
          'transfered_out_to_ampath'
        );
        // care status is non-ampath
        if (
          _.first(careStatus).control.value ===
          'a8aaf3e2-1350-11df-a1f1-0026b9348838'
        ) {
          transferLocation = this.searchNodeByQuestionId(
            'transfered_out_to_non_ampath'
          );
        }
        if (transferLocation.length > 0) {
          transferLocation[0].control.setValue(
            localStorage.getItem('transferLocation')
          );
        }
      }, 50);
    }
    const rtc = this.searchNodeByQuestionId('rtc');
    if (rtc.length > 0) {
      rtc[0].control.setValue(
        moment(localStorage.getItem('transferRTC')).format()
      );
    }
  }

  private getPatientCategorizationQstn(): boolean {
    const eligibleDeliveryQuestion = this.searchNodeByQuestionId(
      'EligibleDelivery' // 'establishCategory' // communityModel 33363568-fb62-4063-b0ac-e37be1d23514
    );
    // return this.containsEligibleForDeliveryAnwer(eligibleDeliveryQuestion);
    return this.hasExpectedAnswer(
      eligibleDeliveryQuestion,
      this.YES_ELIGIBLE_FOR_DELIVERY_CONCEPT
    );
  }

  private getPatientCommunityModelQstn(): boolean {
    const eligibleDeliveryQuestion = this.searchNodeByQuestionId(
      'communityModel'
    );
    // return this.containsEligibleForDeliveryAnwer(eligibleDeliveryQuestion);
    return this.hasExpectedAnswer(
      eligibleDeliveryQuestion,
      this.COMMUNITY_PHARMACY_CONCEPT
    );
  }

  public getPatientStatusQuestion() {
    // (questionId is patstat in Outreach Field Follow-Up Form V1.0)
    // (questionId is careStatus in Transfer Out Form v0.01 and other forms
    let patientCareStatus = this.searchNodeByQuestionId('patstat');
    if (patientCareStatus.length === 0) {
      patientCareStatus = this.searchNodeByQuestionId('careStatus');
    }
    // (questionId tracking transfers is transferOut in Outreach Field Follow-Up Form V1.0 & Returns forms)
    if (
      this.componentRef.formUuid === FormUuids.OUTREACH_FOLLOW_UP_FORM_UUID ||
      patientCareStatus.length === 0
    ) {
      patientCareStatus = this.searchNodeByQuestionId('transferOut');
    }
    return patientCareStatus;
  }

  private shouldRedirectToProgramManager(answer: any[], force?: boolean) {
    if (force === true) {
      return true;
    }
    if (answer.length > 0 && !_.isEmpty(_.first(answer).control.value)) {
      return _.includes(
        [
          'a89c2f42-1350-11df-a1f1-0026b9348838', // AMPATH
          'a89c301e-1350-11df-a1f1-0026b9348838', // Non-AMPATH
          'a8a17d80-1350-11df-a1f1-0026b9348838' // MCH/PMTCT
        ],
        _.first(answer).control.value
      );
    }
    return false;
  }

  private loadTransferOutForm() {
    /**
     *  Only load the transfer out form from return or initial forms only
     */
    return !_.includes(
      [
        FormUuids.TRANSFER_OUT_FORM_UUID // AMPATH POC Transfer Out Form
      ],
      this.componentRef.formUuid
    );
  }

  private loadProjectBeyondForm() {
    /**
     *  Only load the Project Beyond Consent form from return or initial forms only
     */
    return !_.includes(
      [
        FormUuids.PROJECT_BEYOND_CONSENT_UUID // AMPATH POC Project Beyond Consent Form
      ],
      this.componentRef.formUuid
    );
  }

  private loadCommunityPharmacyForm() {
    /**
     *  Only load community pharmacy refill form from project beyond consent form
     */
    return !_.includes(
      [FormUuids.COMMUNITY_PHARMACY_CONSENT_UUID],
      this.componentRef.formUuid
    );
  }

  private loadInternalMovementForm() {
    /*
      Only load internal movement form from adult return form
    */

    return !_.includes(
      [
        FormUuids.INTERNAL_MOVEMENT_FORM_UUID // AMPATH POC Internal Movement Form
      ],
      this.componentRef.formUuid
    );
  }

  private getReferralsQuestion() {
    let referralsQuestion = this.searchNodeByQuestionId('referrals');
    if (referralsQuestion.length === 0) {
      referralsQuestion = this.searchNodeByQuestionId('patientReferrals');
    }
    return referralsQuestion.length > 0 &&
      !_.isEmpty(_.first(referralsQuestion).control.value)
      ? referralsQuestion
      : [];
  }

  private getInternalMovementQstn(): any[] {
    const internalMovementQuestion = this.searchNodeByQuestionId(
      'internalMove'
    );
    console.log('WHy is internal', internalMovementQuestion);
    return internalMovementQuestion.length > 0 ? internalMovementQuestion : [];
  }

  private saveTransferOptionsIfSpecified() {
    const careStatus = this.getPatientStatusQuestion();
    if (careStatus.length > 0) {
      localStorage.setItem(
        'careStatus',
        this.mapCareStatus(_.first(careStatus).control.value)
      );
      let transferLocation = this.searchNodeByQuestionId(
        'transfered_out_to_ampath'
      );
      // care status is non-ampath
      if (
        _.first(careStatus).control.value ===
        'a89c301e-1350-11df-a1f1-0026b9348838'
      ) {
        transferLocation = this.searchNodeByQuestionId(
          'transfered_out_to_non_ampath'
        );
      }
      if (transferLocation.length > 0) {
        localStorage.setItem(
          'transferLocation',
          _.first(transferLocation).control.value
        );
      }
    }
    const rtc = this.searchNodeByQuestionId('rtc');
    if (rtc.length > 0) {
      localStorage.setItem('transferRTC', _.first(rtc).control.value);
    }
  }

  private mapCareStatus(key: string): string {
    // concept Uuids are not consistent hence this map. mapping return forms options to transfer out form options
    const map = {
      'a89c2f42-1350-11df-a1f1-0026b9348838':
        'a89c2e5c-1350-11df-a1f1-0026b9348838', // AMPATH
      'a89c2e5c-1350-11df-a1f1-0026b9348838':
        'a89c2e5c-1350-11df-a1f1-0026b9348838', // AMPATH map to itself in defaulter tracing form
      'a89c301e-1350-11df-a1f1-0026b9348838':
        'a8aaf3e2-1350-11df-a1f1-0026b9348838', // Non-AMPATH
      '67cd2f9f-228e-417d-94c4-d77e1a6c3453':
        'a8aaf3e2-1350-11df-a1f1-0026b9348838', // Non-AMPATH defaulter tracing form
      'a8a17d80-1350-11df-a1f1-0026b9348838':
        '1f09e809-8ea3-45e6-a71f-16e6a0d72390', // MCH/PMTCT
      '1f09e809-8ea3-45e6-a71f-16e6a0d72390':
        '1f09e809-8ea3-45e6-a71f-16e6a0d72390' // MCH/PMTCT map to itself in defaulter tracing form
    };
    return map[key];
  }

  private setTransferLocation() {
    const transferLocation = this.searchNodeByQuestionId(
      'transfered_out_to_ampath'
    );
    if (transferLocation.length > 0) {
      localStorage.setItem(
        'transferLocation',
        _.first(transferLocation).control.value
      );
    }
  }

  private searchNodeByQuestionId(questionId: string) {
    return this.componentRef.form.searchNodeByQuestionId(questionId);
  }

  public clearTransferState() {
    this.setTransferState(null);
  }

  private setTransferState(state: any) {
    this.transferState.next(state);
  }

  private shouldLoadInternalMovementForm(formUuid: string): boolean {
    let shouldLoadForm = false;
    if (formUuid !== this.INTERNAL_MOVEMENT_FORM_UUID) {
      shouldLoadForm = true;
    }
    return shouldLoadForm;
  }

  private containsInternalMovementAnwer(interMovementQstn: any[]): boolean {
    let value = '';
    if (interMovementQstn) {
      value = _.first(interMovementQstn).control.value;
    }

    return value === this.YES_CONCEPT;
  }

  private containsEligibleForDeliveryAnwer(interMovementQstn: any[]): boolean {
    let value = '';
    if (interMovementQstn) {
      value = _.first(interMovementQstn).control.value;
    }

    return value === this.YES_ELIGIBLE_FOR_DELIVERY_CONCEPT;
  }

  private hasExpectedAnswer(questions: any[], expectedValue: string): boolean {
    if (!questions || questions.length === 0) {
      return false;
    }

    const firstQuestion = _.first(questions);
    const value =
      firstQuestion && firstQuestion.control
        ? firstQuestion.control.value
        : null;

    return value === expectedValue;
  }
}
