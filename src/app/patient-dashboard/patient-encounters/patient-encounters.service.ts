import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { Encounter } from '../../models/encounter.model';
import { Subscription } from 'rxjs';


@Injectable()
export class PatientEncounterService {
  busy: Subscription;
  public encounterResults: BehaviorSubject<Encounter[]> = new BehaviorSubject<Encounter[]>([]);
  constructor(private encounterService: EncounterResourceService) { }

  getEncountersByPatientUuid(patientUuid: string,
    cached: boolean = false,
    v: string = null): Observable<Encounter[]> {
    let encounterObservable = this.encounterService.getEncountersByPatientUuid(patientUuid);

    this.busy = encounterObservable.subscribe(
      (encounters) => {
        let mappedEncounters: Encounter[] = new Array<Encounter>();

        for (let i = 0; i < encounters.length; i++) {
          mappedEncounters.push(new Encounter(encounters[i]));
        }
        this.encounterResults.next(mappedEncounters.reverse());
      },
      (error) => {
        this.encounterResults.error(error); // test case that returns error
      }
    );
    return this.encounterResults.asObservable();
  }

}

