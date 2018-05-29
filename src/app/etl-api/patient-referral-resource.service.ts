import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response, URLSearchParams } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class PatientReferralResourceService {
  public cache;
  private requestUrl = '';

  constructor(protected http: Http, protected appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) {
  }

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient-referrals';
  }

  public getPatientListUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim()
      + 'referral-patient-list';
  }
  public getReferralLocationUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient-referral-details';
  }

  public getReferralNotificationUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient-referral';
  }

  public getUrlRequestParams(params): URLSearchParams {
    let urlParams: URLSearchParams = new URLSearchParams();

    urlParams.set('endDate', params.endDate);
    if (params.gender  && params.gender !== 'undefined') {
        urlParams.set('gender', params.gender);
    }
    urlParams.set('startDate', params.startDate);
    if (params.locationUuids  && params.locationUuids !== 'undefined') {
        urlParams.set('locationUuids', params.locationUuids);
    }
    if (params.startAge  && params.startAge !== 'undefined') {
    urlParams.set('startAge', params.startAge);
    }
    if (params.endAge  && params.endAge !== 'undefined') {
    urlParams.set('endAge', params.endAge);
    }
    if (params.programUuids  && params.programUuids !== 'undefined') {
    urlParams.set('programUuids', params.programUuids);
    }
    if (params.stateUuids && params.stateUuids !== 'undefined') {
    urlParams.set('stateUuids', params.stateUuids);
    }
    if (params.providerUuids  && params.providerUuids !== 'undefined') {
      urlParams.set('providerUuids', params.providerUuids);
    }
    if (params.notificationStatus  && params.notificationStatus !== 'undefined') {
      urlParams.set('notificationStatus', params.notificationStatus);
    }
    return urlParams;
  }

  public updateReferralNotificationStatus(payload) {
    if (!payload || (payload && !payload.patient_referral_id)) {
      return null;
    }
    let url = this.getReferralNotificationUrl() + '/' + payload.patient_referral_id;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers});
    return this.http.post(url, JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json();
      }).catch(this.handleError);
  }

  public getPatientReferralReport(params) {
    let urlParams = this.getUrlRequestParams(params);
    let url: string = this.getUrl();
    let request = this.http.get(url, {
      search: urlParams
    }).map((response: Response) => {
        return response.json();
      });

    let key = url + '?' + urlParams.toString();
    if (key !== this.requestUrl) {
      // clear cache after 1 minute
      let refreshCacheTime = 1 * 60 * 1000;
      this.requestUrl = key;
      this.cache = this.cacheService.cacheSingleRequest(url, urlParams, request, refreshCacheTime);
    }

    // this.cacheService.cacheRequest(url, urlParams, request);
    return this.cache;

  }

  public getPatientReferralPatientList(params) {
    let urlParams = this.getUrlRequestParams(params);
    if (!params.startIndex) {
      params.startIndex = '0';
    }
    if (!params.limit) {
      params.limit = '300';
    }
    urlParams.set('limit', params.limit);
    let url = this.getPatientListUrl();
    let request = this.http.get(url, {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json().result;
      });

    let key = url + '?' + urlParams.toString();
    if (key !== this.requestUrl) {
      // clear cache after 1 minute
      let refreshCacheTime = 1 * 60 * 1000;
      this.requestUrl = key;
      this.cache = this.cacheService.cacheSingleRequest(url, urlParams, request, refreshCacheTime);
    }

    // this.cacheService.cacheRequest(url, urlParams, request);
    return this.cache;

    /*this.cacheService.cacheRequest(url, urlParams, request);
    return request;*/
  }

  public getReferralLocationByEnrollmentUuid(uuid: string) {
    let url = this.getReferralLocationUrl()  + '/' + uuid;
    return this.http.get(url).map((response: Response) => {
        return response.json();
    });
  }

  private handleError(error: any) {
    return Observable.throw(error.message
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : 'Server Error');
  }
}
