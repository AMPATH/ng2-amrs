import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PreAppointmentOutreachResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  private getUrl(reportName: string): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
  }

  public getWeeklyPredictionsPatientList(params: any) {
    let urlParams: HttpParams = new HttpParams()
      .set('locationUuids', params.locationUuids)
      .set('yearWeek', params.yearWeek);

    if (params.processOutcome === 1) {
      urlParams = urlParams.set('successfulOutcome', params.processOutcome);
    }
    if (params.processOutcome === 0) {
      urlParams = urlParams.set('failedOutcome', '1');
    }
    if (params.processOutcome === 2) {
      urlParams = urlParams.set('unknownOutcome', '0');
    }

    const url = this.getUrl('ml-weekly-predictions');
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(
        map((response: any) => {
          return response.result;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getPreAppointmentSummary(params: any) {
    const urlParams: HttpParams = new HttpParams()
      .set('locationUuids', params.locationUuids)
      .set('year', params.year)
      .set('month', params.month)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);

    const url = this.getUrl('ml-summary');
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(
        map((response: any) => {
          return response.result;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getMlSummaryPatientList(
    params: any,
    indicator: string
  ): Observable<any> {
    const urlParams: HttpParams = new HttpParams()
      .set('locationUuids', params.locationUuids)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate)
      .set('indicators', indicator);

    const url = this.getUrl('ml-summary-patient-list');
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

  public getPeerPatients(params: any) {
    const urlParams: HttpParams = new HttpParams().set(
      'creator',
      params.creator
    );

    const url = this.getUrl('pt4a');
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
