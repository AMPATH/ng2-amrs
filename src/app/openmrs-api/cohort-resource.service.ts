import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class CohortResourceService {

    public baseOpenMrsUrl: string = this.getOpenMrsBaseUrl();
    private v: string = 'full';

    constructor(private _http: Http, private _appSettingsService: AppSettingsService) {
    }

    public getOpenMrsBaseUrl(): string {

        return this._appSettingsService.getOpenmrsRestbaseurl().trim();
    }

    public getAllCohorts(): Observable<any> {
        let params = new URLSearchParams();
        params.set('v', 'full');

        let allCohortsUrl: string = this.baseOpenMrsUrl + 'cohort';

        // let request =
        return this._http.get(allCohortsUrl,
            {
                search: params
            })
            .map((response) => {
                return response.json();
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
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(cohortUrl, options)
            .map((response: Response) => {
                return response.json();
            });

    }

    // Add Cohorts
    public addCohort(payload): Observable<any> {

        if (!payload) {
            return null;
        }

        let addCohortUrl: string = this.baseOpenMrsUrl + 'cohort';

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(addCohortUrl, JSON.stringify(payload), options)
            .map((response: Response) => {
                return response.json();
            });

    }

    // Edit Cohort

    public editCohort(uuid, payload): Observable<any> {

        if (!uuid) {
            return null;
        }

        let editCohortUrl: string = this.baseOpenMrsUrl + 'cohort/' + uuid;

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(editCohortUrl, JSON.stringify(payload), options)
            .map((response: Response) => {
                return response.json();
            });

    }

    // Retire/Void Cohort

    public retireCohort(uuid): Observable<any> {

        if (!uuid) {
            return null;
        }

        let deleteCohortUrl: string = this.baseOpenMrsUrl + 'cohort/' + uuid + '?!purge';

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.delete(deleteCohortUrl, options)
            .map((response) => {
                return response.json();
            });

    }

}
