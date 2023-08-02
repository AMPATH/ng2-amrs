import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class PredictionResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getPatientPrediction(patientUuid: string) {
    const urlParams: HttpParams = new HttpParams().set(
      'patientUuid',
      patientUuid
    );

    const url = `${this.appSettingsService
      .getEtlRestbaseurl()
      .trim()}predicted-score`;
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
}
