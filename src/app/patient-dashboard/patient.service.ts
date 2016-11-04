import { Injectable } from '@angular/core';

import { Patient } from './patients';
import { PATIENTS } from './patient.mock';

@Injectable()
export class PatientService {
    getPatients(): Promise<Patient[]> {
        return Promise.resolve(PATIENTS);
    }
}