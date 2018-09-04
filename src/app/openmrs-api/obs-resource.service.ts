import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ObsResourceService {

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) { }
  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  public saveObs(payload) {
    console.log('payload', payload);
    if (!payload) {
      return null;
    }
    let url = this.getUrl() + 'obs';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json();
      });
  }

  public updateObs(uuid, payload) {
    if (!payload || !uuid) {
      return null;
    }
    let url = this.getUrl() + 'obs/' + uuid;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json();
      });
  }

  public voidObs(uuid) {
    if (!uuid) {
      return null;
    }
    let url = this.getUrl() + 'obs/' + uuid + '?!purge';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(url, new RequestOptions({
      headers: headers
    }));
  }

}
