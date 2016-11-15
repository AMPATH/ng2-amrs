import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { Patient } from '../../models/patient.model';

@Injectable()
export class PatientSearchService {
  subject: BehaviorSubject<Patient[]>;

  constructor(private resouceService: PatientResourceService) {

  }

  searchPatient(searchText: string, cached: boolean): Observable<Patient[]> {
    this.subject = new BehaviorSubject<Patient[]>([]);

    let patientsObservable = this.resouceService.searchPatient(searchText, false);

    patientsObservable.subscribe(
      (patients) => {
        let mappedPatients: Patient[] = new Array<Patient>();

        for (let i = 0; i < patients.length; i++) {
          mappedPatients.push(new Patient(patients[i]));
        }

        this.subject.next(mappedPatients);
      },
      (error) => {
        this.subject.error(error); // test case that returns error
      }
    );
    return this.subject.asObservable();
  }

  resetPatients() {
    this.subject.next(new Array<Patient>());

  }





}
