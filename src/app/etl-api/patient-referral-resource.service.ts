import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { throwError as observableThrowError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class PatientReferralResourceService {
  public cache;
  private requestUrl = '';

  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) {
  }

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient-referrals';
  }

  public getPatientListUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient-referrals-peer-navigator';
  }
  public getReferralLocationUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient-referral-details';
  }

  public getReferralNotificationUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient-referral';
  }

  public getUrlRequestParams(params): HttpParams {
    let urlParams: HttpParams = new HttpParams()
    .set('endDate', params.endDate)
    .set('startDate', params.startDate);

    if (params.gender  && params.gender !== 'undefined') {
      urlParams = urlParams.set('gender', params.gender);
    }
    if (params.locationUuids  && params.locationUuids !== 'undefined') {
      urlParams = urlParams.set('locationUuids', params.locationUuids);
    }
    if (params.startAge  && params.startAge !== 'undefined') {
      urlParams = urlParams.set('startAge', params.startAge);
    }
    if (params.endAge  && params.endAge !== 'undefined') {
      urlParams = urlParams.set('endAge', params.endAge);
    }
    if (params.programUuids  && params.programUuids !== 'undefined') {
      urlParams = urlParams.set('programUuids', params.programUuids);
    }
    if (params.stateUuids && params.stateUuids !== 'undefined') {
      urlParams = urlParams.set('stateUuids', params.stateUuids);
    }
    if (params.providerUuids  && params.providerUuids !== 'undefined') {
      urlParams = urlParams.set('providerUuids', params.providerUuids);
    }
    if (params.notificationStatus  && params.notificationStatus !== 'undefined') {
      urlParams = urlParams.set('notificationStatus', params.notificationStatus);
    }
    // if (params.department && params.department !== 'undefined') {
    //   urlParams = urlParams.set('department', params.department);
    // }
    return urlParams;
  }

  public updateReferralNotificationStatus(payload) {
    if (!payload || (payload && !payload.patient_referral_id)) {
      return null;
    }
    const url = this.getReferralNotificationUrl() + '/' + payload.patient_referral_id;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(url, JSON.stringify(payload), {headers}).pipe(
     catchError(this.handleError));
  }

  public getPatientReferralReport(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url: string = this.getUrl();
    const request = this.http.get(url, { params: urlParams }).pipe(
      map((response: Response) => {
        // console.log('res: ', response);
        return response;
      }),
      catchError(this.handleError)
    );

    const key = url + '?' + urlParams.toString();
    if (key !== this.requestUrl) {
      // clear cache after 1 minute
      const refreshCacheTime = 1 * 60 * 1000;
      this.requestUrl = key;
      this.cache = this.cacheService.cacheSingleRequest(url, urlParams, request, refreshCacheTime);
    }

    // this.cacheService.cacheRequest(url, urlParams, request);
    return this.cache;
  }

  public getPatientReferralPatientList(params) {
    const urlParams = this.getUrlRequestParams(params);
    if (!params.startIndex) {
      params.startIndex = '0';
    }
    if (!params.limit) {
      params.limit = '300';
    }
    urlParams.set('limit', params.limit);
    const url = this.getPatientListUrl();
    const request = this.http.get(url, {
      params: urlParams
    }).pipe(
      map((response: any) => {
        return response.result;
      }));

    const key = url + '?' + urlParams.toString();
    if (key !== this.requestUrl) {
      // clear cache after 1 minute
      const refreshCacheTime = 1 * 60 * 1000;
      this.requestUrl = key;
      this.cache = this.cacheService.cacheSingleRequest(url, urlParams, request, refreshCacheTime);
    }

    // this.cacheService.cacheRequest(url, urlParams, request);
    return this.cache;

    /*this.cacheService.cacheRequest(url, urlParams, request);
    return request;*/
  }

  public getReferralByLocationUuid(locationUuid: string, enrollmentUuid?: string) {
    const url = this.getReferralLocationUrl()  + '/' + locationUuid + '/' + enrollmentUuid;
    return this.http.get(url);
  }

  private handleError(error: any) {
    return observableThrowError(error.message
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : 'Server Error');
  }
}
