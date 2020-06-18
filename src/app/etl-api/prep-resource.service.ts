import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Moment from 'moment';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PrepResourceService {
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }
  constructor(public http: HttpClient,
    public appSettingsService: AppSettingsService) { }
  public getPrepMonthlyReport(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`${this.url}prep-monthly-summary?endDate=${params.month}&locationUuids=${params.locationUuids}`)
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
  public getPrepPatientList(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`${this.url}prep-monthly-summary-patient-list?endDate=${params.month}&locationUuids=${params.locationUuids}
      &indicators=${params.indicators}`)
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
