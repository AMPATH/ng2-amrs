import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Observable, Subject } from 'rxjs/Rx';

import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class Moh731ResourceService {

  private _url = 'MOH-731-report';
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + this._url;
  }

  constructor(public http: Http,
              public appSettingsService: AppSettingsService,
              public cacheService: DataCacheService) {
  }

  public getMoh731Report(locationUuids: string, startDate: string, endDate: string,
                         isLegacyReport: boolean,
                         isAggregated: boolean, cacheTtl: number = 0): Observable<any> {

    let urlParams: URLSearchParams = new URLSearchParams();

    urlParams.set('locationUuids', locationUuids);
    urlParams.set('startDate', startDate);
    urlParams.set('endDate', endDate);

    if (isLegacyReport) {
      urlParams.set('reportName', 'MOH-731-report');
    } else {
      urlParams.set('reportName', 'MOH-731-report-2017');
    }
    urlParams.set('isAggregated', isAggregated ? 'true' : 'false');

    let request = this.http.get(this.url, {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json();
      });

    return cacheTtl === 0 ?
      request : this.cacheService.cacheSingleRequest(this.url, urlParams, request, cacheTtl);
  }
}
