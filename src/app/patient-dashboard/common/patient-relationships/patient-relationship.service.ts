
import { take, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import { Relationship } from '../../../models/relationship.model';
import {
  PatientRelationshipResourceService
} from '../../../openmrs-api/patient-relationship-resource.service';
import * as _ from 'lodash';

@Injectable()
export class PatientRelationshipService {
  public patientToBindRelationship: Patient;

  constructor(private patientRelationshipResourceService: PatientRelationshipResourceService) {
  }

  public getRelationships(uuid) {
    const relationshipsArr = [];
    return this.patientRelationshipResourceService.getPatientRelationships(uuid).pipe(
      map((relationships) => {
        if (relationships) {
          for (const relationship of relationships) {
            if (uuid === relationship.personA.uuid) {
              const relation = {
                uuid: relationship.uuid,
                display: relationship.personB.display,
                relative: relationship.personB.display,
                relatedPersonUuid: relationship.personB.uuid,
                relationshipType: relationship.relationshipType.bIsToA,
                relationshipTypeUuId: relationship.relationshipType.uuid,
                relationshipTypeName: relationship.relationshipType.display,
                relatedPerson: relationship.personB
              };
              relationshipsArr.push(new Relationship(relation));
            } else {
              const relation = {
                uuid: relationship.uuid,
                display: relationship.personA.display,
                relative: relationship.personA.display,
                relatedPersonUuid: relationship.personA.uuid,
                relationshipType: relationship.relationshipType.aIsToB,
                relatedPerson: relationship.personA,
                relationshipTypeUuId: relationship.relationshipType.uuid,
                relationshipTypeName: relationship.relationshipType.display
              };
              relationshipsArr.push(new Relationship(relation));
            }
          }
          const orderedRelationshipsArr = this.addOrderProperty(relationshipsArr);
          orderedRelationshipsArr.sort(this.sortRelationships);
          return orderedRelationshipsArr;
        }
      }));
  }

  public addOrderProperty(relationships): any {
    const relationshipMap = new Map();
    relationshipMap.set('Parent', 1);
    relationshipMap.set('Spouse', 2);
    relationshipMap.set('Guardian', 3);
    relationshipMap.set('Caretaker', 4);
    relationshipMap.set('Child', 5);
    relationshipMap.set('Sibling', 6);
    relationshipMap.set('Cousin', 7);
    relationshipMap.set('Grandparent', 8);
    relationshipMap.set('Grandchild', 9);
    relationshipMap.set('Aunt/Uncle', 10);
    relationshipMap.set('Niece/Nephew', 11);
    relationshipMap.set('Foster Child', 12);
    relationshipMap.set('Doctor', 13);
    relationshipMap.set('Sexual Partner', 14);
    relationshipMap.set('Household Member', 15);
    relationshipMap.set('Patient', 16);
    relationshipMap.set('Child-in-law', 17);
    relationshipMap.set('Parent-in-law', 18);
    relationshipMap.set('Child-in-law', 19);
    relationshipMap.set('Co-wife', 20);
    relationshipMap.set('Stepchild', 21);
    relationshipMap.set('Stepparent', 22);
    relationshipMap.set('Foster Parent', 23);
    relationshipMap.set('Friend', 24);
    relationshipMap.set('Employee', 25);
    relationshipMap.set('Employer', 26);
    relationshipMap.set('Tenant/Renter', 27);
    relationshipMap.set('Landlord', 28);
    relationshipMap.set('Head of Household', 29);
    relationshipMap.set('Nurse', 30);
    relationshipMap.set('Other non-coded', 31);
    _.each(relationships, (relationship: any) => {
      relationship.order = relationshipMap.get(relationship.relationshipType);
    });
    return relationships;
  }

  public sortRelationships(a, b) {
    if (a.order < b.order) {
      return -1;
    } else if (a.order > b.order) {
      return 1;
    } else {
      return 0;
    }
  }

  public saveRelationship(payload: any): Observable<any> {
    if (!payload) {
      return null;
    }
    return this.patientRelationshipResourceService.saveRelationship(payload);
  }

  public updateRelationship(uuid: string, payload: any): Observable<any> {
    if (!payload || !uuid) {
      return null;
    }
    return this.patientRelationshipResourceService.updateRelationship(uuid, payload);
  }

  public voidRelationship(uuid: string) {
    if (!uuid) {
      return null;
    }
    return this.patientRelationshipResourceService.deleteRelationship(uuid);
  }
}
