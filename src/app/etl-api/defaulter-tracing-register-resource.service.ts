import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefaulterTracingRegisterResourceService {
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) {}

  public getDefaulterTracingRegisterMonthlyRegister(
    params: any
  ): Observable<any> {
    console.log('params2etl: ', params);
    // tslint:disable-next-line: max-line-length
    return this.http
      .get(
        `${this.url}defaulter-tracing-register?&month=${params.month}&locationUuids=${params.locationUuids}`
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
  public getDefaulterTracingRegisterPatientList(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http
      .get(
        `${this.url}defaulter-tracing-register-patient-list?startDate=${params.startDate}&endDate=${params.month}&locationUuids=${params.locationUuids}&indicators=${params.indicators}&currentView=${params.currentView}`
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
