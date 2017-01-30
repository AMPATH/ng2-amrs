import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, Observable } from 'rxjs/Rx';
import {
  ProgramEnrollmentResourceService
} from
  '../../openmrs-api/program-enrollment-resource.service';

import {
  ProgramResourceService
} from
  '../../openmrs-api/program-resource.service';
import { Program } from '../../models/program.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import * as _ from 'lodash';

@Injectable()
export class ProgramService {
  constructor(private programEnrollmentResourceService: ProgramEnrollmentResourceService,
    private programResourceService: ProgramResourceService) { }

  getPatientEnrolledProgramsByUuid(uuid): Observable<ProgramEnrollment[]> {
    let enrolledPrograms: Subject<ProgramEnrollment[]> = new Subject<ProgramEnrollment[]>();
    let patientsObservable = this.programEnrollmentResourceService.
      getProgramEnrollmentByPatientUuid(uuid);

    if (patientsObservable === null) {
      throw 'Null patient programs observable';
    } else {
      patientsObservable.subscribe(
        (programs) => {
          if (programs.length > 0) {
            let patientPrograms = [];
            for (let program of programs) {
              patientPrograms.push(new ProgramEnrollment(program));
            }
            enrolledPrograms.next(patientPrograms);
          } else {
            enrolledPrograms.next([]);
          }
        }
        ,
        (error) => {
          enrolledPrograms.error(error);
        }
      );
    }
    return enrolledPrograms.asObservable();
  }

  getAvailablePrograms(): Observable<Program[]> {
    let patientEnrollablePrograms: Subject<Program[]> = new Subject<Program[]>();
    let programsObservable = this.programResourceService.
      getPrograms();

    if (programsObservable === null) {
      throw 'Null program observable';
    } else {
      programsObservable.subscribe(
        (programs) => {
          if (programs.length > 0) {
            let availablePrograms = [];
            for (let program of programs) {
              availablePrograms.push(new Program(program));
            }
            patientEnrollablePrograms.next(availablePrograms);
          } else {
            patientEnrollablePrograms.next([]);
          }
        }
        ,
        (error) => {
          patientEnrollablePrograms.error(error);
        }
      );
    }
    return patientEnrollablePrograms.asObservable();
  }



  createEnrollmentPayload(program, patient, dateEnrolled, dateCompleted, enrollmentUuid): any {
    let payLoad = {
      patient: patient.person.uuid,
      program: program,
      dateEnrolled: dateEnrolled,
      uuid: enrollmentUuid,
      dateCompleted: dateCompleted
    };

    // delete dateCompleted property  if the dateCompleted is null at enrollment
    if (!payLoad.dateCompleted || enrollmentUuid === '') {
      delete payLoad['dateCompleted'];
    }

    if (payLoad.uuid === undefined) {
      delete payLoad['uuid'];
    }

    if (enrollmentUuid !== undefined && enrollmentUuid !== '') {
      // delete program and patient properties as they are needed when updating enrollment
      delete payLoad['patient'];
      delete payLoad['program'];
    }
    console.log('Program Enrollment Payload ', JSON.stringify(payLoad));
    return payLoad;

  }

  saveUpdateProgramEnrollment(payload: any): Observable<any> {
    if (!payload) {
      return null;
    }
    return this.programEnrollmentResourceService.saveUpdateProgramEnrollment(payload);
  }

  getSelectedProgram(programs, programUuid) {
    let uuid = programUuid.split(':')[1].trim();
    let filtered = _.filter(programs, (p: any) => {
      if (p.uuid === uuid) {
        return true;
      } else {
        return false;
      }
    });
    return filtered[0];
  }

}
