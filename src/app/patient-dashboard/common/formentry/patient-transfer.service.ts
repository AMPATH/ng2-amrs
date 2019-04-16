import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import { FormentryComponent } from './formentry.component';
import * as moment from 'moment';
import { Patient } from '../../../models/patient.model';
import { FormDataSourceService } from './form-data-source.service';
import { ConfirmationService } from 'primeng/primeng';

@Injectable()
export class PatientTransferService {
  public componentRef: FormentryComponent;
  private patient: Patient;
  private transferState: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
  }

  public handleProgramManagerRedirects(data: any, patient: Patient): BehaviorSubject<any> {
    this.patient = patient;
    // check if patient status was filled
    const patientCareStatus = this.getPatientStatusQuestion();
    const referralQuestion = this.getReferralsQuestion();
    const force = patientCareStatus.length > 0 && !_.isEmpty(_.first(patientCareStatus).control.value);
    const queryParams = {};
    if (this.shouldRedirectToProgramManager(patientCareStatus, force)) {
      this.componentRef.preserveFormAsDraft = false;
      // Do not save transfer out options when submitting transfer out form
      if (this.componentRef.formUuid !== 'f8322fde-6160-4e70-8b49-e266022f1108') {
        this.saveTransferOptionsIfSpecified();
      }

      if (this.componentRef.formUuid === 'f8322fde-6160-4e70-8b49-e266022f1108') {
        // patient care status in transfer out form is non-ampath
        if (_.first(patientCareStatus).control.value === 'a8aaf3e2-1350-11df-a1f1-0026b9348838') {
          // all active programs should be stopped
          _.merge(queryParams, {
            stop: (this.componentRef.programClass).toUpperCase(),
            notice: 'other'
          });
        }

        // patient care status in transfer out form is ampath
        if (_.first(patientCareStatus).control.value === 'a89c2e5c-1350-11df-a1f1-0026b9348838') {
          _.merge(queryParams, {
            change: (this.componentRef.programClass).toUpperCase(),
            notice: 'location'
          });
        }
      }
      // MCH/PMTCT concept
      // Transfer to MNCH for PMTCT care concept
      if (_.includes([
        '1f09e809-8ea3-45e6-a71f-16e6a0d72390',
        'a8a17d80-1350-11df-a1f1-0026b9348838'], _.first(patientCareStatus).control.value)) {

        // PMTCT programUuid
        _.merge(queryParams, {
          program: '781d897a-1359-11df-a1f1-0026b9348838',
          notice: 'pmtct'
        });
      }
      if (this.loadTransferOutForm()) {
        this.transferState.next({
          transfer: true,
          loadTransferOutForm: true,
        });
      } else {
        this.transferState.next({transfer: true, params: queryParams});
      }
    }
    if (referralQuestion.length > 0) {
      // Enhanced adherence HIV Program
      if (_.includes(_.first(referralQuestion).control.value, 'a9431295-9862-405b-b694-534f093ca0ad')) {
        // Enhanced adherence HIV Program
        _.merge(queryParams, {
          program: 'c4246ff0-b081-460c-bcc5-b0678012659e',
          notice: 'adherence'
        });
        const location: any = this.componentRef.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
        localStorage.setItem('transferLocation', location.uuid);
      }
      // HIV Differentiated Program
      if (_.includes(_.first(referralQuestion).control.value, '7c6f0599-3e3e-4f42-87a2-2ce66f1e96d0')) {
        // HIV Differentiated Program
        _.merge(queryParams, {
          program: '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
          notice: 'dc'
        });
        const location: any = this.componentRef.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
        localStorage.setItem('transferLocation', location.uuid);
      }
    }
    return this.transferState;
  }

  public prefillTransferOptions(): void {

    const careStatus = this.searchNodeByQuestionId('careStatus');
    if (careStatus.length > 0) {
      /**
       * I was not successful to set the value without simulating a click. Again, I could not simulate without having some little delay.
       * There could be a better way. Note also that this is DOM manipulation inside a service which shouldn't be happening
       */
      // TODO find an Angular way of doing this without having to use VanillaJS
      // some delay just to ensure the question has been rendered then simulate a click before setting value.
      setTimeout(() => {
        const element: HTMLElement = document.getElementById('careStatusid') as HTMLElement;
        element.click();
        careStatus[0].control.setValue(localStorage.getItem('careStatus'));
      }, 30);
      /**
       * Using setTimeout not the best idea. But because of form renderer delay in adding options to select controls, I had to
       * add some delay
       */
      // give some time for the hidden options to be shown
      setTimeout(() => {
        let transferLocation = this.searchNodeByQuestionId('transfered_out_to_ampath');
        // care status is non-ampath
        if (_.first(careStatus).control.value === 'a8aaf3e2-1350-11df-a1f1-0026b9348838') {
          transferLocation = this.searchNodeByQuestionId('transfered_out_to_non_ampath');
        }
        if (transferLocation.length > 0) {
          transferLocation[0].control.setValue(localStorage.getItem('transferLocation'));
        }
      }, 50);
    }
    const rtc = this.searchNodeByQuestionId('rtc');
    if (rtc.length > 0) {

      rtc[0].control.setValue(moment(localStorage.getItem('transferRTC')).format());
    }
  }

  public getPatientStatusQuestion() {
    // (questionId is patstat in Outreach Field Follow-Up Form V1.0)
    // (questionId is careStatus in Transfer Out Form v0.01 and other forms
    let patientCareStatus = this.searchNodeByQuestionId('patstat');
    if (patientCareStatus.length === 0) {
      patientCareStatus = this.searchNodeByQuestionId('careStatus');
    }
    // (questionId tracking transfers is transferOut in Outreach Field Follow-Up Form V1.0 & Returns forms)
    if (this.componentRef.formUuid === '5053f206-cd65-432e-87de-043f48e462a1' || patientCareStatus.length === 0) {
      patientCareStatus = this.searchNodeByQuestionId('transferOut');
    }
    return patientCareStatus;
  }

  private shouldRedirectToProgramManager(answer: any[], force?: boolean) {
    if (force === true) {
      return true;
    }
    if (answer.length > 0 && !_.isEmpty(_.first(answer).control.value)) {
      return _.includes([
        'a89c2f42-1350-11df-a1f1-0026b9348838', // AMPATH
        'a89c301e-1350-11df-a1f1-0026b9348838', // Non-AMPATH
        'a8a17d80-1350-11df-a1f1-0026b9348838' // MCH/PMTCT
      ], _.first(answer).control.value);
    }
    return false;
  }

  private loadTransferOutForm() {
    /**
     *  Only load the transfer out form from return or initial forms only
     */
    return !_.includes([
      'f8322fde-6160-4e70-8b49-e266022f1108', // AMPATH POC Transfer Out Form
    ], this.componentRef.formUuid);
  }

  private getReferralsQuestion() {
    let referralsQuestion = this.searchNodeByQuestionId('referrals');
    if (referralsQuestion.length === 0) {
      referralsQuestion = this.searchNodeByQuestionId('patientReferrals');
    }
    return (referralsQuestion.length > 0 && !_.isEmpty(_.first(referralsQuestion).control.value)) ? referralsQuestion : [];
  }

  private saveTransferOptionsIfSpecified() {
    const careStatus = this.getPatientStatusQuestion();
    if (careStatus.length > 0) {
      localStorage.setItem('careStatus', this.mapCareStatus(_.first(careStatus).control.value));
      let transferLocation = this.searchNodeByQuestionId('transfered_out_to_ampath');
      // care status is non-ampath
      if (_.first(careStatus).control.value === 'a89c301e-1350-11df-a1f1-0026b9348838') {
        transferLocation = this.searchNodeByQuestionId('transfered_out_to_non_ampath');
      }
      if (transferLocation.length > 0) {
        localStorage.setItem('transferLocation', _.first(transferLocation).control.value);
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
      'a89c2f42-1350-11df-a1f1-0026b9348838': 'a89c2e5c-1350-11df-a1f1-0026b9348838', // AMPATH
      'a89c2e5c-1350-11df-a1f1-0026b9348838': 'a89c2e5c-1350-11df-a1f1-0026b9348838', // AMPATH map to itself in defaulter tracing form
      'a89c301e-1350-11df-a1f1-0026b9348838': 'a8aaf3e2-1350-11df-a1f1-0026b9348838', // Non-AMPATH
      '67cd2f9f-228e-417d-94c4-d77e1a6c3453': 'a8aaf3e2-1350-11df-a1f1-0026b9348838', // Non-AMPATH defaulter tracing form
      'a8a17d80-1350-11df-a1f1-0026b9348838': '1f09e809-8ea3-45e6-a71f-16e6a0d72390', // MCH/PMTCT
      '1f09e809-8ea3-45e6-a71f-16e6a0d72390': '1f09e809-8ea3-45e6-a71f-16e6a0d72390'  // MCH/PMTCT map to itself in defaulter tracing form
    };
    return map[key];
  }

  private searchNodeByQuestionId(questionId: string) {
    return this.componentRef.form.searchNodeByQuestionId(questionId);
  }

}
