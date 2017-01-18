import { Injectable } from '@angular/core';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';

import { PatientPreviousEncounterService } from '../patient-previous-encounter.service';
import { FormSchemaService } from './form-schema.service';

@Injectable()
export class FormCreationDataResolverService implements Resolve<any> {
  constructor(private patientPreviousEncounterService: PatientPreviousEncounterService,
    private router: ActivatedRoute,
    private formSchemaService: FormSchemaService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> | any {

    let selectedFormUuid = route.params['formUuid'];
    let selectedEncounter = route.queryParams['encounter'];
    return new Promise((resolve, reject) => {

      this.formSchemaService.getFormSchemaByUuid(selectedFormUuid).subscribe(
        (compiledFormSchema) => {
          console.log('compiledFormSchema', compiledFormSchema);
          if (compiledFormSchema) {
            if (selectedEncounter) {
              console.log('no encounter for this form');
              resolve({ encounter: {}, schema: compiledFormSchema });
            } else {
              if (compiledFormSchema.encounterType && compiledFormSchema.encounterType.uuid) {
                this.patientPreviousEncounterService.
                  getPreviousEncounter(compiledFormSchema.encounterType.uuid).then((encounter) => {
                    resolve({ encounter: encounter, schema: compiledFormSchema });
                  });
              } else {
                resolve({ encounter: {}, schema: compiledFormSchema });
              }
            }
          }
        },
        (err) => {
          console.log(err);
          reject(err);
        });

    });

  }
}
