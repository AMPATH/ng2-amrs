/* tslint:disable:no-inferrable-types */
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { PatientResourceService } from './../openmrs-api/patient-resource.service';
import { Patient } from './../models/patient.model';

@Injectable()
export class PatientSearchService {
  public patientsSearchResults: BehaviorSubject<
    Patient[]
  > = new BehaviorSubject<Patient[]>([]);
  public patientsToBindRelationshipSearchResults: BehaviorSubject<
    Patient[]
  > = new BehaviorSubject<Patient[]>([]);
  public searchString: string = '';
  public relationshipSearchString: string = '';

  constructor(private resouceService: PatientResourceService) {}

  public searchPatient(
    searchText: string,
    cached: boolean
  ): Observable<Patient[]> {
    const patientsSearchResults: Subject<Patient[]> = new Subject<Patient[]>();
    this.resouceService
      .searchPatient(searchText.trim(), false)
      .pipe(take(1))
      .subscribe(
        (patients) => {
          const mappedPatients: Patient[] = new Array<Patient>();
          for (const patient of patients) {
            mappedPatients.push(new Patient(patient));
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

  public searchPatientToBindRelationship(
    searchText: string,
    cached: boolean
  ): Observable<Patient[]> {
    const patientsSearchResults: Subject<Patient[]> = new Subject<Patient[]>();
    this.resouceService
      .searchPatient(searchText.trim(), false)
      .pipe(take(1))
      .subscribe(
        (patients) => {
          const mappedPatients: Patient[] = new Array<Patient>();
          for (const patient of patients) {
            mappedPatients.push(new Patient(patient));
          }
          this.relationshipSearchString = searchText.trim();
          patientsSearchResults.next(mappedPatients);
          this.patientsToBindRelationshipSearchResults.next(mappedPatients);
        },
        (error) => {
          this.patientsToBindRelationshipSearchResults.error(error); // test case that returns error
          patientsSearchResults.error(error);
        }
      );
    return patientsSearchResults.asObservable();
  }

  public resetPatients() {
    this.patientsSearchResults.next(new Array<Patient>());
  }

  public resetRelationshipSearch() {
    this.patientsToBindRelationshipSearchResults.next(new Array<Patient>());
  }
}
