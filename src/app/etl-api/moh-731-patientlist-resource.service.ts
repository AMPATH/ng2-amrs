import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';
@Injectable()
export class Moh731PatientListResourceService {
  constructor(private http: Http,
              private appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) { }

  public getPatientListUrl(reportName): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}/patient-list`;
  }

  public getUrlRequestParams(params): URLSearchParams {
    let urlParams: URLSearchParams = new URLSearchParams();
    if (!params.startIndex) {
      params.startIndex = '0';
    }
    if (!params.limit) {
      params.limit = '300';
    }
    urlParams.set('startIndex', params.startIndex);
    urlParams.set('endDate', params.endDate);
    urlParams.set('startDate', params.startDate);
    urlParams.set('reportName', (params.isLegacy ? params.reportName : 'MOH-731-report-2017'));
    urlParams.set('indicator', params.indicator);
    urlParams.set('locationUuids', params.locationUuids);
    urlParams.set('limit', params.limit);
    return urlParams;
  }

  public getMoh731PatientListReport(params) {
    let urlParams = this.getUrlRequestParams(params);
    let url = this.getPatientListUrl('MOH-731-report');
    let request = this.http.get(url, {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json();
      });
    return request;
  }

}
