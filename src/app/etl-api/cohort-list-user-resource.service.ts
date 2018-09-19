
import {map} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response, Headers, RequestOptions } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';

@Injectable()
export class CohortUserResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) { }
  public getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort';
  }
  public getCohortUser(cohortUuid: string): Observable<any> {
    if (!cohortUuid) {
      return null;
    }
    let url = this.getUrl();
    url += '/' + cohortUuid + '/cohort-users';
    let params: URLSearchParams = new URLSearchParams();

    return this.http.get(url, {
      search: params
    }).pipe(map((response: Response) => {
      return response.json();
    }));
  }
  public voidCohortUser(cohortUserId) {
    let url = this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-user';
    url += '/' + cohortUserId ;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(url, options).pipe(
      map(( response) => {
        return response;
      }));

  }
  public createCohortUser(payload) {
    let url = this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-user';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options).pipe(
      map((response: Response) => {
        return response.json();
      }));

  }
  public updateCohortUser(cohortUserId,  payload) {
    let url = this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-user';
    url += '/' + cohortUserId ;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options).pipe(
      map((response: Response) => {
        return response.json();
      }));

  }
}
