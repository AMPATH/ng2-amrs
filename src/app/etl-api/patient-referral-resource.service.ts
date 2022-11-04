import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { throwError as observableThrowError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class PatientReferralResourceService {
  public cache;
  private requestUrl = '';

  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public ETL_PREFIX = this.appSettingsService.getEtlRestbaseurl().trim();
  public REFERRALS_PATH = this.ETL_PREFIX + 'patient-referrals';
  public REFERRAL_PATIENT_LIST_PATH = this.ETL_PREFIX + 'referral-patient-list';
  public REFERRAL_DETAILS_PATH = this.ETL_PREFIX + 'patient-referral-details';
  public REFERRAL_NOTIFICATION_PATH = this.ETL_PREFIX + 'patient-referral';

  private getUrlRequestParams(params: any): HttpParams {
    const {
      department,
      startAge,
      endAge,
      startDate,
      endDate,
      gender,
      notificationStatus,
      locationUuids,
      stateUuids,
      programUuids,
      providerUuids
    } = params;

    let urlParams: HttpParams = new HttpParams()
      .set('endDate', endDate)
      .set('startDate', startDate);

    if (gender && gender !== 'undefined') {
      urlParams = urlParams.set('gender', params.gender);
    }
    if (locationUuids && locationUuids !== 'undefined') {
      urlParams = urlParams.set('locationUuids', params.locationUuids);
    }
    if (startAge && startAge !== 'undefined') {
      urlParams = urlParams.set('startAge', params.startAge);
    }
    if (endAge && endAge !== 'undefined') {
      urlParams = urlParams.set('endAge', endAge);
    }
    if (programUuids && programUuids !== 'undefined') {
      urlParams = urlParams.set('programUuids', programUuids);
    }
    if (stateUuids && stateUuids !== 'undefined') {
      urlParams = urlParams.set('stateUuids', stateUuids);
    }
    if (providerUuids && providerUuids !== 'undefined') {
      urlParams = urlParams.set('providerUuids', providerUuids);
    }
    if (notificationStatus && notificationStatus !== 'undefined') {
      urlParams = urlParams.set('notificationStatus', notificationStatus);
    }
    if (department && department !== 'undefined') {
      urlParams = urlParams.set('department', department);
    }
    return urlParams;
  }

  private handleError(error: any) {
    return observableThrowError(
      error.message
        ? error.message
        : error.status
        ? `${error.status} - ${error.statusText}`
        : 'Server Error'
    );
  }

  public updateReferralNotificationStatus(payload: any) {
    if (!payload || (payload && !payload.patient_referral_id)) {
      return null;
    }
    const url =
      this.REFERRAL_NOTIFICATION_PATH + '/' + payload.patient_referral_id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, JSON.stringify(payload), { headers }).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  public getPatientReferralReport(params: any) {
    const urlParams = this.getUrlRequestParams(params);
    const url: string = this.REFERRALS_PATH;
    const request = this.http.get<any>(url, { params: urlParams }).pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );

    const key = url + '?' + urlParams.toString();
    if (key !== this.requestUrl) {
      // clear cache after 1 minute
      const refreshCacheTime = 1 * 60 * 1000;
      this.requestUrl = key;
      this.cache = this.cacheService.cacheSingleRequest(
        url,
        urlParams,
        request,
        refreshCacheTime
      );
    }

    return this.cache;
  }

  public getPatientReferralPatientList(params: any) {
    const urlParams = this.getUrlRequestParams(params);
    if (!params.startIndex) {
      params.startIndex = '0';
    }
    if (!params.limit) {
      params.limit = '300';
    }
    urlParams.set('limit', params.limit);
    const url = this.REFERRAL_PATIENT_LIST_PATH;
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(map((response: any) => response.result));

    const key = url + '?' + urlParams.toString();
    if (key !== this.requestUrl) {
      // clear cache after 1 minute
      const refreshCacheTime = 1 * 60 * 1000;
      this.requestUrl = key;
      this.cache = this.cacheService.cacheSingleRequest(
        url,
        urlParams,
        request,
        refreshCacheTime
      );
    }

    return this.cache;
  }

  public getReferralByLocationUuid(
    locationUuid: string,
    enrollmentUuid?: string
  ) {
    const url =
      this.REFERRAL_DETAILS_PATH + '/' + locationUuid + '/' + enrollmentUuid;

    return this.http.get<any>(url).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }
}
