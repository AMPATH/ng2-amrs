
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()

export class PersonResourceService {
  public v = 'full';
  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService) {
  }
  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'person';
  }

  public getPersonByUuid(uuid: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;

    const params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params: params
    });
  }

  public saveUpdatePerson(uuid, payload) {
    if (!payload || !uuid) {
      return null;
    }
    const url = this.getUrl() + '/' + uuid;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), {headers}).pipe(
      map((response: any) => {
        return response.person;
      }));
  }
}
