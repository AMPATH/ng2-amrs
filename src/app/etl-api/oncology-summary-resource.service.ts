import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class OncologySummaryResourceService {

  constructor(protected http: HttpClient,
              protected appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) { }

  public getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient';
  }

  public getOncologySummary(report: string, patientUuid: string, startIndex: number,
                            limit: number): Observable<any> {
    let url = this.getUrl();
    url += '/' + patientUuid + '/oncology/' + report;

    const urlParams: HttpParams = new HttpParams({fromObject: {
        startIndex: startIndex.toString(),
        limit: limit.toString()
      }});

    const request = this.http.get<any>(url, {
      params: urlParams
    }).pipe(
      map((response) => {
        return response.results;
      }));

    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
