import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';

import { AppSettingsService } from '../app-settings';

@Injectable()
export class CohortMemberResourceService {

    public baseOpenMrsUrl: string = this.getOpenMrsBaseUrl();

    constructor(private _http: Http , private _appSettingsService: AppSettingsService) {
    }

    public getOpenMrsBaseUrl(): string {

        return this._appSettingsService.getOpenmrsRestbaseurl().trim();
    }

    // Fetch all non-retired

    public getAllCohortMembers(parentUuid): Observable <any> {

         if (!parentUuid) {
            return null;
          }

         let allCohortMembersUrl: string = this.baseOpenMrsUrl + 'cohort/' + parentUuid + '/member';

         return this._http.get(allCohortMembersUrl)
           .map((response) => {
               return response.json().results;
           });
    }

    // Fetch specific Cohort

    public getCohortMember(parentUuid, uuid): Observable <any> {

         if (!parentUuid || !uuid) {
            return null;
          }

         let cohortUrl = this.baseOpenMrsUrl + 'cohort/' + parentUuid + '/member/' + uuid;

         console.log(cohortUrl);
         let headers = new Headers({ 'Content-Type': 'application/json' });
         let options = new RequestOptions({ headers: headers });
         return this._http.get(cohortUrl , options)
            .map((response: Response) => {
                return response.json();
            });

    }

    // Add Cohort member
    public addCohortMember(parentUuid, payload): Observable <any> {

         if (!payload || !parentUuid) {
            return null;
          }

         let addCohortUrl: string = this.baseOpenMrsUrl + 'cohort/' + parentUuid + '/member';
         let headers = new Headers({ 'Content-Type': 'application/json' });
         let options = new RequestOptions({ headers: headers });
         return this._http.post(addCohortUrl , JSON.stringify(payload), options)
            .map((response: Response) => {
                return response.json();
            });

    }

    // Retire/Void Cohort

    public retireCohortMember(parentUuid , uuid ): Observable<any> {

         if (!uuid || !parentUuid) {
            return null;
          }

         let retireRestUrl = 'cohort/' + parentUuid + '/member/' + uuid + '?!purge';

         let retireCohortUrl: string = this.baseOpenMrsUrl + retireRestUrl;

         let headers = new Headers({ 'Content-Type': 'application/json' });
         let options = new RequestOptions({ headers: headers });

         return this._http.delete(retireCohortUrl , options)
                .map((response) => {
                    return response.json();
                });

    }

}
