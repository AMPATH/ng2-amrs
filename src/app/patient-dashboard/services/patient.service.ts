import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable, forkJoin, combineLatest } from 'rxjs';
import { Patient } from '../../models/patient.model';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { PatientProgramService } from '../programs/patient-programs.service';

@Injectable()
export class PatientService {
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(null);
  public currentlyLoadedPatientUuid = new BehaviorSubject<string>(null);
  public isBusy: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private patientResourceService: PatientResourceService,
    private patientProgramsService: PatientProgramService,
    private encounterResource: EncounterResourceService) {
  }

  public setCurrentlyLoadedPatientByUuid(patientUuid: string): BehaviorSubject<Patient> {

    if (this.currentlyLoadedPatient.value !== null) {
      // this means there is already a currently loaded patient
      const previousPatient: Patient = new Patient(this.currentlyLoadedPatient.value);
      // fetch from server if patient is NOT the same
      if (previousPatient.uuid !== patientUuid) {
        this.fetchPatientByUuid(patientUuid);
      }
    } else { // At this point we have not set patient object so let's hit the server
      this.fetchPatientByUuid(patientUuid);
    }
    return this.currentlyLoadedPatient;
  }

  public fetchPatientByUuid(patientUuid: string) {
    // reset patient
    this.currentlyLoadedPatient.next(null);
    this.currentlyLoadedPatientUuid.next(null);
    // busy
    this.isBusy.next(true);
    // hit server
    return forkJoin(
      this.patientResourceService.getPatientByUuid(patientUuid, false),
      this.patientProgramsService.getCurrentlyEnrolledPatientPrograms(patientUuid),
      this.encounterResource.getEncountersByPatientUuid(patientUuid)
    ).subscribe(
      (data) => {
        const patient = data[0];
        patient.enrolledPrograms = data[1];
        patient.encounters = data[2];
        this.currentlyLoadedPatient.next(new Patient(patient));
        this.currentlyLoadedPatientUuid.next(patientUuid);
        this.isBusy.next(false);
      },
      (err) => {
        console.error(err);
        this.isBusy.next(false);
      });
  }

  public reloadCurrentPatient() {
    if (this.currentlyLoadedPatient.value !== null) {
      const previousPatient: Patient = new Patient(this.currentlyLoadedPatient.value);
      this.fetchPatientByUuid(previousPatient.uuid);
    }
  }
}
