import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, Observable } from 'rxjs/Rx';
import {
  ProgramEnrollmentResourceService
} from
  '../../openmrs-api/program-enrollment-resource.service';
import { Program } from '../../models/program.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';

@Injectable()
export class ProgramService {
  constructor(private programEnrollmentResourceService: ProgramEnrollmentResourceService) {
  }

  getPatientEnrolledProgramsByUuid(uuid): Observable<ProgramEnrollment[]> {
    let enrolledPrograms: Subject<ProgramEnrollment[]> = new Subject<ProgramEnrollment[]>();
    let patientsObservable = this.programEnrollmentResourceService.
      getProgramEnrollmentByPatientUuid(uuid);

    if (patientsObservable === null) {
      throw 'Null patient visit observable';
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
}
