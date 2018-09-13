import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';


@Injectable()
export class CommunityGroupLeaderService {

    public v = 'full';
    constructor(private http: Http,
                private _appSettingsService: AppSettingsService) {

    }

    public getOpenMrsBaseUrl(): string {
        return this._appSettingsService.getOpenmrsRestbaseurl() + 'cohortm/cohortleader/';
    }


    public getGroupLeaderByGroupUuid(GroupUuid: string): Observable<any> {
        const params = new URLSearchParams();
        params.set('v', this.v);
        params.set('Group', GroupUuid);
        const url = this.getOpenMrsBaseUrl();
        return this.http.get(url, {
            search: params
        })
        .pipe(map((response) => response.json().results));
    }

    public getGroupLeaderByUuid(uuid: string): Observable<any> {
        const params = new URLSearchParams();
        params.set('v', this.v);
        const url = this.getOpenMrsBaseUrl() + uuid;
        return this.http.get(url).pipe(
            map((response) => response.json().results));
    }

    public updateGroupLeader(groupUuid: string, oldLeaderUuid: string, newLeaderUuid: string): Observable<any> {
        return this.removeGroupLeader(oldLeaderUuid)
                   .flatMap((res) => this.addGroupLeader(groupUuid, newLeaderUuid, new Date()));
    }


    public addGroupLeader(groupUuid: string, personUuid: string, startDate: Date): Observable<any> {
        const body = {cohort: groupUuid, person: personUuid, startDate};
        const url = this.getOpenMrsBaseUrl();
        return this.http.post(url, body).pipe(
            map((response) => response.json())
        );
    }

    public removeGroupLeader(leaderUuid: string): Observable<any> {
        const endDate = new Date();
        const voided = true;
        const body = {endDate, voided};
        const url = this.getOpenMrsBaseUrl() + leaderUuid;
        return this.http.post(url, body).pipe(
            map((response) => response.json()));
    }
}
