import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlhivNcdV2ResourceService {
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) {}

  public getPLHIVNCDv2MonthlyReport(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http
      .get(
        `${this.url}plhiv-ncd-v2-monthly-report?startDate=${params.startDate}&endDate=${params.month}&locationUuids=${params.locationUuids}&currentView=${params.currentView}`
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
  public getPlhivNcdV2PatientList(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http
      .get(
        `${this.url}plhiv-ncd-v2-monthly-report-patient-list?startDate=${params.startDate}&endDate=${params.month}&locationUuids=${params.locationUuids}&indicators=${params.indicators}&currentView=${params.currentView}`
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
