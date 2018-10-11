import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
    PatientRelationshipTypeResourceService
} from '../../../openmrs-api/patient-relationship-type-resource.service';

@Injectable()
export class PatientRelationshipTypeService {
    public relationshipsTypeSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private patientRelationshipTypeResourceService:
                PatientRelationshipTypeResourceService) {
    }

    public getRelationshipTypes(): Observable<any> {
        this.patientRelationshipTypeResourceService.getPatientRelationshipTypes().take(1).subscribe(
            (relatinshipTypes) => {
                if (relatinshipTypes) {
                    this.relationshipsTypeSubject.next(relatinshipTypes);
                }
            }
        );
        return this.relationshipsTypeSubject.asObservable();
    }
}
