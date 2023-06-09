import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PrepMonthlyResourceService {
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }
  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) {}
  public getPrepMonthlyAggReport(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http
      .get(
        `${this.url}prep-monthly-report?endDate=2023-06-30&locationUuids=20bd486d-5c84-44f4-9ffa-2f1c1d9e79f8`
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
  public getPrepMonthlyPatientList(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http
      .get(
        `${this.url}prep-monthly-patient-list?&endDate=${params.eDate}&locationUuids=${params.locationUuids}&indicators=${params.indicators}`
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
