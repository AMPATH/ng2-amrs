import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../patient.service';
import { Relationship } from '../../models/relationship.model';
import {
    PatientRelationshipTypeResourceService
} from '../../openmrs-api/patient-relationship-type-resource.service';


@Injectable()
export class PatientRelationshipTypeService {
    public relationshipsTypeSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private patientService: PatientService,
        private patientRelationshipTypeResourceService: PatientRelationshipTypeResourceService) {
    }

    public getRelationshipTypes(): Observable<any> {
        this.patientRelationshipTypeResourceService.getPatientRelationshipTypes().subscribe(
            (relatinshipTypes) => {
                if (relatinshipTypes) {
                    this.relationshipsTypeSubject.next(relatinshipTypes);
                }
            }
        );
        return this.relationshipsTypeSubject.asObservable();
    }
}
