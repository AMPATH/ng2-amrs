import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()

export class PersonResourceService {
  public v: string = 'full';
  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }
  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'person';
  }

  public getPersonByUuid(uuid: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }

  public saveUpdatePerson(uuid, payload) {
    if (!payload || !uuid) {
      return null;
    }
    let url = this.getUrl() + '/' + uuid;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json().person;
      });
  }
}
