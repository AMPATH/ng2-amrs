import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import * as _ from 'lodash';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class ClinicalSummaryVisualizationResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getUrl(reportName): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}`;
  }

  public getPatientListUrl(reportName): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      `${reportName}/patient-list`
    );
  }

  public getUrlRequestParams(params): HttpParams {
    if (!params.startIndex) {
      params.startIndex = '0';
    }
    if (!params.limit) {
      params.limit = '300';
    }
    const urlParams: HttpParams = new HttpParams()
      .set('startIndex', params.startIndex)
      .set('endDate', params.endDate)
      // .set('gender', params.gender)
      .set('startDate', params.startDate)
      // .set('groupBy', params.groupBy)
      .set('indicator', params.indicator || params.indicators)
      // .set('order', params.order)
      .set('locationUuids', params.locationUuids)
      .set('limit', params.limit);
    return urlParams;
  }

  public getHivComparativeOverviewReport(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getUrl('clinical-hiv-comparative-overview');
    const request = this.http.get(url, {
      params: urlParams
    });

    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getReportOverviewPatientList(reportName: string, params: any) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getPatientListUrl(reportName);
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(
        map((response) => {
          return response.result;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getHivComparativeOverviewPatientList(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getPatientListUrl('clinical-hiv-comparative-overview');
    const request = this.http
      .get(url, {
        params: urlParams
      })
      .pipe(
        map((response: any) => {
          return response.result;
        })
      );

    this.cacheService.cacheRequest(url, urlParams, request);
    return request;
  }

  public getArtOverviewReport(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getUrl('clinical-art-overview');
    const request = this.http.get(url, {
      params: urlParams
    });

    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getArtOverviewReportPatientList(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getPatientListUrl('clinical-art-overview');
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(
        map((response) => {
          return response.result;
        })
      );

    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getPatientCareStatusReport(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getUrl('clinical-patient-care-status-overview');
    const request = this.http.get(url, {
      params: urlParams
    });

    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getPatientCareStatusReportList(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getPatientListUrl('clinical-patient-care-status-overview');
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(
        map((response) => {
          return response.result;
        })
      );

    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
