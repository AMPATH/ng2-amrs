import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs/Rx';
import { Patient } from '../models/patient.model';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';

@Injectable()
export class PatientService {
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(null);
  public currentlyLoadedPatientUuid = new ReplaySubject(1);

  constructor(private patientResourceService: PatientResourceService) { }

  public setCurrentlyLoadedPatientByUuid(patientUuid: string): void {
    try {
      let previousPatient: Patient = new Patient(this.currentlyLoadedPatient.value);
      if (previousPatient.uuid === patientUuid)
        return; // don't fetch from server if patient is the same
      this.fetchPatientByUuid(patientUuid);
    } catch (ex) { // At this point we have not set patient object so let's hit the server
      this.fetchPatientByUuid(patientUuid);
    }
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
