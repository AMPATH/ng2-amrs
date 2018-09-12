import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { CommunityGroupAttributeService } from './community-group-attribute-resource.service';
@Injectable()
export class CommunityGroupService {

    public v = 'full';
    constructor(private http: Http,
                private _appSettingsService: AppSettingsService,
                private communityGroupAttributeService: CommunityGroupAttributeService) {

    }

    public getOpenMrsBaseUrl(): string {
        return this._appSettingsService.getOpenmrsRestbaseurl() + 'cohortm/cohort';
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
        const url = this.getOpenMrsBaseUrl();
        return this.http.get(url, {
            search: params
        })
        .pipe(
            map((response) => response.json().results)
        );
    }

    public getGroupByName(name: string): Observable<any> {
        const params = new URLSearchParams();
        params.set('v', this.v);
        params.set('q', name);
        return this.http.get(this.getOpenMrsBaseUrl(), {
            search: params
        }).pipe(
            map((response) => response.json().results)
        );
    }

  public getGroupByUuid(groupUuid: string): Observable<any> {
      const url = this.getOpenMrsBaseUrl() + `/${groupUuid}`;
      return this.http.get(url).pipe(
        map((response) => response.json())
      );
    }

  public disbandGroup(uuid: string, endDate: Date): any {
        const url = this.getOpenMrsBaseUrl() + `/${uuid}`;
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
        if (body) {
            requests.push(this.http.post(url, body));
        }

        if (attributes) {
            const attributeUrls = this.communityGroupAttributeService.generateAttributeUrls(attributes);
            _.forEach((attributeUrls), (attributeUrl) => {
              requests.push(this.http.post(attributeUrl['url'], attributeUrl['body']));
            });

        }

        console.log(requests);
        return forkJoin(requests);

    }

}
