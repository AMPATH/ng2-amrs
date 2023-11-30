import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class CohortOtzModuleResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}
  public getUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-modules'
    );
  }

  public getSummaryUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      'hiv-latest-summaries'
    );
  }

  public getPatientsSuppressionsUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      'viral-load-suppression-rate'
    );
  }

  public getCohortOtzModule(cohortUuid: string): Observable<any> {
    return this.http.get(this.getUrl() + '/' + cohortUuid);
  }
  public getUrlRequestParams(patientUuids: string[]): HttpParams {
    let urlParams: HttpParams = new HttpParams();

    if (patientUuids && patientUuids.length > 0) {
      urlParams = urlParams.set('uuid', patientUuids.join(','));
    }
    return urlParams;
  }

  public getPatientsLatestHivSummaries(payload: string[]) {
    if (!payload || payload.length === 0) {
      return null;
    }
    return this.http.get(this.getSummaryUrl(), {
      params: this.getUrlRequestParams(payload)
    });
  }

  public getPatientsSuppressionStatus(payload: string[]) {
    if (!payload || payload.length === 0) {
      return null;
    }
    return this.http.get(this.getPatientsSuppressionsUrl(), {
      params: this.getUrlRequestParams(payload)
    });
  }
}
