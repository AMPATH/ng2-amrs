import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import {
    PatientCreationResourceService
} from '../openmrs-api/patient-creation-resource.service';
import { Patient } from '../models/patient.model';
import * as _ from 'lodash';

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
        console.log('Required check digit', digit);
        return digit;

    }

    public checkRegexValidity(expression, identifier) {
        let identifierRegex = new RegExp(expression);
        return (identifierRegex.test(identifier));
    }

    public generateIdentifier(user) {
        return this.patientCreationResourceService.generateIdentifier(user);
    }

    public commonIdentifierTypes() {
        return [
            'KENYAN NATIONAL ID NUMBER',
            'AMRS Universal ID',
            'AMRS Medical Record Number',
            'CCC Number'
        ];
    }

    public getIdentifierTypeFormat(identifierType) {
        let formatRestrictedIdentifiers = this.identifierTypeFormat();
        return _.filter(formatRestrictedIdentifiers, (identifierTypeFormat) => {
          if (identifierTypeFormat.val === identifierType) {
            return true;
          } else {
            return false;
          }
        });
      }
        private identifierTypeFormat() {
          return [
              {label: 'AMRS Medical Record Number', format: null, checkdigit: 1,
              val: '58a46e2e-1359-11df-a1f1-0026b9348838'},
              {label: 'AMRS Medical Record1', format: null, checkdigit: 1,
              val: 'df6840a6-47e9-4f7a-9112-0ca6fd783941'},
              {label: 'AMRS Universal ID', format: null, checkdigit: 1,
              val: '58a4732e-1359-11df-a1f1-0026b9348838'},
              {label: 'CCC Number', format: '^\\d{5}-\\d{5}$', checkdigit: null,
              val: 'f2d6ff1a-8440-4d35-a150-1d4b5a930c5e'},
              {label: 'AMPATH Staff PF Number', format: '^AM-\\d{4,5}$', checkdigit: null,
              val: 'c700c468-57b4-45c5-8912-318770c8856d'},
              {label: 'Anticoagulation Clinic Number', format: '^AC-\\d{4,5}$', checkdigit: null,
              val: 'c456a1db-1c7c-4b82-be09-867d9a3abb61'},
              {label: 'HCT ID', format: null, checkdigit: 1,
              val: '58a4723e-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH Amenity Number', format: '^AOPD-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a4809e-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH ANC Number', format: '^ANC-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a4844a-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH Casualty Number', format: '^CAS-\\d{2,5}/\\d{2}$', checkdigit: null,
              val: '58a47608-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH CWC Number', format: '^CWC-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a48530-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH Dental Number', format: '^DC-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a48274-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH ENT Number', format: '^ENT-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a4835a-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH Eye Clinic Number', format: '^ER-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a488d2-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH FP Number', format: '^FP-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a47cf2-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH IP Number', format: '^IP-\\d{3,7}$', checkdigit: null,
              val: '58a47ec8-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH Memorial Number', format: '^MW-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a48184-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH OPD Number', format: '^OPD-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a47bf8-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH ORTHO Number', format: '^OT-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a48616-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH SCC Number', format: '^SCC-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a47de2-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH Staff PF Number', format: '^PF-\\d{4,5}$', checkdigit: null,
              val: '58a487ec-1359-11df-a1f1-0026b9348838'},
              {label: 'MTRH X-Ray Number', format: '^X-\\d{3,5}/\\d{2}$', checkdigit: null,
              val: '58a47fae-1359-11df-a1f1-0026b9348838'},
              {label: 'OVCID', format: '^\\d{8}-\\d{14}$', checkdigit: null,
              val: '52b78065-5c0f-4cf8-ab02-6b1b992b18c4'},
              {label: 'pMTCT ID', format: null, checkdigit: 1,
              val: '58a47144-1359-11df-a1f1-0026b9348838'},
              {label: 'X Number', format: null, checkdigit: 1,
              val: '58a4741e-1359-11df-a1f1-0026b9348838'}
          ];
      }
}
