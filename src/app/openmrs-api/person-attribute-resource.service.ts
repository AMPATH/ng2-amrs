import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class PersonAttributeResourceService {
  public v = 'full';
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}
  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'person';
  }

  public getPersonAttributesByUuid(
    personUuid: string,
    cached: boolean = false,
    v: string = null
  ): Observable<any> {
    let url = this.getUrl();
    url += '/' + personUuid + '/attribute';

    const params: HttpParams = new HttpParams().set(
      'v',
      v && v.length > 0 ? v : this.v
    );
    return this.http.get(url, {
      params: params
    });
  }

  public createPersonAttribute(personUuid: string, payload: any) {
    if (!payload || !personUuid) {
      return null;
    }
    const url = this.getUrl() + '/' + personUuid + '/attribute';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public updatePersonAttribute(
    personUuid: string,
    payload: any,
    attributeUuid: string
  ) {
    if (!payload || !personUuid) {
      return null;
    }
    const url =
      this.getUrl() + '/' + personUuid + '/attribute/' + attributeUuid;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
