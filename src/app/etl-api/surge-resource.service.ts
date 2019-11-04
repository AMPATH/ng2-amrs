import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { catchError, map } from 'rxjs/operators';
import * as Moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SurgeResourceService {
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) { }

  public getSurgeWeeklyReport(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`${this.url}surge-report?year_week=${Moment(params.year_week).format('YYYYWW')}&locationUuids=${params.locationUuids}`)
      .pipe(
        catchError((err: any) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText
          };
          return Observable.of(errorObj);
        }),
        map((response: Response) => {
          return response;
        })
      );
  }

  public getSurgeWeeklyPatientList(params: any): Observable<any> {
    return this.http.
    // tslint:disable-next-line: max-line-length
    get(`${this.url}surge-report-patient-list?indicators=${params.indicators}&year_week=${Moment(params.year_week).format('YYYYWW')}&locationUuids=${params.locationUuids}`)
      .pipe(
        map((response: Response) => {
          return response;
        }),
        catchError((err: Error) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText
          };
          return Observable.of(errorObj);
        })
      );
  }

  public getSurgeDailyReport(params: any): Observable<any> {
    return this.http
      .get(`${this.url}surge-daily-report?_date=${params._date}&locationUuids=${params.locationUuids}`)
      .pipe(
        map((response: Response) => {
          return response;
        }),
        catchError((err: Error) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText
          };
          return Observable.of(errorObj);
        })
      );
  }

  public getSurgeDailyReportPatientList(params: any): Observable<any> {
    return this.http
      // tslint:disable-next-line: max-line-length
      .get(`${this.url}surge-daily-report-patient-list?indicators=${params.indicators}&_date=${params._date}&locationUuids=${params.locationUuids}`)
      .pipe(
        map((response: Response) => {
          return response;
        }),
        catchError((err: Error) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText
          };
          return Observable.of(errorObj);
        })
      );
  }
}
