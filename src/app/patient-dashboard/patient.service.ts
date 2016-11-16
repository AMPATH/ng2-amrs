import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Patient } from '../models/patient.model';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';

@Injectable()
export class PatientService {
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(null);
  public currentlyLoadedPatientUuid = new ReplaySubject(1);

  constructor(private patientResourceService: PatientResourceService) { }

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
    this.patientResourceService.getPatientByUuid(patientUuid, false)
      .subscribe(
      (patientObject: Patient) => {
        this.currentlyLoadedPatient.next(new Patient(patientObject));
        this.currentlyLoadedPatientUuid.next(patientUuid);
      }
      );
  }
}
