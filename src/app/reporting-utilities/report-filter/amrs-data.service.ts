
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';


import 'rxjs/add/operator/toPromise';

@Injectable()
export class AmrsDataService {

    private baseUrl = 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/'; //create ng-amr server selector
    private forms = new ReplaySubject(1);
    private locations = new ReplaySubject(1);

    constructor(private http: Http) {

    }

    protected createAuthorizationHeader(): Headers {
        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + 'YWtpbWFpbmE6QWxsYW4xMjM0');  //TODO: do authentication
        return headers;
    }

    /**
     * 
     * 
     * @param {boolean} [forceRefresh]
     * @returns
     * 
     * @memberOf AmrsDataService
     */
    public getLocations(forceRefresh?: boolean) {
        // If the Subject was NOT subscribed before OR if forceRefresh is requested 

        let params = new URLSearchParams();
        params.set('v', 'default');

        if (!this.locations.observers.length || forceRefresh) {
            this.http.get(
                this.baseUrl + 'location',
                {
                    headers: this.createAuthorizationHeader(), //TODO create a base class which extends BaseRequestOptions --> do injection
                    search: params
                }
            )
                .map((res: Response) => res.json())
                .subscribe(
                data => this.locations.next(data.results),
                error => this.locations.error(error)
                );
        }

        return this.locations;
    }

    public getForms(forceRefresh?: boolean) {
        // If the Subject was NOT subscribed before OR if forceRefresh is requested 

        let params = new URLSearchParams();
        params.set('v', 'custom:(uuid,name,encounterType:(uuid,name),version,published,retired,retiredReason,resources:(uuid,name,dataType,valueReference))');
        params.set('q', 'POC');

        if (!this.forms.observers.length || forceRefresh) {
            this.http.get(
                this.baseUrl + 'form',
                {
                    headers: this.createAuthorizationHeader(), //TODO create a base class which extends BaseRequestOptions --> do injection
                    search: params
                }
            )
                .map((res: Response) => res.json())
                .subscribe(
                data => this.forms.next(data.results),
                error => this.forms.error(error)
                );
        }

        return this.forms;
    }
}
