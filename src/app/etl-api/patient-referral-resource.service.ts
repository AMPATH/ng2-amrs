import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class PatientReferralResourceService {
  constructor(protected http: Http, protected appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) {
  }

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `patient-referrals`;
  }

  public getPatientListUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim()
      + `referral-patient-list`;
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
    return urlParams;
  }

  public getPatientReferralReport(params) {
    let urlParams = this.getUrlRequestParams(params);
    let url = this.getUrl();
    let request = this.http.get(url, {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json();
      });

    this.cacheService.cacheRequest(url, urlParams, request);
    return request;

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
    return this.http.get(url, {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json().result;
      });

  }
}
