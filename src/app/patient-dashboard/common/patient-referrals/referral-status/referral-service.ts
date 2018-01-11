import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import { EncounterResourceService } from '../../../../openmrs-api/encounter-resource.service';
import { ProgramEnrollmentResourceService } from
  '../../../../openmrs-api/program-enrollment-resource.service';

@Injectable()
export class PatientReferralService {

  public rtcDateObsConceptUuid = 'a8a666ba-1350-11df-a1f1-0026b9348838';

  public referalProgramEncounter = {
    'c4246ff0-b081-460c-bcc5-b0678012659e': {
         'program': 'MDT program',
         'incomapatibilies': false,
         'encounter': {
           'uuid': '523ea7bf-b689-4413-ae3d-e45c0ed5527f',
           'name': 'MDT AUTO-ENROLLMENT'
         }
    },
    '334c9e98-173f-4454-a8ce-f80b20b7fdf0': {
      'program': 'Differentiated Care Program',
      'incomapatibilies': true,
      'encounter': {
        'uuid': 'f022c2ec-db69-4403-b515-127be11cde53',
        'name': 'DIFFERENTIATED CARE AUTO-ENROLLMENT'
      }
    }

  };

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

  public referToProgram(
    patient: any, providerUuid: string, encounterDateTime: Date,
    rtcDate: Date, locationUuid: string, programUuid): Observable<any> {
    let finalSubject = new Subject<any>();
    let referProgramObj: any = this.referalProgramEncounter[programUuid];
    let encounterUuid: any = referProgramObj.encounter.uuid;
    let incompatibilty: any = referProgramObj.incomapatibilies;

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
      programEnrollment: {
        enrolled: undefined,
        error: undefined,
        done: false,
        program: {
          'display': referProgramObj.program
        }
      }
    };

    // check if enrolled to MDT already
    if (this.hasActiveProgramEnrollment(patient.enrolledPrograms, programUuid)) {
      status.alreadyReferred = true;
      status.successful = true;
      setTimeout(() => {
        finalSubject.next(status);
      }, 20);
    } else {

     /*
      unenroll only if the program is incompatible with other hiv programs
    */
      if (incompatibilty === true) {

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
      } else {
        status.otherHivProgUnenrollment.done = false;
      }

      // Step 2: Enroll to MDT/Differenciated Care program
      this.enrollPatientToProgram(patientUuid, encounterDateTime, locationUuid, programUuid)
        .subscribe(
        (response) => {
          status.programEnrollment.enrolled = response;
          status.programEnrollment.done = true;
          this.onReferralStepCompletion(status, finalSubject);
        },
        (error) => {
          status.programEnrollment.done = true;
          status.programEnrollment.error = error;
          this.onReferralStepCompletion(status, finalSubject);
        }
        );

      // Step 3: Fill in encounter containing rtc date
      this.creatProgramEncounter(patientUuid, providerUuid, encounterDateTime,
        rtcDate, locationUuid, encounterUuid)
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

  public creatProgramEncounter(
    patientUuid: string, providerUuid: string, encounterDateTime: Date,
    rtcDate: Date, locationUuid: string, encounterUuid: string): Observable<any> {

    return this.encounterService.saveEncounter(
      {
        location: locationUuid,
        patient: patientUuid,
        provider: providerUuid,
        encounterDatetime: this.toOpenmrsDateFormat(encounterDateTime),
        // Format to required openmrs date
        encounterType: encounterUuid,
        obs: [{
          concept: this.rtcDateObsConceptUuid,
          value: this.toOpenmrsDateFormat(rtcDate)
        }]
      }
    );
  }

  public enrollPatientToProgram(
    patientUuid: string, enrollmentDate: Date,
    locationUuid: string, programUuid: string): Observable<any> {
    return this.enrolllmentService.saveUpdateProgramEnrollment(
      {
        location: locationUuid,
        patient: patientUuid,
        dateEnrolled: this.toOpenmrsDateFormat(enrollmentDate.toString()),
        // Format to required openmrs date
        program: programUuid
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

  public hasActiveProgramEnrollment(patientEnrollments: Array<any>, programUuid: string): boolean {
    let hasActiveProgramEnrollment = false;
    patientEnrollments.forEach((enrollment) => {
      if (enrollment.baseRoute === 'hiv' && !moment(enrollment.dateCompleted).isValid() &&
        moment(enrollment.dateEnrolled).isValid() &&
        enrollment.programUuid === programUuid) {
          hasActiveProgramEnrollment = true;
      }
    });
    return hasActiveProgramEnrollment;
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
      status.programEnrollment.done;
      // console.log('A step done!!', status);
    if (done) {
      if (status.encounterCreation.error ||
        status.otherHivProgUnenrollment.error ||
        status.programEnrollment.error) {
        // console.error('encountered an error referring patient to diff care');
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
