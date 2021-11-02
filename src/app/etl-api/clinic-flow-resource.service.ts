import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class ClinicFlowResourceService {
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
      'clinic-flow-provider-statistics/patient-list'
    );
  }

  public getClinicFlowProviderStatisticsPatientList(params: any) {
    if (!params) {
      return null;
    }
    let urlParams: HttpParams = new HttpParams()
      .set('providerUuid', params.providerUuid)
      .set('locationUuid', params.location_uuid);
    if (params.encounterTypeId) {
      if (params.encounterTypeId.length > 0) {
        urlParams = urlParams.set('encounterTypeId', params.encounterTypeId);
      }
    }
    if (params.encounterDate) {
      if (params.encounterDate.length > 0) {
        urlParams = urlParams.set('encounterDate', params.encounterDate);
      }
    }
    if (params.indicators) {
      if (params.indicators.length > 0) {
        urlParams = urlParams.set('indicators', params.indicators);
      }
    }

    const url = this.getPatientListUrl();
    const request = this.http.get(url, {
      params: urlParams
    });
    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
