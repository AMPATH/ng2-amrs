
import {map, catchError,  switchMap, combineAll } from 'rxjs/operators';
import { Injectable, Component } from '@angular/core';


import { FormsResourceService } from '../../../openmrs-api/forms-resource.service';
import { FormListService } from '../forms/form-list.service';
import { FormSchemaService } from './form-schema.service';
import * as _ from 'lodash';
import { ToastComponent } from './form-updater-toast.component';
import { Observable, from , of} from 'rxjs';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { MatSnackBar } from '@angular/material';
const LAST_UPDATED = 'formsLastUpdated';
@Injectable()
export class FormUpdaterService {

  constructor(private formsResourceService: FormsResourceService,
    private formListService: FormListService,
    private formSchemaService: FormSchemaService,
    private localStorageService: LocalStorageService,
    private toast: MatSnackBar) { }

  public setDateLastChecked(timestamp: string) {
    this.localStorageService.setItem(LAST_UPDATED, timestamp);
  }
  public getDateLastChecked() {
    return this.localStorageService.getItem(LAST_UPDATED);
  }

  public getUpdatedForms() {
    this.checkUpdatedForms().pipe(
      catchError((error) => { this.toast.dismiss(); return error; }))
      .subscribe((updatedSchemas: any[]) => {
        if (updatedSchemas.length > 0) {
          let filteredSchemas = updatedSchemas.filter((x) => x !== null);
          if (filteredSchemas.length > 0) {
            _.each(filteredSchemas, (schema) => {
              this.replaceSchemaInCache(schema);
            });
            this.showPlainToast('Forms Successfully Updated!', 3000);
          } else {
            this.showPlainToast('All forms are Up to date.', 3000);
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
    this.toast.openFromComponent(ToastComponent, { data: message });
  }

  private showPlainToast(message: string, duration?: number) {
    if (duration) {
      this.toast.open(message, '', { duration: duration });
    } else {
      this.toast.open(message);
    }

  }
}
