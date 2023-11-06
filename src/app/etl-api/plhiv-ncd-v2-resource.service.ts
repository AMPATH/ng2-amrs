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
        `${this.url}plhiv-ncd-v2-summary?endDate=${params.month}&locationUuids=${params.locationUuids}`
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
          console.log('prepp: ', response);
          return response;
        })
      );
  }
  public getPlhivNcdV2PatientList(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http
      .get(
        `${this.url}plhiv-ncd-v2-summary-patient-list?sDate=${params.sDate}&endDate=${params.eDate}&locationUuids=${params.locationUuids}&indicators=${params.indicators}`
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
