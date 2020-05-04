import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable()
export class CaseManagementResourceService {
    constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) { }

    public mockCaseManagerPatientList = [
      {
        'patient_uuid': 'uuid',
        'case_manager': 'Test Manager',
        'patient_name': 'Test Patient',
        'age': '21',
        'gender': 'F',
        'last_follow_up_date': '2020-03-01',
        'days_since_follow_up': 10,
        'rtc_date': '2020-04-01',
        'phone_rtc_date': '2020-04-05',
        'last_vl': 100,
        'due_for_vl': 1,
        'missed_appointment': 1,
        'case_manager_uuid': 'muuid'

      },
      {
        'patient_uuid': 'uuid2',
        'case_manager': 'Test Manager 2',
        'patient_name': 'Test Patient 2',
        'age': '21',
        'gender': 'F',
        'last_follow_up_date': '2020-02-01',
        'days_since_follow_up': 10,
        'rtc_date': '2020-04-01',
        'phone_rtc_date': '2020-04-05',
        'last_vl': 1000,
        'due_for_vl': 0,
        'missed_appointment': 0,
        'case_manager_uuid': 'muuid2'

      }
  ];
    public mockCaseManagerProviders = [{}];

  public mockParams = {
      'locationUuid': 'uuid1',
      'caseManagerUuid': 'manager_uuid',
      'hasCaseManager': 1,
      'hasPhoneRTC': 1,
      'dueForVl': 1,
      'elevatedVL': 1,
      'rtcStartDate': '2020-04-30',
      'rtcEndDate': '2020-04-30',
      'phoneFollowUpStartDate': '2020-04-30',
      'minDefaultPeriod': 0,
      'maxDefaultPeriod': 100

  };

    public getUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
          + 'case-management';

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
      if (params.caseManagerUuid && params.caseManagerUuid.length > 0) {
          urlParams = urlParams.set('caseManagerUuid', params.caseManagerUuid);
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
        urlParams = urlParams.set('phoneFollowUpStartDate', params.phoneFollowUpStartDate);
      }

      console.log('Url pARAMS', urlParams);

      return urlParams;

    }

    public getCaseManagers(params) {

      const urlParams = this.getUrlRequestParams(params);
      const url = this.appSettingsService.getEtlRestbaseurl().trim() + 'case-managers';
      const request = this.http.get(url, {
          params: urlParams
      });

      return request;

      // return this.cacheService.cacheRequest(url, urlParams, request);

    }

/*
Fetch case management patient list
*/
    public getCaseManagementList(params) {

      const urlParams = this.getUrlRequestParams(params);
      const url = this.getUrl();
      const request = this.http.get( url, {
          params: urlParams
      });

      return request;
    }

    public updateCaseManagers(payload, uuid) {
      if (!payload || !uuid) {
        return null;
      }
      const url = this.openMrsUrl() + '/person/' + uuid;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(url, JSON.stringify(payload), {headers}).pipe(
        map((response: any) => {
          return response.person;
        }));
    }
}
