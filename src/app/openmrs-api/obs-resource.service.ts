import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class ObsResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService) { }

  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  public saveObs(payload): any {
    if (!payload) {
      return null;
    }
    const url = this.getUrl() + 'obs';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers });
  }

  public updateObs(uuid, payload): any {
    if (!payload || !uuid) {
      return null;
    }
    const url = this.getUrl() + 'obs/' + uuid;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers });
  }

  public voidObs(uuid): any {
    if (!uuid) {
      return null;
    }
    const url = this.getUrl() + 'obs/' + uuid + '?!purge';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(url, { headers });
  }

  public deleteObs(uuid): any {
    if (!uuid) {
      return null;
    }
    const url = this.getUrl() + 'obs/' + uuid + '?purge';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(url, { headers });
  }

  public getObsPatientObsByConcept(uuid, conceptUuuid): Observable<any> {
    const url = this.getUrl() + 'obs';
    const params = new HttpParams().set('patient', uuid).set('concept', conceptUuuid).set('v', 'full');
    return this.http.get(url, { params: params });
  }

  public getObsPatientObsByOrder(uuid): Observable<any> {
    const url = this.getUrl() + 'obs';
    const params = new HttpParams().set('patient', uuid).set('v', 'full');
    return this.http.get(url, { params: params });
  }
}
