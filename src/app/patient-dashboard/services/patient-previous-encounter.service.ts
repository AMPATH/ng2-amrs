import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PatientService } from './patient.service';
import * as _ from 'lodash';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';

@Injectable()
export class PatientPreviousEncounterService {
  constructor(
    private patientService: PatientService,
    private encounterResource: EncounterResourceService
  ) {}

  public getPreviousEncounter(encounterType: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.patientService.currentlyLoadedPatient.pipe(take(1)).subscribe(
        (patient) => {
          if (patient) {
            const search = _.find(patient.encounters, (e) => {
              return e.encounterType.uuid === encounterType;
            });

            if (search) {
              this.encounterResource
                .getEncounterByUuid(search.uuid)
                .pipe(take(1))
                .subscribe(
                  (_encounter) => {
                    resolve(_encounter);
                  },
                  (err) => {
                    reject(err);
                  }
                );
            } else {
              resolve({});
            }
          }
        },
        (error) => {
          console.error('Previous encounter error', error);
        }
      );
    });
  }
}
