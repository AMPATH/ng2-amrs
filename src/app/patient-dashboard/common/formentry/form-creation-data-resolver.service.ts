import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';

import * as _ from 'lodash';

import { DraftedFormsService } from './drafted-forms.service';
import { PatientPreviousEncounterService } from '../../services/patient-previous-encounter.service';
import { FormSchemaService } from './form-schema.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';

@Injectable()
export class FormCreationDataResolverService implements Resolve<any> {
  public validationConflictQuestions = ['reasonNotOnFamilyPlanning'];
  constructor(
    private patientPreviousEncounterService: PatientPreviousEncounterService,
    private router: ActivatedRoute,
    private formSchemaService: FormSchemaService,
    private visitResourceService: VisitResourceService,
    private hivSummaryResService: HivSummaryResourceService,
    private draftedForm: DraftedFormsService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> | any {

    let selectedFormUuid = route.params['formUuid'];
    let selectedEncounter = route.queryParams['encounter'];
    let selectedVisitUuid = route.queryParams['visitUuid'];
    let patientUuid = route.parent.params['patient_uuid'];
    return new Promise((resolve, reject) => {
      this.formSchemaService.getFormSchemaByUuid(selectedFormUuid).subscribe(
        (compiledFormSchema) => {
          if (compiledFormSchema) {
            this.upgradeConflictingValidations(compiledFormSchema);
            console.log('compiledFormSchema', compiledFormSchema);

            let dataRequiredToLoadForm = {
              encounter: undefined,
              schema: compiledFormSchema,
              visit: undefined,
              hivSummary: undefined
            };

            this.getHivSummary(patientUuid)
            .then((summaries) => {
              dataRequiredToLoadForm.hivSummary = summaries;
              this.processDataResolvingStep(dataRequiredToLoadForm, resolve);

            })
            .catch((error) => {
              dataRequiredToLoadForm.hivSummary = error;
              this.processDataResolvingStep(dataRequiredToLoadForm, resolve);
            });

            this.getPreviousEncounter(selectedEncounter, compiledFormSchema)
              .then((encounter) => {
                dataRequiredToLoadForm.encounter = encounter;
                this.processDataResolvingStep(dataRequiredToLoadForm, resolve);
              })
              .catch((error) => {
                dataRequiredToLoadForm.encounter = {};
                this.processDataResolvingStep(dataRequiredToLoadForm, resolve);
              });

            this.getVisitWithEncounters(selectedVisitUuid)
              .then((visit) => {
                dataRequiredToLoadForm.visit = visit;
                this.processDataResolvingStep(dataRequiredToLoadForm, resolve);
              })
              .catch((error) => {
                dataRequiredToLoadForm.visit = error;
                this.processDataResolvingStep(dataRequiredToLoadForm, resolve);
              });
          }
        },
        (err) => {
          console.error(err);
          reject(err);
        });

    });

  }

  private processDataResolvingStep(dataRequiredToLoadForm: any, finalAcceptFunc) {
    if (dataRequiredToLoadForm.encounter &&
      dataRequiredToLoadForm.visit &&
      dataRequiredToLoadForm.hivSummary) {
      console.log('Data required to load forms', dataRequiredToLoadForm);
      finalAcceptFunc(dataRequiredToLoadForm);
    }
  }

  private getPreviousEncounter(selectedEncounter: string, compiledFormSchema: any, ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (selectedEncounter) {
        console.log('no encounter for this form');
        resolve({});
      } else {
        if ((this.draftedForm.lastDraftedForm === null ||
          this.draftedForm.lastDraftedForm === undefined) &&
          compiledFormSchema.encounterType && compiledFormSchema.encounterType.uuid) {
          this.patientPreviousEncounterService.
            getPreviousEncounter(compiledFormSchema.encounterType.uuid).then((encounter) => {
              resolve(encounter);
            });
        } else {
          resolve({});
        }
      }
    });
  }

  private getVisitWithEncounters(visitUuid): Promise<any> {
    return new Promise((resolve, reject) => {
      if (visitUuid) {
        let v = 'custom:(encounters:(obs,uuid,patient:(uuid,uuid),' +
          'encounterDatetime,form:(uuid,name),encounterType:(uuid,name),' +
          'encounterProviders:(uuid,uuid,provider:(uuid,name),' +
          'encounterRole:(uuid,name)),location:(uuid,name),' +
          'visit:(uuid,visitType:(uuid,name))),uuid,display)';
        this.visitResourceService.getVisitByUuid(visitUuid, { v: v })
          .subscribe((visit) => {
            resolve(visit);
          }, (error) => {
            reject(error);
          });
      } else {
        resolve({});
      }
    });
  }

  private getHivSummary(patientUuid): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      if (patientUuid) {
        this.hivSummaryResService.getHivSummary(patientUuid, 0, 5, true)
          .subscribe(
          (results) => {
            resolve(results);
          },
          (error) => {
            reject(error);
          }
          );

      } else {
        reject('Patient uuid required');
      }
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
