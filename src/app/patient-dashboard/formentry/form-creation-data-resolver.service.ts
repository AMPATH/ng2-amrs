import { Injectable } from '@angular/core';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';

import { PatientPreviousEncounterService } from '../patient-previous-encounter.service';
import { FormSchemaService } from './form-schema.service';
import * as _ from 'lodash';
@Injectable()
export class FormCreationDataResolverService implements Resolve<any> {
  validationConflictQuestions = ['reasonNotOnFamilyPlanning'];
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
          if (compiledFormSchema) {
            this.upgradeConflictingValidations(compiledFormSchema);
            console.log('compiledFormSchema', compiledFormSchema);
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

  private upgradeConflictingValidations(schema) {
    for (let page of schema.pages) {
      for (let section of page.sections) {
        this.traverseQuestions(section.questions, schema.encounterType);
      }
    }
  }
  private isPeds(question) {
    return (question.label === 'Siblings less than 18 months:'
      || question.label ===
      'If yes for siblings < 18 months, are they registered in pediatric HIV clinic:');
  }
  private traverseQuestions(questions, encounterType) {
    for (let question of questions) {
      switch (question.type) {
        case 'obsGroup':
          this.traverseQuestions(question.questions, encounterType);
          break;
        default:
          if (encounterType && encounterType.uuid === 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7'
            && this.isPeds(question)) {
            question.required = false;
          }
          if (encounterType && encounterType.uuid !== 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7'
            && (question.label === 'Prevention with positives: At risk population:' ||
              question.label === 'Prevention with positives: PWP services:')) {
            question.required = false;
          }
          if (question.required && this.validationConflictQuestions.indexOf(question.id) > -1) {
            question.required = false;
          }
      }
    }
  }
}
