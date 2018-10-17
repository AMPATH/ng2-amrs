
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class MonthlyScheduleResourceService {
  constructor(protected http: HttpClient,
              protected appSettingsService: AppSettingsService,
              protected dataCache: DataCacheService,
              protected cacheService: CacheService) {
  }

  public getMonthlySchedule(params) {

    const url = this.getUrl();
    const urlParams: HttpParams = new HttpParams()
    .set('endDate', params.endDate)
    .set('startDate', params.startDate)
    .set('locationUuids', params.locationUuids)
    .set('limit', params.limit)
    .set('groupBy', 'groupByPerson,groupByAttendedDate,groupByRtcDate');
    if (params.programType && params.programType.length > 0) {
      urlParams.append('programType', params.programType);
    }
    if (params.visitType && params.visitType.length > 0) {
      urlParams.append('visitType', params.visitType);
    }
    if (params.encounterType && params.encounterType.length > 0) {
      urlParams.append('encounterType', params.encounterType);
    }

    const request = this.http.get<any>(url, {
      params: urlParams
    }).pipe(
      map((response) => {
        return response.results;
      }));

    return this.dataCache.cacheRequest(url, urlParams, request);
  }

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'get-monthly-schedule';
  }
}
