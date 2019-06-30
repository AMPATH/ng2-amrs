
import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { ReplaySubject, Subject, Observable } from 'rxjs';
import { first, map, take } from 'rxjs/operators';

import { Program } from '../../models/program.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import {
  ProgramResourceService
} from '../../openmrs-api/program-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service';
import {
  ProgramWorkFlowResourceService
} from '../../openmrs-api/program-workflow-resource.service';
import {
  ProgramWorkFlowStateResourceService
} from '../../openmrs-api/program-workflow-state-resource.service';

@Injectable()
export class ProgramService {
  constructor(
    private programEnrollmentResourceService: ProgramEnrollmentResourceService,
    private programWorkFlowResourceService: ProgramWorkFlowResourceService,
    private programWorkFlowStateResourceService: ProgramWorkFlowStateResourceService,
    private programResourceService: ProgramResourceService) { }

  public getPatientEnrolledProgramsByUuid(uuid): Observable<ProgramEnrollment[]> {
    const patientsObservable = this.programEnrollmentResourceService.getProgramEnrollmentByPatientUuid(uuid);

    if (patientsObservable === null) {
      throw new Error('Null patient programs observable');
    } else {
      return patientsObservable.pipe(
        map((programs) => {
          if (programs.length > 0) {
            const patientPrograms = [];
            for (const program of programs) {
              patientPrograms.push(new ProgramEnrollment(program));
            }
            return patientPrograms;
          } else {
            return [];
          }
        })
      );
    }
  }

  public getAvailablePrograms(): Observable<Program[]> {
    const programsObservable = this.programResourceService.getPrograms();

    if (programsObservable === null) {
      throw new Error('Null program observable');
    } else {
      return programsObservable.pipe(
        map((programs) => {
          if (programs.length > 0) {
            const availablePrograms = [];
            for (const program of programs) {
              availablePrograms.push(new Program(program));
            }
            return availablePrograms;
          } else {
            return [];
          }
        })
      );
    }
  }

  public createEnrollmentPayload(program, patient, dateEnrolled, dateCompleted,
    locationUuid, enrollmentUuid): any {
    const payLoad = {
      patient: patient.person.uuid,
      program: program,
      dateEnrolled: dateEnrolled,
      uuid: enrollmentUuid,
      dateCompleted: dateCompleted,
      location: locationUuid
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
    // console.log('Program Enrollment Payload ', JSON.stringify(payLoad));
    return payLoad;

  }

  public saveUpdateProgramEnrollment(payload: any, theChange?): Observable<any> {
    if (!payload) {
      return null;
    }
    return this.programEnrollmentResourceService.saveUpdateProgramEnrollment(payload, theChange);
  }

  public getProgramWorkFlows(programUuid: string) {
    return Observable.create((observer: Subject<any[]>) => {
      this.programWorkFlowResourceService.getProgramWorkFlows(programUuid).pipe(
        take(1)).subscribe((workflows: any) => {
          observer.next(workflows.allWorkflows);
        });
    }).pipe(first());
  }

  public getProgramWorkFlowStates(workflowUuid: any) {
    return Observable.create((observer: Subject<any[]>) => {
      this.programWorkFlowStateResourceService.getProgramWorkFlowState(workflowUuid).pipe(
        take(1)).subscribe((states) => {
          observer.next(states);
        });
    }).pipe(first());
  }

  public getSelectedProgram(programs, programUuid) {
    const uuid = programUuid.split(':')[1].trim();
    const filtered = _.filter(programs, (p: any) => {
      if (p.uuid === uuid) {
        return true;
      } else {
        return false;
      }
    });
    return filtered[0];
  }

  public getProgramsIncompatibilities() {
    return this.programResourceService.getProgramsIncompatibilities();
  }
}
