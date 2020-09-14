import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class PatientRelationshipResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return (
      this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'relationship'
    );
  }

  public getPatientRelationships(uuid: string): Observable<any> {
    const url = this.getUrl();
    const v = 'full';

    if (!uuid) {
      return null;
    }

    const params: HttpParams = new HttpParams().set('v', v).set('person', uuid);

    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.results;
        })
      );
  }

  public saveRelationship(payload) {
    if (!payload) {
      return null;
    }
    const url = this.getUrl();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, payload, { headers });
  }

  public updateRelationship(uuid, payload) {
    if (!payload || !uuid) {
      return null;
    }
    const url = this.getUrl() + '/' + uuid;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, payload, { headers });
  }

  public deleteRelationship(uuid) {
    if (!uuid) {
      return null;
    }
    const url = this.getUrl() + '/' + uuid;
    return this.http.delete(url);
  }
}
