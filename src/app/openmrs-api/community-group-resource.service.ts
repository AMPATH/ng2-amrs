import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, forkJoin } from 'rxjs';
import * as _ from 'lodash';
import { CommunityGroupAttributeService } from './community-group-attribute-resource.service';
import { map, catchError } from 'rxjs/operators';
@Injectable()
export class CommunityGroupService {
  public v = 'full';

  constructor(private http: Http,
    private _appSettingsService: AppSettingsService) {

  }

  public getOpenMrsBaseUrl(): string {
    return this._appSettingsService.getOpenmrsRestbaseurl() + 'cohortm';
  }

  public getCohortVisitUrl(): string {
    return this._appSettingsService.getOpenmrsRestbaseurl() + 'cohortm/cohortvisit';
  }

  public searchCohort(searchString: string, searchByLandmark = false) {
    if (searchByLandmark) {
      return this.getGroupsByLandmark(searchString);
    } else {
      const regex = new RegExp(/^\d/);
      if (regex.test(searchString)) {
        return this.getGroupByGroupNumber(searchString);
      } else {
        return this.getGroupByName(searchString);
      }
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
        map((response) => response.json().results)
      );
  }

  public getGroupByName(name: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('v', this.v);
    params.set('q', name);
    return this.http.get(this.getOpenMrsBaseUrl() + '/cohort', {
      search: params
    }).pipe(
      map((response) => response.json().results),
    );
  }

  public getGroupByUuid(groupUuid: string): Observable<any> {
    const url = this.getOpenMrsBaseUrl() + '/cohort' + `/${groupUuid}`;
    return this.http.get(url).pipe(
      map((response) => response.json())
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

  public createGroup(payload) {

    if (!payload) {
      return null;
    }

    const params = new URLSearchParams();
    params.set('v', this.v);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });
    const url = this.getOpenMrsBaseUrl() + '/cohort';
    return this.http.post(url, JSON.stringify(payload), options).pipe(
      map((response: Response) => {
        return response.json();
      }));

  }


  public disbandGroup(uuid: string, endDate: Date): any {
    const url = this.getOpenMrsBaseUrl() + '/cohort' + ` /${uuid}`;
    const body = {
      endDate: endDate,
      voided: 1
    };
    return this.http.post(url, body).pipe(
      map((response) => response.json())
    );
  }

  public getGroupAttribute(attributeType: string, attributes: any[]): any {
    return _.filter(attributes, (attribute) => attribute.cohortAttributeType.name === attributeType)[0];
  }


  public updateCohortGroup(payload, uuid): Observable<any> {
    if (!payload) {
      return null;
    }
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });
    const url = this.getOpenMrsBaseUrl() + '/cohort/' + uuid;
    return this.http.post(url, JSON.stringify(payload), options).pipe(
      map((response: Response) => {
        return response.json();
      }));

  }

  public activateGroup(uuid: any): any {
    const body = {
      endDate: null,
      voided: 0
    };
    const url = this.getOpenMrsBaseUrl() + `/cohort/${uuid}`;
    return this.http.post(url, body).pipe(
      map((response: Response) => response.json())
    );
  }

  public startGroupVisit(payload): any {
    const url = this.getCohortVisitUrl();
    return this.http.post(url, payload).pipe(
      map((response) => response.json())
    );
  }

  public startIndividualVisit(payload): any {
    const url =  this.getOpenMrsBaseUrl() + `/cohortmembervisit`
    return this.http.post(url, payload).pipe(
      map((response) => response.json())
    );
  }

  public getGroupsByLandmark(landmark: string) {
    const params = new URLSearchParams();
    params.set('attributes', `"landmark":"${landmark}"`);
    params.set('v', this.v);
    const url = this.getOpenMrsBaseUrl() + '/cohort';
    return this.http.get(url, {
      search: params
    })
      .pipe(
        map((response) => response.json().results)
      );
  }
}
