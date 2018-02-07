import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { ProgramEnrollmentResourceService } from
  '../../../openmrs-api/program-enrollment-resource.service';

@Injectable()
export class DifferentiatedCareReferralService {

  public get differentiatedCareProgramUuid(): string {
    return '334c9e98-173f-4454-a8ce-f80b20b7fdf0';
  }

  public get differentiatedCareEncounterTypeUuid(): string {
    return 'f022c2ec-db69-4403-b515-127be11cde53';
  }

  public get rtcDateObsConceptUuid(): string {
    return 'a8a666ba-1350-11df-a1f1-0026b9348838';
  }

  constructor(
    public encounterService: EncounterResourceService,
    public enrolllmentService: ProgramEnrollmentResourceService
  ) { }

  public toOpenmrsDateFormat(dateToConvert: any): string {
    let date = moment(dateToConvert);
    if (date.isValid()) {
      return date.format('YYYY-MM-DDTHH:mm:ssZ');
    }
    return '';
  }

  public validateReferralInputs(
    patient: any, providerUuid: string, encounterDateTime: Date,
    rtcDate: Date, locationUuid: string): string {

    let patientUuid = patient.uuid;
    if (!(patientUuid && patientUuid !== '')) {
      return 'Patient is required';
    }

    if (!(providerUuid && providerUuid !== '')) {
      return 'Provider is required';
    }

    if (!(locationUuid && locationUuid !== '')) {
      return 'Location is required';
    }

    if (!(encounterDateTime && encounterDateTime !== null)) {
      return 'Encounter Date is required';
    }

    if (!(rtcDate && rtcDate !== null)) {
      return 'Return to Clinic Date is required';
    }
    return '';
  }

  public referToDifferentiatedCare(
    patient: any, providerUuid: string, encounterDateTime: Date,
    rtcDate: Date, locationUuid: string): Observable<any> {
    let finalSubject = new Subject<any>();

    let validity = this.validateReferralInputs(patient, providerUuid, encounterDateTime,
      rtcDate, locationUuid);
    if (validity !== '') {
      return Observable.throw(validity);
    }

    let patientUuid = patient.uuid;

    let status = {
      successful: false,
      alreadyReferred: false,
      encounterCreation: {
        created: undefined,
        error: undefined,
        done: false
      },
      otherHivProgUnenrollment: {
        unenrolledFrom: [],
        error: undefined,
        done: false
      },
      diffCareProgramEnrollment: {
        enrolled: undefined,
        error: undefined,
        done: false
      }
    };

    // check if enrolled to diff care already
    if (this.hasActiveDifferentiatedCareEnrollment(patient.enrolledPrograms)) {
      status.alreadyReferred = true;
      status.successful = true;
      setTimeout(() => {
        finalSubject.next(status);
      }, 20);
    } else {

      let activePrograms = this.filterOutHivActivePrograms(patient.enrolledPrograms);

      // Step 1: Unenroll from other programs
      if (activePrograms.length === 0) {
        // console.log('No programs enrolled in');
        status.otherHivProgUnenrollment.done = true;
      } else {
        this.endProgramEnrollments(activePrograms, encounterDateTime)
          .subscribe(
          (response) => {
            status.otherHivProgUnenrollment.unenrolledFrom = activePrograms;
            status.otherHivProgUnenrollment.done = true;
            this.onReferralStepCompletion(status, finalSubject);
          },
          (error) => {
            status.otherHivProgUnenrollment.done = true;
            status.otherHivProgUnenrollment.error = error;
            this.onReferralStepCompletion(status, finalSubject);
          }
          );
      }

      // Step 2: Enroll in Diff Care program
      this.enrollPatientToDifferentiatedCare(patientUuid, encounterDateTime, locationUuid)
        .subscribe(
        (response) => {
          status.diffCareProgramEnrollment.enrolled = response;
          status.diffCareProgramEnrollment.done = true;
          this.onReferralStepCompletion(status, finalSubject);
        },
        (error) => {
          status.diffCareProgramEnrollment.done = true;
          status.diffCareProgramEnrollment.error = error;
          this.onReferralStepCompletion(status, finalSubject);
        }
        );

      // Step 3: Fill in encounter containing rtc date
      this.createDifferentiatedCareEncounter(patientUuid, providerUuid, encounterDateTime,
        rtcDate, locationUuid)
        .subscribe(
        (response) => {
          status.encounterCreation.created = response;
          status.encounterCreation.done = true;
          this.onReferralStepCompletion(status, finalSubject);
        },
        (error) => {
          status.encounterCreation.done = true;
          status.encounterCreation.error = error;
          this.onReferralStepCompletion(status, finalSubject);
        }
        );
    }
    return finalSubject;
  }

