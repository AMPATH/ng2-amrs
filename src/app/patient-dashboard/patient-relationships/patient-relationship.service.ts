import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../patient.service';
import { Relationship } from '../../models/relationship.model';
import {
  PatientRelationshipResourceService
 } from '../../openmrs-api/patient-relationship-resource.service';

@Injectable()
export class PatientRelationshipService {
  public relationshipsSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private patientService: PatientService,
    private patientRelationshipResourceService: PatientRelationshipResourceService) {
  }

  public getRelationships(uuid) {
    let relationshipsArr = [];
    this.patientRelationshipResourceService.getPatientRelationships(uuid).subscribe(
      (relationships) => {
        if (relationships) {
          for (let i = 0; i < relationships.length; i++) {
            if (uuid === relationships[i].personA.uuid) {
              let relation = {
                uuid: uuid,
                display: relationships[i].personB.display,
                relative: relationships[i].personB.display,
                relatedPersonUuid: relationships[i].personB.uuid,
                relationshipType: relationships[i].relationshipType.bIsToA,
                relationshipTypeUuId: relationships[i].relationshipType.uuid,
                relationshipTypeName: relationships[i].relationshipType.display
              };
              relationshipsArr.push(new Relationship(relation));
            } else {
              let relation = {
                uuid: uuid,
                display: relationships[i].personA.display,
                relative: relationships[i].personA.display,
                relatedPersonUuid: relationships[i].personA.uuid,
                relationshipType: relationships[i].relationshipType.aIsToB,
                relationshipTypeUuId: relationships[i].relationshipType.uuid,
                relationshipTypeName: relationships[i].relationshipType.display
              };
              relationshipsArr.push(new Relationship(relation));
            }
          }
          this.relationshipsSubject.next(relationshipsArr);
        }
      },  (error) => {
        this.relationshipsSubject.error(error);
        console.error(error);
      });
    return this.relationshipsSubject.asObservable();
  }
}
