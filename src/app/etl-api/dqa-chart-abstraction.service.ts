import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DqaChartAbstractionService {
  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) {}

  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getDqaChartAbstractionReport(params: any): Observable<any> {
    const sampleUrl =
      this.url +
      'dqa-chart-abstraction?locationUuids=' +
      params.locations +
      '&limit=' +
      params.limit +
      '&offset=' +
      params.offset;

    return this.http.get(sampleUrl, {}).pipe(
      map((response: any) => {
        return response.results.results;
      }),
      catchError((err: any) => {
        console.log('Err', err);
        const error: any = err;
        const errorObj = {
          error: error.status,
          message: error.statusText
        };
        return of(errorObj);
      })
    );
  }
  public getDqaVerificationChartAbstractionReport(
    params: any
  ): Observable<any> {
    const sampleUrl =
      this.url +
      'client_validation?locationUuid=' +
      params.locations +
      '&limit=' +
      params.limit +
      '&offset=' +
      params.offset;

    return this.http.get(sampleUrl, {}).pipe(
      map((response: any) => {
        return response.result;
      }),
      catchError((err: any) => {
        console.log('Err', err);
        const error: any = err;
        const errorObj = {
          error: error.status,
          message: error.statusText
        };
        return of(errorObj);
      })
    );
  }
}
