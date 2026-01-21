import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Moment from 'moment';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RegistersResourceService {
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }
  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) {}
  public getPrEPRegisterReport(params: any): Observable<any> {
    return this.http
      .get(
        `${this.url}registers/prepregisterdata?month=${params.month}&startDate=${params.startDate}&endDate=${params.endDate}&locationUuids=${params.locationUuids}`
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
  public getDefaulterTracingRegister(params: any): Observable<any> {
    return this.http
      .get(
        `${this.url}registers/defaultertracing?month=${params.month}&startDate=${params.startDate}&endDate=${params.endDate}&locationUuids=${params.locationUuids}`
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
  public getMaternityRegister(params: any): Observable<any> {
    return this.http
      .get(
        `${this.url}registers/maternity?month=${params.month}&startDate=${params.startDate}&endDate=${params.endDate}&locationUuids=${params.locationUuids}`
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
  public getPncRegister(params: any): Observable<any> {
    return this.http
      .get(
        `${this.url}registers/pncregister?month=${params.month}&startDate=${params.startDate}&endDate=${params.endDate}&locationUuids=${params.locationUuids}`
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
  public getNutritionRegister(params: any): Observable<any> {
    return this.http
      .get(
        `${this.url}registers/nutrition?month=${params.month}&startDate=${params.startDate}&endDate=${params.endDate}&locationUuids=${params.locationUuids}`
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

  public getOTZRegister(params: any): Observable<any> {
    return this.http
      .get(
        `${this.url}registers/otz-register?month=${params.month}&startDate=${params.startDate}&endDate=${params.endDate}&locationUuids=${params.locationUuids}`
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
  public getMoh731Register(params: any): Observable<any> {
    return this.http
      .get(
        `${this.url}moh-731?month=${params.month}&startDate=${params.startDate}&endDate=${params.endDate}&locationUuids=${params.locationUuids}`
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
