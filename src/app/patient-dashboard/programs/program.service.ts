import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import {
  ProgramEnrollmentResourceService
} from
  '../../openmrs-api/program-enrollment-resource.service';
import { Program } from '../../models/program.model';

@Injectable()
export class ProgramService {
  public enrolledPrograms: BehaviorSubject<Program> = new BehaviorSubject(null);
  constructor(private programEnrollmentResourceService: ProgramEnrollmentResourceService) {
  }


  public getPatientEnrolledProgramsByUuid(patientUuid: string): BehaviorSubject<Program> {
    this.programEnrollmentResourceService.getProgramEnrollmentByPatientUuid(patientUuid)
      .subscribe(
        (program: Program) => {
          this.enrolledPrograms.next(new Program(program));
        },
        (error) => {
          this.enrolledPrograms.error(error);
        }
      );
    return this.enrolledPrograms;
  }
}
