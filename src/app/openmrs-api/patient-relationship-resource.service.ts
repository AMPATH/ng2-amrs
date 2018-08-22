
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class PatientRelationshipResourceService {

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'relationship';
  }

  public getPatientRelationships(uuid: string): Observable<any> {

    let url = this.getUrl();
    let v: string = 'full';

    if (!uuid) {
      return null;
    }

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', v);
    params.set('person', uuid);

    return this.http.get(url, {
      search: params
    }).pipe(map((response: Response) => {
      return response.json().results;
    }));
  }

  public saveRelationship(payload) {
    if (!payload) {
      return null;
    }
    let url = this.getUrl();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, payload, options).pipe(
      map((response: Response) => {
        return response.json();
      }));
  }

  public updateRelationship(uuid, payload) {
    if (!payload || !uuid) {
      return null;
    }
    let url = this.getUrl() + '/' + uuid;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, payload, options).pipe(
      map((response: Response) => {
        return response.json();
      }));
  }

  public deleteRelationship(uuid) {
    if (!uuid) {
      return null;
    }
    let url = this.getUrl() + '/' + uuid;
    return this.http.delete(url, {});
  }

}
