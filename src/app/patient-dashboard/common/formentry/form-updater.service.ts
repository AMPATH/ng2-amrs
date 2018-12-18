
import {map, catchError,  switchMap, combineAll } from 'rxjs/operators';
import { Injectable, Component } from '@angular/core';
import { FormsResourceService } from '../../../openmrs-api/forms-resource.service';
import { FormListService } from '../forms/form-list.service';
import { FormSchemaService } from './form-schema.service';
import * as _ from 'lodash';
import { Observable, from , of} from 'rxjs';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { ToastrService } from 'ngx-toastr';
const LAST_UPDATED = 'formsLastUpdated';
@Injectable()
export class FormUpdaterService {

  constructor(private formsResourceService: FormsResourceService,
    private formListService: FormListService,
    private formSchemaService: FormSchemaService,
    private localStorageService: LocalStorageService,
    private toast: ToastrService) { }

  public setDateLastChecked(timestamp: string) {
    this.localStorageService.setItem(LAST_UPDATED, timestamp);
  }
  public getDateLastChecked() {
    return this.localStorageService.getItem(LAST_UPDATED);
  }

  public getUpdatedForms() {
    this.checkUpdatedForms().pipe(
      catchError((error) => { this.toast.clear(); return error; }))
      .subscribe((updatedSchemas: any[]) => {
        if (updatedSchemas.length > 0) {
          let filteredSchemas = updatedSchemas.filter((x) => x !== null);
          this.toast.clear();
          if (filteredSchemas.length > 0) {
            _.each(filteredSchemas, (schema) => {
              this.replaceSchemaInCache(schema);
            });
            this.showPlainToast('Forms Successfully Updated!', 3000);
          } else {
            this.showPlainToast('All forms are up to date.', 3000);
          }
          this.setDateLastChecked(new Date().toDateString());
        } else {
          this.showPlainToast('No forms in cache to update.', 2000);
        }
      });

  }

  private doesUpdatedSchemaExist(uuid, cachedSchema): Observable<any> {
    let cache = _.cloneDeep(cachedSchema);
    return this.formSchemaService.getFormSchemaByUuid(uuid, false).pipe(map((schema) => {
      if (!_.isEqual(schema.pages, cachedSchema.pages)) {
        return schema;
      } else {
        return null;
      }
    }));
  }

  private checkUpdatedForms() {
    let arrayOfObservables = [];
    return this.formsResourceService.getForms().pipe(
      switchMap((forms: any[]) => {
        _.forEach(forms, (form, index) => {
          let cachedSchema = this.localStorageService.getObject(form.uuid);
          if (cachedSchema) {
            arrayOfObservables
              .push(this.doesUpdatedSchemaExist(form.uuid, cachedSchema));
          }
        });
        if (arrayOfObservables.length > 0) {
          this.showToastWithSpinner('Checking for updated forms');
          return from(arrayOfObservables).pipe(combineAll());
        } else {
          return of([]);
        }

      }));
  }

  private replaceSchemaInCache(schema) {
    let temp = this.localStorageService.getObject(schema.uuid);
    temp.referencedForms = schema.referencedForms;
    temp.pages = schema.pages;
    this.localStorageService.setObject(schema.uuid, temp);
  }

  private showToastWithSpinner(message) {
    this.toast.info(message, '', {progressBar: true,
                                  progressAnimation: 'increasing',
                                  easeTime: 150,
                                  timeOut: 45000,
                                  positionClass: 'toast-bottom-center'});
  }

  private showPlainToast(message: string, duration?: number) {
    if (duration) {
      this.toast.success(message, '', { timeOut: duration, positionClass: 'toast-bottom-center'});
    } else {
      this.toast.success(message, '', { positionClass: 'toast-bottom-center'});
    }

  }
}
