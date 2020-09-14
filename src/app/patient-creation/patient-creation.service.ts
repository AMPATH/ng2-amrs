
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import {
    PatientCreationResourceService
} from '../openmrs-api/patient-creation-resource.service';
import { Patient } from '../models/patient.model';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class PatientCreationService {
    public patientsSearchResults: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
    public searchString = '';
    public patientsResults: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);

    constructor(private resouceService: PatientResourceService,
        private patientCreationResourceService: PatientCreationResourceService,
        private http: HttpClient,
        private appSettingsService: AppSettingsService,
    ) { }

    public searchPatient(searchText: string, cached: boolean): Observable<Patient[]> {
        const patientsSearchResults: Subject<Patient[]> = new Subject<Patient[]>();
        this.resouceService.searchPatient(searchText.trim(), false).pipe(
            take(1)).subscribe(
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
                    this.patientsSearchResults.error(error);
                    patientsSearchResults.error(error);

                });
        return patientsSearchResults.asObservable();
    }

    public patientResults(patients) {
        const patientsSearchResults: Subject<Patient[]> = new Subject<Patient[]>();
        const mappedPatients: Patient[] = new Array<Patient>();
        for (const patient of patients) {
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
        const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_';
        numbers = numbers.toUpperCase().trim();
        let sum = 0;
        for (let i = 0; i < numbers.length; i++) {
            const ch = numbers.charAt(numbers.length - i - 1);
            if (validChars.indexOf(ch) < 0) {
                return false;
            }
            // tslint:disable-next-line:no-shadowed-variable
            const digit = ch.charCodeAt(0) - 48;
            let weight;
            if (i % 2 === 0) {
                const res = digit / 5;
                weight = (2 * digit) - parseInt(res.toString(), 10) * 9;
            } else {
                weight = digit;
            }
            sum += weight;
        }
        sum = Math.abs(sum) + 10;
        const digit = (10 - (sum % 10)) % 10;
        console.log('Required check digit', digit);
        return digit;

    }

    public checkRegexValidity(expression, identifier) {
        const identifierRegex = new RegExp(expression);
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
        const formatRestrictedIdentifiers = this.identifierTypeFormat();
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
            {
                label: 'AMRS Medical Record Number', format: null, checkdigit: 1,
                val: '58a46e2e-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'AMRS Medical Record1', format: null, checkdigit: 1,
                val: 'df6840a6-47e9-4f7a-9112-0ca6fd783941'
            },
            {
                label: 'AMRS Universal ID', format: null, checkdigit: 1,
                val: '58a4732e-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'CCC Number', format: '^\\d{5}-\\d{5}$', checkdigit: null,
                val: 'f2d6ff1a-8440-4d35-a150-1d4b5a930c5e'
            },
            {
                label: 'AMPATH Staff PF Number', format: '^AM-\\d{4,5}$', checkdigit: null,
                val: 'c700c468-57b4-45c5-8912-318770c8856d'
            },
            {
                label: 'Anticoagulation Clinic Number', format: '^AC-\\d{4,5}$', checkdigit: null,
                val: 'c456a1db-1c7c-4b82-be09-867d9a3abb61'
            },
            {
                label: 'HCT ID', format: null, checkdigit: 1,
                val: '58a4723e-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH Amenity Number', format: '^AOPD-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a4809e-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH ANC Number', format: '^ANC-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a4844a-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH Casualty Number', format: '^CAS-\\d{2,5}/\\d{2}$', checkdigit: null,
                val: '58a47608-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH CWC Number', format: '^CWC-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a48530-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH Dental Number', format: '^DC-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a48274-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH ENT Number', format: '^ENT-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a4835a-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH Eye Clinic Number', format: '^ER-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a488d2-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH FP Number', format: '^FP-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a47cf2-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH IP Number', format: '^IP-\\d{3,7}$', checkdigit: null,
                val: '58a47ec8-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH Memorial Number', format: '^MW-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a48184-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH OPD Number', format: '^OPD-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a47bf8-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH ORTHO Number', format: '^OT-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a48616-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH SCC Number', format: '^SCC-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a47de2-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH Staff PF Number', format: '^PF-\\d{4,5}$', checkdigit: null,
                val: '58a487ec-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'MTRH X-Ray Number', format: '^X-\\d{3,5}/\\d{2}$', checkdigit: null,
                val: '58a47fae-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'pMTCT ID', format: null, checkdigit: 1,
                val: '58a47144-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'X Number', format: null, checkdigit: 1,
                val: '58a4741e-1359-11df-a1f1-0026b9348838'
            },
            {
                label: 'KUZA ID', format: '^KUZA\\d{5}$', checkdigit: 0,
                val: 'd1e5ef63-126f-4b1f-bd3f-496c16c4098d'
            },
            {
                label: 'BHIM', format: '^B\\d{5}-\\d{5}$', checkdigit: 0,
                val: '5b91df4a-db7d-4c52-ac85-ac519420d82e'
            },
            {
                label: 'PrEP', format: '^\\d{5}-\\d{4}-\\d{5}$', checkdigit: 0,
                val: '91099b3f-69be-4607-a309-bd358d85af46'
            },
            {
                label: 'OVC ID', format: '^\\d{7}$', checkdigit: 0,
                val: 'ace5f7c7-c5f4-4e77-a077-5588a682a0d6'
            }
        ];
    }

}
