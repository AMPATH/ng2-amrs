import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable({
  providedIn: 'root'
})
export class DqaChartAbstractionService {

  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) { }


  public getUrl(reportName): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
  }

  public getDqaChartAbstractionReport(params: any): Observable<any> {
    console.log('params', params);
    const urlParams: HttpParams = new HttpParams()
    .set('locationUuids', params.locationUuids)
    .set('startDate', params.startDate)
    .set('endDate', params.endDate)
    .set('limit', params.limit)
    .set('offset', params.offset);
    const url = this.getUrl('dqa-chart-abstraction');
    const request = this.http.get<any>(url, {
      params: urlParams
    }).pipe(
      map((response: any) => {
        return response.results.results;
      }));
    return this.cacheService.cacheRequest(url, urlParams, request);
  }

}
