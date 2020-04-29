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

    public getUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
          + 'case-management';

    }
    public openMrsUrl(): string {
      return this.appSettingsService.getOpenmrsRestbaseurl().trim();

  }


    public getUrlRequestParams(params): HttpParams {
        const urlParams: HttpParams = new HttpParams();

        return urlParams;
    }

    public getCaseManagers(params) {
    }

/*
Fetch case management patient list
*/
    public getCaseManagementList(params) {
      return Observable.of(this.mockCaseManagerPatientList);
    }

    public updateCaseManagers(payload,uuid){
      if (!payload || !uuid) {
        return null;
      }
      const url = this.openMrsUrl() + '/person/' + uuid;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log(url);
      return this.http.post(url, JSON.stringify(payload), {headers}).pipe(
        map((response: any) => {
          return response.person;
        }));
    }
}
