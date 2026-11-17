import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSettingsService } from '../app-settings/app-settings.service';

export interface DprReportParams {
  locationUuids?: string;
  startDate: string;
  endDate: string;
  m24StartDate?: string;
  m24EndDate?: string;
  siteCodes?: string;
  mflCodes?: string;
  studySitesOnly?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DprReportService {
  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) {}

  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getDprReport(params: DprReportParams): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });

    return this.http
      .get(`${this.url}dqa-dpr-report`, { params: httpParams })
      .pipe(
        catchError((err: any) => {
          return of({
            error: err.status,
            message:
              (err.error && err.error.message) || err.statusText || err.message
          });
        })
      );
  }
}
