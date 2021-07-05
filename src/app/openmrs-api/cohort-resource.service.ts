import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CohortResourceService {
  public baseOpenMrsUrl: string = this.getOpenMrsBaseUrl();
  private v = 'full';

  constructor(
    private _http: HttpClient,
    private _appSettingsService: AppSettingsService
  ) {}

  public getOpenMrsBaseUrl(): string {
    return this._appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  public getAllCohorts(): Observable<any> {
    const params = new HttpParams().set('v', 'full');

    const allCohortsUrl: string = this.baseOpenMrsUrl + 'cohort';

    // let request =
    return this._http.get(allCohortsUrl, {
      params: params
    });
    // return this.cacheService.cacheRequest(allCohortsUrl, params, request);
  }

  // Fetch specific Cohort

  public getCohort(uuid, v?: string): Observable<any> {
    if (!uuid) {
      return null;
    }

    let cohortUrl = this.baseOpenMrsUrl + 'cohort/' + uuid;

    if (v) {
      cohortUrl = cohortUrl + '?v=' + v;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(cohortUrl, { headers });
  }

  // Add Cohorts
  public addCohort(payload): Observable<any> {
    if (!payload) {
      return null;
    }

    const addCohortUrl: string = this.baseOpenMrsUrl + 'cohort';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.post(addCohortUrl, JSON.stringify(payload), { headers });
  }

  // Edit Cohort

  public editCohort(uuid, payload): Observable<any> {
    if (!uuid) {
      return null;
    }

    const editCohortUrl: string = this.baseOpenMrsUrl + 'cohort/' + uuid;

    return this._http.post(editCohortUrl, JSON.stringify(payload));
  }

  // Retire/Void Cohort

  public retireCohort(uuid): Observable<any> {
    if (!uuid) {
      return null;
    }

    const deleteCohortUrl: string =
      this.baseOpenMrsUrl + 'cohort/' + uuid + '?!purge';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.delete(deleteCohortUrl, { headers });
  }
}
