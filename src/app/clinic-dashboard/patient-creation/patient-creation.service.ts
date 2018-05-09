import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import {
    PatientCreationResourceService
} from '../../openmrs-api/patient-creation-resource.service';
import { Patient } from '../../models/patient.model';

@Injectable()
export class PatientCreationService {
    public patientsSearchResults: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
    public searchString: string = '';
    public patientsResults: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);

    constructor(private resouceService: PatientResourceService,
                private patientCreationResourceService: PatientCreationResourceService,
                private http: Http
    ) {}

    public searchPatient(searchText: string, cached: boolean): Observable<Patient[]> {
        let patientsSearchResults: Subject<Patient[]> = new Subject<Patient[]>();
        this.resouceService.searchPatient(searchText.trim(), false)
        .subscribe(
        (patients) => {
        let mappedPatients: Patient[] = new Array<Patient>();
        for (let patient of patients) {
            mappedPatients.push(new Patient(patient));
        }
        this.searchString = searchText.trim();
        patientsSearchResults.next(mappedPatients);
        this.patientsSearchResults.next(mappedPatients);
        },
        (error) => {
        this.patientsSearchResults.error(error);
        patientsSearchResults.error(error);

        });
        return patientsSearchResults.asObservable();
    }

    public patientResults(patients) {
        let patientsSearchResults: Subject<Patient[]> = new Subject<Patient[]>();
        let mappedPatients: Patient[] = new Array<Patient>();
        for (let patient of patients) {
            mappedPatients.push(patient);
        }
        patientsSearchResults.next(mappedPatients);
        this.patientsResults.next(mappedPatients);
        return patientsSearchResults.asObservable();
    }
    public getpatientResults() {
        return this.patientsResults.asObservable();
    }

    public getLuhnCheckDigit(numbers) {
        let validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_';
        numbers = numbers.toUpperCase().trim();
        let sum = 0;
        for (let i = 0; i < numbers.length; i++) {
            let ch = numbers.charAt(numbers.length - i - 1);
            if (validChars.indexOf(ch) < 0) {
            return false;
            }
            let digit = ch.charCodeAt(0) - 48;
            let weight;
            if (i % 2 === 0) {
            let res = digit / 5;
            weight = (2 * digit) - parseInt( res.toString() , 10) * 9;
            } else {
            weight = digit;
            }
            sum += weight;
        }
        sum = Math.abs(sum) + 10;
        let digit = (10 - (sum % 10)) % 10;
        return digit;

    }

    public checkRegexValidity(expression, identifier) {
        let identifierRegex = new RegExp('^' + expression + '$');
        return (identifierRegex.test(identifier));
    }

    public generateIdentifier(user) {
        return this.patientCreationResourceService.generateIdentifier(user);
    }

    public commonIdentifierTypes() {
        return [
            'KENYAN NATIONAL ID NUMBER',
            'AMRS Medical Record Number',
            'CCC Number'
        ];
    }
}
