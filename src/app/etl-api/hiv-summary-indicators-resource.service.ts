import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class HivSummaryIndicatorsResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      `hiv-summary-indicators`
    );
  }

  public getPatientListUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      `hiv-summary-indicators/patient-list`
    );
  }

  public getUrlRequestParams(params): HttpParams {
    let urlParams: HttpParams = new HttpParams()
      .set('endDate', params.endDate)
      .set('gender', params.gender)
      .set('startDate', params.startDate)
      .set('locationUuids', params.locationUuids)
      .set('startAge', params.startAge)
      .set('endAge', params.endAge);
    if (params.indicators) {
      urlParams = urlParams.set('indicators', params.indicators);
    }

    if (params.indicator) {
      urlParams = urlParams.set('indicator', params.indicator);
    }

    return urlParams;
  }

  public getHivSummaryIndicatorsReport(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getUrl();
    const request = this.http.get(url, {
      params: urlParams
    });

    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getHivSummaryIndicatorsPatientList(params) {
    let urlParams = this.getUrlRequestParams(params);
    if (!params.startIndex) {
      params.startIndex = '0';
    }
    if (!params.limit) {
      params.limit = '300';
    }
    urlParams = urlParams.set('startIndex', params.startIndex);
    urlParams = urlParams.set('limit', params.limit);
    const url = this.getPatientListUrl();
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(
        map((response) => {
          return response.result;
        })
      );

    this.cacheService.cacheRequest(url, urlParams, request);
    return request;
  }
}
