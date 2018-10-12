import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Rx';
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

    let report = '';
    let aggregated = 'false';
    if(isAggregated){
          aggregated = 'true';
    }

    if (isLegacyReport) {
         report = 'MOH-731-report';
    } else {
         report = 'MOH-731-report-2017';
    }


    let urlParams: HttpParams = new HttpParams()
    .set('locationUuids', locationUuids)
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('reportName', report)
    .set('isAggregated', aggregated);


    let request = this.http.get(this.url, { 
       params: urlParams
    })
      .map((response: Response) => {
        return response;
      }).catch((err: any) => {
         console.log('Err', err);
         let error: any = err;
         let errorObj = {
           'error': error.status,
           'message': error.statusText
         };
         return Observable.of(errorObj);
      });

    return cacheTtl === 0 ?
      request : this.cacheService.cacheSingleRequest(this.url, urlParams, request, cacheTtl);
  }
}
