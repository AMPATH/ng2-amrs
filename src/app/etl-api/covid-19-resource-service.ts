import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

interface PatientListPayload {
  endingMonth: string;
  locationUuids: string;
  indicators: string;
}

interface MonthlyReportPayload {
  endingMonth: string;
  locationUuids: string;
}

@Injectable()
export class Covid19ResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getCovid19VaccinationStatus(patientUuid: string): Observable<any> {
    let url = this.getUrl();
    url += 'covid-vaccination-status';

    const params: HttpParams = new HttpParams().set(
      'patientUuid',
      patientUuid as string
    );

    const request = this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.result;
        })
      );
    return this.cacheService.cacheRequest(url, params, request);
  }

  public getCovid19VaccinationMonthlyReport(
    payload: MonthlyReportPayload
  ): Observable<any> {
    if (!payload) {
      return null;
    }
    const urlParams: HttpParams = new HttpParams()
      .set('endingMonth', payload.endingMonth)
      .set('locationUuids', payload.locationUuids);
    const url = this.getUrl() + 'covid-19-monthly-vaccination-report';
    const request = this.http.get(url, {
      params: urlParams
    });
    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getCovid19VaccinationMonthlyReportPatientList(
    payload: PatientListPayload
  ): Observable<any> {
    if (!payload) {
      return null;
    }
    const urlParams: HttpParams = new HttpParams()
      .set('endingMonth', payload.endingMonth)
      .set('locationUuids', payload.locationUuids)
      .set('indicators', payload.indicators);
    const url =
      this.getUrl() + 'covid-19-monthly-vaccination-report/patient-list';
    const request = this.http.get(url, {
      params: urlParams
    });
    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
