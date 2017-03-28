import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../patient.service';
import { Relationship } from '../../models/relationship.model';
import {
  PatientRelationshipResourceService
} from '../../openmrs-api/patient-relationship-resource.service';
import * as _ from 'lodash';

@Injectable()
export class PatientRelationshipService {
  public relationshipsSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public patientToBindRelationship: Patient;

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
                uuid: relationships[i].uuid,
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
                uuid: relationships[i].uuid,
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
          let orderedRelationshipsArr = this.addOrderProperty(relationshipsArr);
          orderedRelationshipsArr.sort(this.sortRelationships);
          this.relationshipsSubject.next(orderedRelationshipsArr);
        }
      }, (error) => {
        this.relationshipsSubject.error(error);
        console.error(error);
      });
    return this.relationshipsSubject.asObservable();
  }

  public addOrderProperty(relationships): any {
    let relationshipMap = new Map();
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
    _.each(relationships, (relationship) => {
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
