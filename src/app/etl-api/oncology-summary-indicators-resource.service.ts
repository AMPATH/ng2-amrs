import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class OncologySummaryIndicatorsResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getUrl(params: any): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + params.type;
  }

  public getPatientListUrl(params): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      params.type +
      '-patient-list'
    );
  }

  public getUrlRequestParams(params): HttpParams {
    let urlParams: HttpParams = new HttpParams();

    if (params.indicators && params.indicators !== '') {
      urlParams = urlParams.set('indicators', params.indicators);
    }

    if (params.endDate && params.endDate !== '') {
      urlParams = urlParams.set('endDate', params.endDate);
    }

    if (params.startDate && params.startDate !== '') {
      urlParams = urlParams.set('startDate', params.startDate);
    }

    if (params.gender && params.gender.length > 0) {
      urlParams = urlParams.set('genders', params.gender);
    }

    if (params.period && params.period.length > 0) {
      urlParams = urlParams.set('period', params.period);
    }

    if (params.startAge && params.startAge !== '') {
      urlParams = urlParams.set('startAge', params.startAge);
    }

    if (params.endAge && params.endAge !== '') {
      urlParams = urlParams.set('endAge', params.endAge);
    }

    if (params.locationUuids && params.locationUuids !== '') {
      urlParams = urlParams.set('locationUuids', params.locationUuids);
    }

    return urlParams;
  }

  public getOncologySummaryMonthlyIndicatorsReport(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getUrl(params);
    const request = this.http.get(url, {
      params: urlParams
    });

    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getOncologySummaryMonthlyIndicatorsPatientList(params) {
    const urlParams = this.getUrlRequestParams(params);
    if (!params.startIndex) {
      params.startIndex = '0';
    }
    if (!params.limit) {
      params.limit = '1000';
    }
    urlParams.set('startIndex', params.startIndex);
    urlParams.set('limit', params.limit);

    const url = this.getPatientListUrl(params);
    const request = this.http.get(url, {
      params: urlParams
    });

    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
