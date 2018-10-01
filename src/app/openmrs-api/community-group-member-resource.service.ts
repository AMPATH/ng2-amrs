import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { PersonResourceService } from './person-resource.service';

@Injectable()
export class CommunityGroupMemberService {


    constructor(private http: Http,
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
        return this.http.post(url, body).pipe(map((res) => res.json()));
      }

    public updatePersonAttribute(personUuid: string, attributeUuid: string, value: any): Observable<any> {
        const url = this.getOpenMrsBaseUrl() + '/person/' + personUuid + '/attribute/' + attributeUuid;
        const body = {value};
        return this.http.post(url, body).pipe(map((response) => response.json()));
    }

    createPersonAttribute(personUuid: string, attributeType: string, value: any): any {
        const url = this.getOpenMrsBaseUrl() + '/person/' + personUuid + '/attribute/';
        const body = {value, attributeType};
        return this.http.post(url, body).pipe(map((response) => response.json()));
    }

    createMember(cohortUuid: string, patientUuid: string): Observable<any> {
        const url = this.getOpenMrsGroupModuleUrl();
        const body = {cohort: cohortUuid, patient: patientUuid, startDate: new Date()};
        return this.http.post(url, body).pipe(map((response) => response.json()));
    }

    getMemberCohortsByPatientUuid(patientUuid: string): Observable<any> {
        const url = this.getOpenMrsGroupModuleUrl();
        const params = new URLSearchParams();
        params.set('v', 'full');
        params.set('patient', patientUuid);
        return this.http.get(url, {search: params}).pipe(map((response) => response.json().results));
    }
}
