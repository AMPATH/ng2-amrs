import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class PatientRelationshipTypeResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return (
      this.appSettingsService.getOpenmrsRestbaseurl().trim() +
      'relationshiptype'
    );
  }

  public getPatientRelationshipTypes(): Observable<any> {
    const url = this.getUrl();
    const v = 'full';
    const params: HttpParams = new HttpParams().set('v', v);
    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.results;
        })
      );
  }
}
