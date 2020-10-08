import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable()
export class PatientCareStatusResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  public getMonthlyPatientCareStatus(options: {
    startDate: string;
    endDate: string;
    patient_uuid: string;
  }): Observable<any> {
    const api: string =
      this.appSettingsService.getEtlServer() +
      '/patient/' +
      options.patient_uuid +
      '/monthly-care-status';
    const params: HttpParams = this.getUrlRequestParams(options);
    return this.http.get(api, { params: params });
  }

  public getDailyPatientCareStatus(options: {
    patient_uuid: string;
    referenceDate: string;
  }): Observable<any> {
    const api: string =
      this.appSettingsService.getEtlServer() +
      '/patient/' +
      options.patient_uuid +
      '/daily-care-status';
    const urlParams: HttpParams = new HttpParams().set(
      'referenceDate',
      options.referenceDate
    );
    return this.http.get(api, { params: urlParams });
  }

  private getUrlRequestParams(options: {
    startDate: string;
    endDate: string;
    patient_uuid: string;
  }): HttpParams {
    const urlParams: HttpParams = new HttpParams()
      .set('startDate', options.startDate)
      .set('endDate', options.endDate);
    return urlParams;
  }
}
