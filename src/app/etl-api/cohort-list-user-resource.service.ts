import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CohortUserResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}
  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort';
  }
  public getCohortUser(cohortUuid: string): Observable<any> {
    if (!cohortUuid) {
      return null;
    }
    let url = this.getUrl();
    url += '/' + cohortUuid + '/cohort-users';
    return this.http.get(url);
  }
  public voidCohortUser(cohortUserId) {
    let url =
      this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-user';
    url += '/' + cohortUserId;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(url, { headers });
  }
  public createCohortUser(payload) {
    const url =
      this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-user';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, JSON.stringify(payload), { headers });
  }
  public updateCohortUser(cohortUserId, payload) {
    let url =
      this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-user';
    url += '/' + cohortUserId;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers });
  }
}
