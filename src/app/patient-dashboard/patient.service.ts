import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Patient } from '../models/patient.model';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';

@Injectable()
export class PatientService {
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(null);
  public currentlyLoadedPatientUuid = new ReplaySubject(1);
  public isBusy: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private patientResourceService: PatientResourceService,
    private programEnrollmentResourceService: ProgramEnrollmentResourceService,
    private encounterResource: EncounterResourceService) {
  }

  public setCurrentlyLoadedPatientByUuid(patientUuid: string): BehaviorSubject<Patient> {

    if (this.currentlyLoadedPatient.value !== null) {
      // this means there is already a currently loaded patient
      let previousPatient: Patient = new Patient(this.currentlyLoadedPatient.value);
      // fetch from server if patient is NOT the same
      if (previousPatient.uuid !== patientUuid)
        this.fetchPatientByUuid(patientUuid);
    } else { // At this point we have not set patient object so let's hit the server
      this.fetchPatientByUuid(patientUuid);
    }
    return this.currentlyLoadedPatient;
  }

  public fetchPatientByUuid(patientUuid: string): void {
    // reset patient
    this.currentlyLoadedPatient.next(null);
    this.currentlyLoadedPatientUuid = new ReplaySubject(1);
    // busy
    this.isBusy.next(true);
    // hit server
    Observable.forkJoin(
      this.patientResourceService.getPatientByUuid(patientUuid, false),
      this.programEnrollmentResourceService.getProgramEnrollmentByPatientUuid(patientUuid),
      this.encounterResource.getEncountersByPatientUuid(patientUuid)
    ).subscribe(
      (data) => {

        let patient = data[0];
        patient.enrolledPrograms = data[1];
        patient.encounters = data[2];
        this.currentlyLoadedPatient.next(new Patient(patient));
        this.currentlyLoadedPatientUuid.next(patientUuid);
        this.isBusy.next(false);
      },
      err => {
        console.log(err);
        this.isBusy.next(false);
      });

  }
}
