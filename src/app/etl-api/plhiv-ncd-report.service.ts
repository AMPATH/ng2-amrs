import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as Moment from 'moment';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class PlhivNcdReportService {
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }
  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) {}
  public getPlhivNcdMonthlyReport(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http
      .get(
        `${this.url}plhiv-ncd-monthly-summary?endDate=${params.month}&locationUuids=${params.locationUuids}`
      )
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
          console.log('data-list-response: >>', response);
          return response;
        })
      );
  }
  public getPlhivNcdPatientList(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http
      .get(
        `${this.url}plhiv-ncd-monthly-summary-patient-list?endDate=${params.month}&locationUuids=${params.locationUuids}
        &indicators=${params.indicators}`
      )
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
}
