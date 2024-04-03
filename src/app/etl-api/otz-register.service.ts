import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class OtzRegisterService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'otz-monthly-register/patient-list';
  }

  public getOtzRegister(payload: {
    endDate: string;
    locationUuid: string;
  }): Observable<any> {
    const url = this.getBaseUrl();
    let urlParams: HttpParams = new HttpParams().set(
      'endDate',
      payload.endDate
    );
    // .set('locationUuid', payload.locationUuid);
    // const request = this.http.get(url);

    return this.http.get(url, { params: urlParams });

    // return this.cacheService.cacheRequest(url, '', request);
  }
}
