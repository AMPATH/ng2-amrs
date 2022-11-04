import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { Encounter } from '../../../models/encounter.model';

@Injectable()
export class PatientEncounterService {
  public busy: Subscription;

  constructor(private encounterService: EncounterResourceService) {}

  public getEncountersByPatientUuid(
    patientUuid: string,
    cached: boolean = false,
    v: string = null
  ): Observable<Encounter[]> {
    const encounterResults: BehaviorSubject<Encounter[]> = new BehaviorSubject<
      Encounter[]
    >([]);
    const encounterObservable =
      this.encounterService.getEncountersByPatientUuid(patientUuid);

    this.busy = encounterObservable.pipe(take(1)).subscribe(
      (encounters) => {
        const mappedEncounters: Encounter[] = new Array<Encounter>();
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < encounters.length; i++) {
          mappedEncounters.push(new Encounter(encounters[i]));
        }
        encounterResults.next(mappedEncounters.reverse());
      },
      (error) => {
        encounterResults.error(error); // test case that returns error
      }
    );
    return encounterResults.asObservable();
  }
}
