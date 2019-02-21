
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class IndicatorResourceService {

  private reportIndicators = new ReplaySubject(1);
  constructor(private http: HttpClient, private appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) {
  }
  /**
   * @param {*} param
   * @param {boolean} [forceRefresh]
   * @returns
   *
   * @memberOf IndicatorResourceService
   */

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `indicators-schema`;
  }

  public getUrlRequestParams(params): HttpParams {
    const urlParams: HttpParams = new HttpParams()
    .set('report', params.report);
    return urlParams;
  }

  public getReportIndicators(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getUrl();
    const request = this.http.get<any>(url, {
      params: urlParams
    }).pipe(
      map((response) => {
        return response.result;
      }));

    return this.cacheService.cacheRequest(url, urlParams, request);

  }
}
