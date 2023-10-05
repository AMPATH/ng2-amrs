import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable({
  providedIn: 'root'
})
export class PmtctCalhivRriReportService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getPatientListUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      'pmtct_rri_summary/patient-list'
    );
  }

  public getRriIndicatorsReport(payload: any): Observable<any> {
    if (!payload) {
      return null;
    }
    let urlParams: HttpParams = new HttpParams()
      .set('endDate', payload.endDate)
      .set('startDate', payload.startDate);

    if (payload.locationUuids) {
      if (payload.locationUuids.length > 0) {
        urlParams = urlParams.set('locationUuids', payload.locationUuids);
      }
    }
    const url = this.getBaseUrl() + 'pmtct_rri_summary';
    return this.http.get(url, {
      params: urlParams
    });
  }

  public getRriMonthlySummaryPatientList(params: any) {
    if (!params) {
      return null;
    }

    const urlParams: HttpParams = new HttpParams()
      .set('startDate', params.startDate)
      .set('endDate', params.endDate)
      .set('locationUuids', params.locationUuids)
      .set('indicators', params.indicators)
      .set('reportType', params.reportType);

    const url = this.getPatientListUrl();

    return this.http.get(url, {
      params: urlParams
    });
  }
}
