import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

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
}
