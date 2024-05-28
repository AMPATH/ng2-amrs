import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { ProgramEnrollmentResourceService } from './../../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from './../../../../openmrs-api/encounter-resource.service';
import * as moment from 'moment';
// Interfaces
import {
  ProgramEnrollment,
  ProgramEnrollmentPayload
} from './../../../../interfaces/program-enrollment.interface';

import { Program } from './../../../../interfaces/program.interface';

// constants
import { Programs } from './../../../../constants/program.constants';

interface Provider {
  provider: string;
  encounterRole: string;
}
interface Obs {
  concept: string;
  value: any;
  voided?: any;
}
interface EncounterPayload {
  location: string;
  patient: string;
  encounterProviders: Provider[];
  encounterDatetime: string;
  encounterType: string;
  obs?: Obs[];
}

@Injectable()
export class HivReferralService {
  private PMTCT_AUTO_ENROLLMENT_ENCOUNTER =
    'f94163d5-31eb-4c43-bc28-ae0eadf608a7';
  private STANDARD_HIV_AUTO_ENROLLMENT_ENCOUNTER =
    '52994982-1c0a-4c36-b82b-9c2f12c7c207';
  constructor(
    private programEnrollmentService: ProgramEnrollmentResourceService,
    private encounterService: EncounterResourceService
  ) {}

  public getPatientEnrolledPrograms(patientUuid: string): Observable<any> {
    return this.programEnrollmentService.getProgramEnrollmentByPatientUuid(
      patientUuid
    );
  }
  public getPatientCurrentlyEnrolledHivPrograms(
    patientUuid: string
  ): Observable<any> {
    const enrolledHivProgramsResult: BehaviorSubject<any> = new BehaviorSubject<
      any
    >({});
    this.programEnrollmentService
      .getProgramEnrollmentByPatientUuid(patientUuid)
      .pipe(take(1))
      .subscribe((programs) => {
        const hivPrograms = programs.filter((program: any) => {
          return (
            this.isHivProgram(program.program.uuid) &&
            program.dateCompleted === null
          );
        });
        enrolledHivProgramsResult.next(hivPrograms);
      });

    return enrolledHivProgramsResult.asObservable();
  }
  public completePatientEnrolledProgram(program: {
    uuid: string;
    dateCompleted: string;
  }): Observable<any> {
    return this.programEnrollmentService.saveUpdateProgramEnrollment(program);
  }
  public completePatientEnrolledPrograms(
    programs: { uuid: string; dateCompleted: Date }[]
  ): Observable<any> {
    const completeEnrollmentObservableArray: Array<Observable<any>> = [];
    programs.forEach((program: ProgramEnrollment) => {
      const payload = {
        uuid: program.uuid,
        dateCompleted: moment().subtract(1, 'minutes').format()
      };
      completeEnrollmentObservableArray.push(
        this.completePatientEnrolledProgram(payload)
      );
    });

    return forkJoin(completeEnrollmentObservableArray);
  }
  public enrollToProgram(payload: ProgramEnrollmentPayload): Observable<any> {
    return this.programEnrollmentService.saveUpdateProgramEnrollment(payload);
  }
  private isHivProgram(programUuid: string): boolean {
    const hivPrograms = this.getHivPrograms();
    return hivPrograms.some((p: Program) => {
      return p.uuid === programUuid;
    });
  }
  public saveAutoEnrollmentEncounter(
    programUuid: string,
    encounterPayload: EncounterPayload
  ): Observable<any> {
    const autoEnrollmentencounterPayload = this.createAutoEnrollmentPayload(
      programUuid,
      encounterPayload
    );

    return this.encounterService.saveEncounter(autoEnrollmentencounterPayload);
  }
  private createAutoEnrollmentPayload(
    programUuid: string,
    encounterPayLoad: EncounterPayload
  ): EncounterPayload {
    const encounterPayload: EncounterPayload = {
      location: encounterPayLoad.location,
      patient: encounterPayLoad.patient,
      encounterProviders: encounterPayLoad.encounterProviders,
      encounterDatetime: encounterPayLoad.encounterDatetime,
      encounterType: this.getAutoEnrollmentEncounterType(programUuid),
      obs: []
    };
    return encounterPayload;
  }
  private getAutoEnrollmentEncounterType(programUuid: string): string {
    let autoEnrollmentUuid = '';
    if (programUuid === Programs.STANDARD_HIV_PROGRAM.uuid) {
      autoEnrollmentUuid = this.STANDARD_HIV_AUTO_ENROLLMENT_ENCOUNTER;
    } else if (
      programUuid === Programs.ANC_PROGRAM.uuid ||
      programUuid === Programs.PNC_PROGRAM.uuid
    ) {
      autoEnrollmentUuid = this.PMTCT_AUTO_ENROLLMENT_ENCOUNTER;
    }
    return autoEnrollmentUuid;
  }

  public getHivPrograms(): Program[] {
    const hivPrograms: Program[] = [];
    Object.keys(Programs).forEach((key: string) => {
      if (Programs[key].dept === 'HIV') {
        hivPrograms.push(Programs[key]);
      }
    });

    return hivPrograms;
  }

  public isIncompatibleHivProgram(programUuid: string): boolean {
    const hivPograms = this.getHivPrograms();
    return hivPograms.some((program: Program) => {
      if (program.uuid === programUuid) {
        return !program.compatibleWithOtherDeptPrograms;
      } else {
        return false;
      }
    });
  }
}
