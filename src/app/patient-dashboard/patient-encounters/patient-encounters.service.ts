import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { EncounterResourceService } from "../../amrs-api/encounter-resource.service";
import { Encounter } from "../../models/encounter.model";


@Injectable()
export class PatientEncounterService {
  // Resolve HTTP using the constructor
  constructor(private encounterService: EncounterResourceService) { }
  getEncountersByUuid(uuid: string,cached: boolean=false,v: string = null): Observable<Encounter[]> {
    let subject: BehaviorSubject<Encounter[]> = new BehaviorSubject<Encounter[]>([]);
    let encounterObservable = this.encounterService.getEncountersByUuid('patientUuid');
    encounterObservable.subscribe(
      (encounters) => {
        let mappedEncounters: Encounter[] = new Array<Encounter>();

        for (let i = 0; i < encounters.length; i++) {
          mappedEncounters.push(new Encounter(encounters[i]));
        }

        subject.next(mappedEncounters);
      },
      (error) => {
        subject.error(error); //TODO: test case that returns error
      }
    );

    return subject.asObservable();
  }

}

