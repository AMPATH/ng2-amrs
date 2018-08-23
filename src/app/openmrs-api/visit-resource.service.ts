import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AppSettingsService } from '../app-settings';

@Injectable()
export class VisitResourceService {

    constructor(private http: Http, private appSettingsService: AppSettingsService) { }

    public getVisitByUuid(uuid: string, searchParams): Observable<any> {
        if (!uuid || !searchParams) {
            return null;
        }
        const params = new URLSearchParams();
        params.set('v', searchParams.v);
        return this.http
            .get(`${this.getUrl()}/${uuid}`, {
                search: params
            })
            .map(this.parseVisitResponse)
            .catch(this.handleError);
    }

    public getPatientVisits(searchParams) {
        if (!searchParams) {
            return null;
        }
        const custom = 'custom:(uuid,encounters:(uuid,encounterDatetime,' +
            'form:(uuid,name),location:ref,' +
            'encounterType:ref,encounterProviders:(uuid,display,' +
            'provider:(uuid,display))),patient:(uuid,uuid),' +
            'visitType:(uuid,name),attributes:(uuid,display,value),location:ref,startDatetime,' +
            'stopDatetime)';
        const params = new URLSearchParams();
        params.set('v', searchParams.v || custom);
        params.set('patient', searchParams.patientUuid);
        return this.http
            .get(`${this.getUrl()}`, {
                search: params
            })
            .map(this.parseVisitsResponse)
            .catch(this.handleError);
    }

    public getVisitTypes(searchParams) {
        if (!searchParams) {
            return null;
        }
        return this.http
            .get(`${this.appSettingsService.getOpenmrsRestbaseurl().trim()}visittype`, {
            })
            .map(this.parseVisitTypesResponse)
            .catch(this.handleError);
    }

    public saveVisit(payload) {
        if (!payload) {
            return null;
        }
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers });
        return this.http.post(`${this.getUrl()}`, payload, options)
            .map(this.parseVisitResponse)
            .catch(this.handleError);
    }

    public updateVisit(uuid, payload) {
        if (!payload || !uuid) {
            return null;
        }
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers });
        return this.http.post(`${this.getUrl()}/${uuid}`, payload, options)
            .map(this.parseVisitResponse)
            .catch(this.handleError);
    }

    public getVisitEncounters(uuid) {
        if (!uuid) {
            return null;
        }
        const custom = 'custom:(encounters:(obs,uuid,patient:(uuid,uuid),' +
            'encounterDatetime,form:(uuid,name),encounterType:(uuid,name),' +
            'encounterProviders:(uuid,uuid,provider:(uuid,name),' +
            'encounterRole:(uuid,name)),location:(uuid,name),' +
            'visit:(uuid,visitType:(uuid,name))))';
        const params = new URLSearchParams();
        params.set('v', custom);
        return this.http
            .get(`${this.getUrl()}/${uuid}`, {
                search: params
            })
            .map(this.parseVisitEncounters)
            .catch(this.handleError);
    }
    private getUrl() {
        return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'visit';
    }
    private parseVisitResponse(res: any): any {
        const body = res.json();
        const result: any = body;

        return result;
    }

    private parseVisitEncounters(res: any): any {
        const body = res.json();
        const result = body.encounters;
        return result;
    }
    private parseVisitTypesResponse(res: any): any {
        const body = res.json();
        const result = body.results;
        return result;
    }

    private parseVisitsResponse(res: any): any {
        const body = res.json();
        const result = body.results;
        return result;
    }

    private handleError(error: any) {
        return Observable.throw(error.message
            ? error.message
            : error.status
                ? `${error.status} - ${error.statusText}`
                : 'Server Error');
    }
}
