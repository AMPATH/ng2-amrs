import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { Encounter } from '../../models/encounter.model';
import { Response } from '@angular/http';


@Injectable()
export class PatientEncounterService {
  subject: BehaviorSubject<Encounter[]>;
  constructor(private encounterService: EncounterResourceService) { }
  getEncountersByPatientUuid(
    patientUuid: string,
    cached: boolean = false,
    v: string = null): Observable<Encounter[]> {

    this.subject = new BehaviorSubject<Encounter[]>([]);
    let encounterObservable = this.encounterService
      .getEncountersByPatientUuid(patientUuid);
    return encounterObservable.map((encounters: any) => {
      let mappedEncounters: Encounter[] = new Array<Encounter>();

      for (let i = 0; i < encounters.length; i++) {
        mappedEncounters.push(new Encounter(encounters[i]));
      }
      return mappedEncounters;
    });
  }

}