  public createDifferentiatedCareEncounter(
    patientUuid: string, providerUuid: string, encounterDateTime: Date,
    rtcDate: Date, locationUuid: string): Observable<any> {

    return this.encounterService.saveEncounter(
      {
        location: locationUuid,
        patient: patientUuid,
        encounterProviders: [
          {
            provider: providerUuid,
            encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66'
          }],
        encounterDatetime: this.toOpenmrsDateFormat(encounterDateTime),
        // Format to required openmrs date
        encounterType: this.differentiatedCareEncounterTypeUuid,
        obs: [{
          concept: this.rtcDateObsConceptUuid,
          value: this.toOpenmrsDateFormat(rtcDate)
        }]
      }
    );
  }

  public enrollPatientToDifferentiatedCare(
    patientUuid: string, enrollmentDate: Date,
    locationUuid: string): Observable<any> {
    return this.enrolllmentService.saveUpdateProgramEnrollment(
      {
        location: locationUuid,
        patient: patientUuid,
        dateEnrolled: this.toOpenmrsDateFormat(enrollmentDate.toString()),
        // Format to required openmrs date
        program: this.differentiatedCareProgramUuid
      }
    );
  }

  public filterOutHivActivePrograms(patientEnrollments: Array<any>): Array<any> {
    if (patientEnrollments.length === 0) {
      return [];
    }
    let activeHivPrograms = [];
    patientEnrollments.forEach((enrollment) => {
      if (enrollment.baseRoute === 'hiv' &&
        moment(enrollment.dateEnrolled).isValid() &&
        !moment(enrollment.dateCompleted).isValid()) {
        activeHivPrograms.push(enrollment);
      }
    });
    return activeHivPrograms;
  }

  public hasActiveDifferentiatedCareEnrollment(patientEnrollments: Array<any>): boolean {
    let hasActiveDiffCareEnrollment = false;
    patientEnrollments.forEach((enrollment) => {
      if (enrollment.baseRoute === 'hiv' && !moment(enrollment.dateCompleted).isValid() &&
        moment(enrollment.dateEnrolled).isValid() &&
        enrollment.programUuid === this.differentiatedCareProgramUuid) {
        hasActiveDiffCareEnrollment = true;
      }
    });
    return hasActiveDiffCareEnrollment;
  }

  public endProgramEnrollment(enrollmentUuid: string, dateCompleted: Date): Observable<any> {
    return this.enrolllmentService.saveUpdateProgramEnrollment(
      {
        uuid: enrollmentUuid,
        dateCompleted: this.toOpenmrsDateFormat(dateCompleted) // Format to required openmrs date
      }
    );
  }

  public endProgramEnrollments(patientEnrollments: Array<any>, dateCompleted: Date):
    Observable<any> {
    let allprogramsObservables: Array<Observable<any>> = [];

    patientEnrollments.forEach((enrollment) => {
      if (enrollment.enrolledProgram) {
        allprogramsObservables.push(
          this.endProgramEnrollment(enrollment.enrolledProgram.uuid, dateCompleted)
        );
      }
    });

    return Observable.forkJoin(allprogramsObservables);
  }

  private onReferralStepCompletion(status: any, finalSubject: Subject<any>) {
    let done =
      status.encounterCreation.done &&
      status.otherHivProgUnenrollment.done &&
      status.diffCareProgramEnrollment.done;
    // console.log('A step done!!');
    if (done) {
      if (status.encounterCreation.error ||
        status.otherHivProgUnenrollment.error ||
        status.diffCareProgramEnrollment.error) {
        console.error('encountered an error referring patient to diff care');
        status.successful = false;
        finalSubject.error(status);
      } else {
        status.successful = true;
        finalSubject.next(status);
        // console.log('All steps done!!');
      }
    } else {
      // console.log('All processes not done.', status);
    }
  }
}
