
import {map} from 'rxjs/operators';
import { Observable ,  ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class PatientProgramEnrollmentService {

  constructor(
     private _http: Http,
     private _appSettingsService: AppSettingsService,
     private _cacheService: DataCacheService) {
  }

  /*
   This service fetches patient enrollments based on
   location, date and program
  */
  public getBaseUrl(): string {
    return this._appSettingsService.getEtlRestbaseurl().trim();
  }

  public getActivePatientEnrollmentSummary(payload: any): Observable<any> {

    if (!payload) {
         return null;
    }
    let urlParams: URLSearchParams = new URLSearchParams();

    urlParams.set('endDate', payload.endDate);
    urlParams.set('startDate', payload.startDate);
    if (payload.locationUuids) {
        if (payload.locationUuids.length > 0) {
             urlParams.set('locationUuids', payload.locationUuids);
        }
    }
    if (payload.programType) {
        if (payload.programType.length > 0 ) {
            urlParams.set('programType', payload.programType);
        }
    }
    let url = this.getBaseUrl() + 'patient-program-enrollments';
    let request = this._http.get(url, {
        search: urlParams
    }).pipe(
        map((response: Response) => {
            return response.json();
        }));
    return this._cacheService.cacheRequest(url, urlParams, request);

  }

  public getActivePatientEnrollmentPatientList(payload: any): Observable<any> {

    if (!payload) {
         return null;
    }

    let urlParams: URLSearchParams = new URLSearchParams();

    urlParams.set('endDate', payload.endDate);
    urlParams.set('startDate', payload.startDate);
    if (payload.locationUuids) {
        if (payload.locationUuids.length > 0) {
             urlParams.set('locationUuids', payload.locationUuids);
        }
    }
    if (payload.programType) {
        if (payload.programType.length > 0 ) {
            urlParams.set('programType', payload.programType);
        }
    }
    let url = this.getBaseUrl() + 'program-enrollment/patient-list';
    let request = this._http.get(url, {
        search: urlParams
    }).pipe(
        map((response: Response) => {
            return response.json();
        }));
    return this._cacheService.cacheRequest(url, urlParams, request);

  }
}
