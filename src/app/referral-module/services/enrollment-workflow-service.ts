import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { Patient } from '../../models/patient.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EnrollementWorkflowService {
  constructor(private programService: ProgramService) {

  }
  // handling enrollment
  public enrollPatient(programUuid, patient: Patient, location, state, enrollmentUuid) {
    let enrollPayload = this.programService.createEnrollmentPayload(
      programUuid, patient, this.toOpenmrsDateFormat(new Date()), null,
      location, enrollmentUuid);
    return this.programService.saveUpdateProgramEnrollment(enrollPayload);
  }

  // handling unenrollment /completion of programs

  public unenrollPatient(programUuid, patient: Patient, location, state, enrollmentUuid,
                         dateEnrolled) {
    let unenrollPayload = this.programService.createEnrollmentPayload(
      programUuid, patient, dateEnrolled, this.toOpenmrsDateFormat(new Date()),
      location, enrollmentUuid);
    return this.programService.saveUpdateProgramEnrollment(unenrollPayload);
  }

  public pendingTransfers(programUuid, patient: Patient, currentLocation, ToLocation, state,
                          enrollmentUuid) {
    let programBatch: Array<Observable<any>> = [];
    /*programBatch.push(this.enrollPatient(programUuid, patient, currentLocation, state,
      enrollmentUuid));*/
    programBatch.push(this.enrollPatient(programUuid, patient, currentLocation, state, ''));

    return Observable.forkJoin(programBatch);
  }

  public switchProgram(enrollProgramUuid, unenrollProgramUuid, patient: Patient, location, state,
                       enrollmentUuid,
                       dateEnrolled) {
    let programBatch: Array<Observable<any>> = [];
    programBatch.push(this.unenrollPatient(unenrollProgramUuid, patient, location, state,
      enrollmentUuid, dateEnrolled));
    programBatch.push(this.enrollPatient(enrollProgramUuid, patient, location, null,
      ''));

    return Observable.forkJoin(programBatch);

  }

  public referBack(programUuid, patient: Patient, currentLocation, ToLocation, terminalState,
                   newState, enrollmentUuid, dateEnrolled) {
    let programBatch: Array<Observable<any>> = [];
    programBatch.push(this.enrollPatient(programUuid, patient, currentLocation, terminalState,
      ''));
    console.log('newState', newState);
    programBatch.push(this.enrollPatient(programUuid, patient, ToLocation, newState,
      ''));

    return Observable.forkJoin(programBatch);

  }

  public transferOut(programUuid, patient: Patient, currentLocation, toLocation, state,
                     enrollmentUuid, dateEnrolled) {
    let programBatch: Array<Observable<any>> = [];
    programBatch.push(this.unenrollPatient(programUuid, patient, currentLocation, null,
      enrollmentUuid, dateEnrolled));
    programBatch.push(this.enrollPatient(programUuid, patient, toLocation, state, ''));

    return Observable.forkJoin(programBatch);
  }

  // handling different enrollment types
  public processWorkflowStateChange(programUuid, patient: Patient, currentLocation, state,
                                    enrollmentUuid,
                                    toLocation, dateEnrolled = null,
                                    unenrollProgramUuid = null, newState = null)
  : Observable<any> {
    switch (state.type) {
      case 'transferOut':
        // state: pending transfer
        return this.transferOut(programUuid, patient, currentLocation, toLocation, state,
          enrollmentUuid, dateEnrolled);
      case 'inCare':
        return this.enrollPatient(programUuid, patient, currentLocation, state, enrollmentUuid);
      case 'pendingTransfer':
        return this.pendingTransfers(programUuid, patient, currentLocation, toLocation, state,
          enrollmentUuid);
      case 'referIn':
      case 'transferIn':
        return this.enrollPatient(programUuid, patient, toLocation, state, enrollmentUuid);
      case 'discharge':
        return this.unenrollPatient(programUuid, patient, currentLocation, null,
          enrollmentUuid,
          dateEnrolled);
      case 'switchProgram':
        // state: in care
        return this.switchProgram(programUuid, unenrollProgramUuid, patient, currentLocation,
          state, enrollmentUuid, dateEnrolled);
      case 'referredBack':
        return this.referBack(programUuid, patient, currentLocation, toLocation, state,
          newState, enrollmentUuid, dateEnrolled);
      default:
        return Observable.create((observer: Subject<any>) => {
            observer.next(null);
        });
    }
  }

  private toOpenmrsDateFormat(dateToConvert: any): string {
    let date = moment(dateToConvert);
    if (date.isValid()) {
      return date.subtract(3, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
    }
    return '';
  }

}
