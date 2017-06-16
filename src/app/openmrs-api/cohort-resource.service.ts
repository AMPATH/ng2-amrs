import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';


@Injectable()
export class CohortResourceService {

    baseOpenMrsUrl: string = this.getOpenMrsBaseUrl();


    constructor(private _http: Http , private _appSettingsService: AppSettingsService) {
    }


    getOpenMrsBaseUrl(): string {

        return this._appSettingsService.getOpenmrsRestbaseurl().trim();
    }

    getAllCohorts(): Observable <any> {

        let allCohortsUrl: string = this.baseOpenMrsUrl + 'cohort';

       return this._http.get(allCohortsUrl)
           .map((response) => {
               return response.json().results;
           });
    }

    // Fetch specific Cohort

    getCohort(uuid): Observable <any> {

         if (!uuid) {
            return null;
           }

        let cohortUrl = this.baseOpenMrsUrl + 'cohort/' + uuid;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(cohortUrl , options)
            .map((response: Response) => {
                return response.json();
            });

    }

    // Add Cohorts
    addCohort(payload): Observable <any> {

         if (!payload) {
            return null;
            }

        let addCohortUrl: string = this.baseOpenMrsUrl + 'cohort';

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(addCohortUrl , JSON.stringify(payload), options)
            .map((response: Response) => {
                return response.json();
            });

    }

    // Edit Cohort

    editCohort(uuid , payload): Observable <any> {

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

    retireCohort(uuid): Observable<any> {

         if (!uuid) {
            return null;
        }

        let deleteCohortUrl: string = this.baseOpenMrsUrl + 'cohort/' + uuid + '?!purge';

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.delete(deleteCohortUrl , options)
                .map((response) => {
                    return response.json();
                });

    }



}
