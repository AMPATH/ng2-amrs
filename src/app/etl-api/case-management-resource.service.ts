import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable()
export class CaseManagementResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }
  public openMrsUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim();
  }
  public getUrlRequestParams(params): HttpParams {
    let urlParams: HttpParams = new HttpParams();

    if (params.locationUuid && params.locationUuid !== '') {
      urlParams = urlParams.set('locationUuid', params.locationUuid);
    }
    if (params.minDefaultPeriod && params.minDefaultPeriod !== '') {
      urlParams = urlParams.set('minDefaultPeriod', params.minDefaultPeriod);
    }
    if (params.caseManagerUserId && params.caseManagerUserId.length > 0) {
      urlParams = urlParams.set('caseManagerUserId', params.caseManagerUserId);
    }
    if (params.hasCaseManager && params.hasCaseManager !== '') {
      if (params.hasCaseManager === 'true') {
        urlParams = urlParams.set('hasCaseManager', '1');
      }
      if (params.hasCaseManager === 'false') {
        urlParams = urlParams.set('hasCaseManager', '0');
      }
    }
    if (params.dueForVl && params.dueForVl !== '') {
      if (params.dueForVl === 'true') {
        urlParams = urlParams.set('dueForVl', '1');
      }
      if (params.dueForVl === 'false') {
        urlParams = urlParams.set('dueForVl', '0');
      }
    }
    if (params.elevatedVL && params.elevatedVL !== '') {
      if (params.elevatedVL === 'true') {
        urlParams = urlParams.set('elevatedVL', '1');
      }
      if (params.elevatedVL === 'false') {
        urlParams = urlParams.set('elevatedVL', '0');
      }
    }

    if (params.hasPhoneRTC && params.hasPhoneRTC !== '') {
      if (params.hasPhoneRTC === 'true') {
        urlParams = urlParams.set('hasPhoneRTC', '1');
      }
      if (params.noPhoneRTC === 'false') {
        urlParams = urlParams.set('hasPhoneRTC', '0');
      }
    }
    if (params.isNewlyEnrolled && params.isNewlyEnrolled !== '') {
      if (params.isNewlyEnrolled === 'true') {
        urlParams = urlParams.set('isNewlyEnrolled', '1');
      }
      if (params.isNewlyEnrolled === 'false') {
        urlParams = urlParams.set('isNewlyEnrolled', '0');
      }
    }

    if (params.minDefaultPeriod && params.minDefaultPeriod !== '') {
      urlParams = urlParams.set('minDefaultPeriod', params.minDefaultPeriod);
    }
    if (params.maxDefaultPeriod && params.maxDefaultPeriod !== '') {
      urlParams = urlParams.set('maxDefaultPeriod', params.maxDefaultPeriod);
    }
    if (params.minFollowupPeriod && params.minFollowupPeriod !== '') {
      urlParams = urlParams.set('minFollowupPeriod', params.minFollowupPeriod);
    }
    if (params.maxFollowupPeriod && params.maxFollowupPeriod !== '') {
      urlParams = urlParams.set('maxFollowupPeriod', params.maxFollowupPeriod);
    }
    if (params.rtcStartDate && params.rtcStartDate !== '') {
      urlParams = urlParams.set('rtcStartDate', params.rtcStartDate);
    }
    if (params.rtcEndDate && params.rtcEndDate !== '') {
      urlParams = urlParams.set('rtcEndDate', params.rtcEndDate);
    }
    if (params.phoneFollowUpStartDate && params.phoneFollowUpStartDate !== '') {
      urlParams = urlParams.set(
        'phoneFollowUpStartDate',
        params.phoneFollowUpStartDate
      );
    }

    return urlParams;
  }

  public getCaseManagers(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url =
      this.appSettingsService.getEtlRestbaseurl().trim() + 'case-managers';
    const request = this.http.get(url, {
      params: urlParams
    });
    return request;
  }

  /*
Fetch case management patient list
*/
  public getCaseManagementList(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getUrl() + 'case-management';
    const request = this.http.get(url, {
      params: urlParams
    });

    return request;
  }
  public massAssign(payload) {
    if (!payload) {
      return null;
    }
    const url = this.getUrl() + 'assign-patients';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  public massUnAssign(payload) {
    if (!payload) {
      return null;
    }
    const url = this.getUrl() + 'unassign-patients';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getIndicatorDefinitions() {
    const url = this.getUrl() + 'case-management/indicators';
    const request = this.http.get(url);
    return this.cacheService.cacheRequest(url, {}, request);
  }
}
