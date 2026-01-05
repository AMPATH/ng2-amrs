import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Moment from 'moment';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { DataCacheService } from '../shared/services/data-cache.service';
@Injectable({
  providedIn: 'root'
})
export class RegistersResourceService {
  // public moh731Data: any = {};
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }
  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  private getUrl(reportName: string): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
  }
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
    const urlParams: HttpParams = new HttpParams()
      .set('locationUuids', params.locationUuids)
      .set('month', params.month)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    const url = this.getUrl('moh-731');
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
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
        }),
        shareReplay(1)
      );

    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getMoh731PatientList(params: any, indicator: string): Observable<any> {
    const startIndex = '0';
    const limit = '300';

    const urlParams: HttpParams = new HttpParams()
      .set('locationUuids', params.locationUuids)
      .set(
        'startDate',
        Moment(params.startDate).startOf('day').format('YYYY-MM-DD')
      )
      .set('endDate', Moment(params.endDate).endOf('day').format('YYYY-MM-DD'))
      .set('gender', params.indicatorGender)
      .set('indicator', indicator)
      .set('startIndex', startIndex)
      .set('limit', limit);

    const url = this.getUrl('moh-731-patient-list');
    return this.http
      .get(url, {
        params: urlParams
      })
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
