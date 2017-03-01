import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { Patient } from '../../models/patient.model';

@Injectable()
export class PatientSearchService {
  public patientsSearchResults: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  public searchString: string = '';

  constructor(private resouceService: PatientResourceService) {

  }

  searchPatient(searchText: string, cached: boolean): Observable<Patient[]> {
    let patientsSearchResults: Subject<Patient[]> = new Subject<Patient[]>();
    this.resouceService.searchPatient(searchText.trim(), false)
      .subscribe(
      (patients) => {
        let mappedPatients: Patient[] = new Array<Patient>();
        for (let i = 0; i < patients.length; i++) {
          mappedPatients.push(new Patient(patients[i]));
        }
        this.searchString = searchText.trim();
        patientsSearchResults.next(mappedPatients);
        this.patientsSearchResults.next(mappedPatients);
      },
      (error) => {
        this.patientsSearchResults.error(error); // test case that returns error
        patientsSearchResults.error(error);

      }
      );
    return patientsSearchResults.asObservable();
  }

  resetPatients() {
    this.patientsSearchResults.next(new Array<Patient>());

  }


}
