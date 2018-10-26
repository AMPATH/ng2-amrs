import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { PersonResourceService } from './person-resource.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class CommunityGroupMemberService {


    constructor(private http: HttpClient,
                private _appSettingsService: AppSettingsService) {}

    public getOpenMrsBaseUrl(): string {
        return this._appSettingsService.getOpenmrsRestbaseurl();
    }

    public getOpenMrsGroupModuleUrl(): string {
        return this.getOpenMrsBaseUrl() + 'cohortm/cohortmember/';
    }

    public endMembership(memberUuid: any, date: any): Observable<any> {
        const url = this.getOpenMrsBaseUrl() + 'cohortm/cohortmember/' + memberUuid;
        const body = {endDate: date, voided: true};
        return this.http.post(url, body);
      }

    public updatePersonAttribute(personUuid: string, attributeUuid: string, value: any): Observable<any> {
        const url = this.getOpenMrsBaseUrl() + '/person/' + personUuid + '/attribute/' + attributeUuid;
        const body = {value};
        return this.http.post(url, body);
    }

    createPersonAttribute(personUuid: string, attributeType: string, value: any): any {
        const url = this.getOpenMrsBaseUrl() + '/person/' + personUuid + '/attribute/';
        const body = {value, attributeType};
        return this.http.post(url, body);
    }

    createMember(cohortUuid: string, patientUuid: string): Observable<any> {
        const url = this.getOpenMrsGroupModuleUrl();
        const body = {cohort: cohortUuid, patient: patientUuid, startDate: new Date()};
        return this.http.post(url, body);
    }

    getMemberCohortsByPatientUuid(patientUuid: string): Observable<any> {
        const url = this.getOpenMrsGroupModuleUrl();
        const params = new HttpParams()
        .set('v', 'full')
        .set('patient', patientUuid);
        return this.http.get<any>(url, {params: params})
        .pipe(map((response) => response.results));
    }
}
