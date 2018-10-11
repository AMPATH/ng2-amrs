
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable()
export class Moh731ResourceService {

  private _url = 'MOH-731-report';
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + this._url;
  }

  constructor(public http: HttpClient,
              public appSettingsService: AppSettingsService,
              public cacheService: DataCacheService) {
  }

  public getMoh731Report(locationUuids: string, startDate: string, endDate: string,
                         isLegacyReport: boolean,
                         isAggregated: boolean, cacheTtl: number = 0): Observable<any> {

    let urlParams: HttpParams = new HttpParams()
    .set('locationUuids', locationUuids)
    .set('startDate', startDate)
    .set('endDate', endDate);

    if (isLegacyReport) {
      urlParams.set('reportName', 'MOH-731-report');
    } else {
      urlParams.set('reportName', 'MOH-731-report-2017');
    }
    urlParams.set('isAggregated', isAggregated ? 'true' : 'false');

    let request = this.http.get(this.url, {
      params: urlParams
    });

    return cacheTtl === 0 ?
      request : this.cacheService.cacheSingleRequest(this.url, urlParams, request, cacheTtl);
  }
}
