
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class IndicatorResourceService {

  private reportIndicators = new ReplaySubject(1);
  constructor(private http: Http, private appSettingsService: AppSettingsService,
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

  public getUrlRequestParams(params): URLSearchParams {
    let urlParams: URLSearchParams = new URLSearchParams();

    urlParams.set('report', params.report);

    return urlParams;
  }

  public getReportIndicators(params) {
    let urlParams = this.getUrlRequestParams(params);
    let url = this.getUrl();
    let request = this.http.get(url, {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json().result;
      });

    return this.cacheService.cacheRequest(url, urlParams, request);

  }
}
