import { Injectable } from '@angular/core';
import { Http, URLSearchParams , RequestOptions, Headers } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, forkJoin } from 'rxjs';
import * as _ from 'lodash';
import { CommunityGroupAttributeService } from './community-group-attribute-resource.service';
import { map, catchError } from 'rxjs/operators';
@Injectable()
export class CommunityGroupService {

    public v = 'full';
    constructor(private http: Http,
                private _appSettingsService: AppSettingsService,
                private communityGroupAttributeService: CommunityGroupAttributeService) {

    }

    public getOpenMrsBaseUrl(): string {
        return this._appSettingsService.getOpenmrsRestbaseurl() + 'cohortm';
    }

    public searchCohort(searchString: string) {
        const regex = new RegExp(/^\d+$/);
        if (regex.test(searchString)) {
            return this.getGroupByGroupNumber(searchString);
        } else {
            return this.getGroupByName(searchString);
        }

    }

    public getGroupByGroupNumber(groupNumber: string): Observable<any> {
        const params = new URLSearchParams();
        params.set('attributes', `"groupNumber":"${groupNumber}"`);
        params.set('v', this.v);
        const url = this.getOpenMrsBaseUrl() + '/cohort';
        return this.http.get(url, {
            search: params
        })
        .pipe(
            map((response) => response.json().results),
            catchError((error) => 'An error occurred ' + error)
        );
    }

    public getCohortByName(name: string): Observable<any> {
        const params = new URLSearchParams();
        params.set('v', this.v);
        params.set('q', name);
        return this.http.get(this.getOpenMrsBaseUrl() + '/cohort', {
            search: params
        }).pipe(
            map((response) => response.json().results),
            catchError((error) => 'An error occurred ' + error)
        );
    }

  public getCohortByUuid(groupUuid: string): Observable<any> {
      const url = this.getOpenMrsBaseUrl() + '/cohort' + `/${groupUuid}`;
      return this.http.get(url).pipe(
        map((response) => response.json()),
        catchError((error) => 'An error occurred ' + error)
      );
    }

  public getCohortTypes(): Observable<any> {
    const params = new URLSearchParams();
    params.set('v', this.v);
    const url = this.getOpenMrsBaseUrl() + '/cohorttype';
    return this.http.get(url, {
        search: params
    }).pipe(map((response) => {
        return response.json().results;
    }));

  }

  public getCohortPrograms() {
    const params = new URLSearchParams();
    params.set('v', this.v);
    const url = this.getOpenMrsBaseUrl() + '/cohortprogram';
    return this.http.get(url, {
        search: params
    }).pipe(map((response) => {
        return response.json().results;
    }));

  }

  public createCohort(payload) {

    if (!payload) {
        return null;
    }

    const params = new URLSearchParams();
    params.set('v', this.v);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const url = this.getOpenMrsBaseUrl() + '/cohort';
    return this.http.post(url, JSON.stringify(payload), options).pipe(
        map((response: Response) => {
            return response.json();
        }));

  }

    public getGroupByName(name: string): Observable<any> {
        console.log('Name', name);
        const params = new URLSearchParams();
        params.set('v', this.v);
        params.set('q', name);
        return this.http.get(this.getOpenMrsBaseUrl() +  '/cohort' , {
            search: params
        }).pipe(
            map((response) => response.json().results)
        );
    }

  public getGroupByUuid(groupUuid: string): Observable<any> {
      const url = this.getOpenMrsBaseUrl() +  '/cohort' + `/${groupUuid}`;
      return this.http.get(url).pipe(
        map((response) => response.json())
      );
    }

  public disbandGroup(uuid: string, endDate: Date): any {
        const url = this.getOpenMrsBaseUrl() + '/cohort' + ` /${uuid}`;
        const body = {endDate};
        return this.http.post(url, body).pipe(
            map((response) => response.json())
          );
    }

    public getGroupAttribute(attributeType: string, attributes: any[]): any {
        return _.filter(attributes, (attribute) => attribute.cohortAttributeType.name === attributeType)[0];
    }


    public updateGroup(uuid: string, groupName?: string, locationUuid?: string, attributes?: any): Observable<any> {
        const url = `${this.getOpenMrsBaseUrl()}/${uuid}`;
        const requests = [];
        const body = {};
        if (groupName) {
            body['name'] = groupName;
        }
        if (locationUuid) {
            body['location'] = locationUuid;
        }
        if (attributes) {
            body['attributes'] = attributes;
        }

        return this.http.post(url, body).pipe(map((res) => res.json()));

    }
    public updateCohortGroup(payload, uuid): Observable<any> {
        if (!payload) {
            return null;
        }
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const url = this.getOpenMrsBaseUrl() + '/cohort/' + uuid;
        return this.http.post(url, JSON.stringify(payload), options).pipe(
            map((response: Response) => {
                return response.json();
            }));

    }
}
