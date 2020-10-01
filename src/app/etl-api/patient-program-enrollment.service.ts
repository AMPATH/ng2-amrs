import { Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable()
export class PatientProgramEnrollmentService {
  constructor(
    private _http: HttpClient,
    private _appSettingsService: AppSettingsService,
    private _cacheService: DataCacheService
  ) {}

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
    let urlParams: HttpParams = new HttpParams().set(
      'endDate',
      payload.endDate
    );
    if (payload.locationUuids) {
      if (payload.locationUuids.length > 0) {
        urlParams = urlParams.set('locationUuids', payload.locationUuids);
      }
    }
    if (payload.programType) {
      if (payload.programType.length > 0) {
        urlParams = urlParams.set('programType', payload.programType);
      }
    }
    const url = this.getBaseUrl() + 'patient-program-enrollments';
    const request = this._http.get(url, {
      params: urlParams
    });
    return this._cacheService.cacheRequest(url, urlParams, request);
  }

  public getActivePatientEnrollmentPatientList(payload: any): Observable<any> {
    if (!payload) {
      return null;
    }

    let urlParams: HttpParams = new HttpParams().set(
      'endDate',
      payload.endDate
    );
    if (payload.locationUuids) {
      if (payload.locationUuids.length > 0) {
        urlParams = urlParams.set('locationUuids', payload.locationUuids);
      }
    }
    if (payload.programType) {
      if (payload.programType.length > 0) {
        urlParams = urlParams.set('programType', payload.programType);
      }
    }
    const url = this.getBaseUrl() + 'program-enrollment/patient-list';
    const request = this._http.get(url, {
      params: urlParams
    });
    return this._cacheService.cacheRequest(url, urlParams, request);
  }
}
