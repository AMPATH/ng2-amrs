import { Injectable } from '@angular/core';

import { PatientService } from './patient.service';
import  *  as _  from 'lodash';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';

@Injectable()
export class PatientPreviousEncounterService {

  constructor(private patientService: PatientService,
              private encounterResource: EncounterResourceService) {
  }

  public getPreviousEncounter(encounterType: string): Promise<any> {

    return new Promise((resolve, reject) => {

      this.patientService.currentlyLoadedPatient.subscribe(
        (patient) => {
          if (patient) {
            let search = _.find(patient.encounters, (e) => {
              return e.encounterType.uuid === encounterType;
            });

            if (search) {
              this.encounterResource.getEncounterByUuid(search.uuid).subscribe((_encounter) => {
                resolve(_encounter);
              }, (err) => {
                reject(err);
              });
            } else {
              resolve({});
            }
          }
        });

    });
  }
}
