import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ObsResourceService {

  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService) { }
  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  public saveObs(payload) {
    console.log('payload', payload);
    if (!payload) {
      return null;
    }
    const url = this.getUrl() + 'obs';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), {headers});
  }

  public updateObs(uuid, payload) {
    if (!payload || !uuid) {
      return null;
    }
    const url = this.getUrl() + 'obs/' + uuid;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), {headers});
  }

  public voidObs(uuid) {
    if (!uuid) {
      return null;
    }
    const url = this.getUrl() + 'obs/' + uuid + '?!purge';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(url, {headers});
  }

}
