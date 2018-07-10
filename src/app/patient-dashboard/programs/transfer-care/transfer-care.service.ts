import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import * as moment from 'moment';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { ProgramService } from '../program.service';
import { Patient } from '../../../models/patient.model';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';

@Injectable()
export class ProgramsTransferCareService {
  public confirmPayLoad: BehaviorSubject<any> = new BehaviorSubject(null);
  public isModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public transferStatus: boolean = false;

  constructor(private patientProgramResourceService: PatientProgramResourceService,
              private encounterResourceService: EncounterResourceService,
              private programService: ProgramService) {
  }

  public savePayload(payload: any): void {
    this.confirmPayLoad.next(payload);
  }

  public getPayload(): Observable<any> {
    return this.confirmPayLoad.asObservable();
  }

  public setTransferStatus(status: boolean): void {
    this.transferStatus = status;
  }

  public transferFromModal(status) {
    this.isModal.next(status);
  }

  public getModalOpenState(): Observable<boolean> {
    return this.isModal.asObservable();
  }

  public transferComplete(): boolean {
    return this.transferStatus;
  }

  public attachEncounterForms(program: any, configs: any): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      if (configs) {
        let _config = configs[program.programUuid];
        let emptyTransfer = {
          'AMPATH': [],
          'DISCHARGE': [],
          'NON-AMPATH': []
        };
        let reply: any;
        if (_config) {
          reply = _config && _config.transferCare === undefined
            ? emptyTransfer : _config.transferCare;
          observer.next(_.merge(program, {encounterForms: reply[program.transferType]}));
        } else {
          observer.next(_.merge(program, {encounterForms: []}));
        }
      } else {
        observer.next(_.merge(program, {encounterForms: []}));
      }
    }).first();
  }

  public fetchAllProgramTransferConfigs(patientUuid): Observable<any> {
    return this.patientProgramResourceService.getPatientProgramVisitConfigs(patientUuid);
  }

  public transferPatient(patient: Patient, programs: any[]) {
    let programBatch: Array<Observable<any>> = [];
    _.each(programs, (program: any) => {
      let location = program.enrolledProgram.location ?
        program.enrolledProgram.location.uuid : null;
      let unenrollPayload = this.programService.createEnrollmentPayload(
        program.programUuid, patient, program.dateEnrolled,
        program.transferDate, location , program.enrolledProgram.uuid);
      // if intra-ampath, unenroll and enroll in the new location
      if (program.transferType === 'AMPATH') {
        let enrollPayload = this.programService.createEnrollmentPayload(
          program.programUuid, patient, program.transferDate, null,
          program.location.locations.value, '');
        if (program.enrolledProgram.states) {
          let state: any = _.first(program.enrolledProgram.states);
        }
        programBatch.push(this.programService.saveUpdateProgramEnrollment(unenrollPayload));
        programBatch.push(this.programService.saveUpdateProgramEnrollment(enrollPayload));
      } else {
        // just unenroll
        programBatch.push(this.programService.saveUpdateProgramEnrollment(unenrollPayload));
      }
    });
    return Observable.forkJoin(programBatch);
  }

  public getPatientEncounters(patient: Patient): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      this.encounterResourceService.getEncountersByPatientUuid(patient.uuid, false, null)
        .subscribe((resp) => {
        observer.next(resp.reverse());
      }, (err) => {
          observer.error(err);
        });
    });
  }

  public pickEncountersByLastFilledDate(patientEncounters: any[], date: any) {
    let encounters = _.map(_.filter(patientEncounters, (encounter: any) => {
      let encounterDate = moment(encounter.encounterDatetime).format('DD-MM-YYYY');
      let lastDischargeDate = moment(date).format('DD-MM-YYYY');
      return encounterDate === lastDischargeDate;
    }), (encounter: any) => {
      return encounter.encounterType.uuid;
    });
    return _.uniq(encounters);
  }

  private toOpenmrsDateFormat(dateToConvert: any): string {
    let date = moment(dateToConvert);
    if (date.isValid()) {
      return date.subtract(3, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
    }
    return '';
  }
}
