import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class EncounterResourceService {
    v: string = 'custom:(uuid,encounterDatetime,' +
    'patient:(uuid,uuid),form:(uuid,name),' +
    'visit:(uuid,startDatetime,stopDatetime),' +
    'location:ref,encounterType:ref,provider:ref)';

    constructor(protected http: Http, protected appSettingsService: AppSettingsService) { }
    getUrl(): string {

        return this.appSettingsService.getOpenmrsRestbaseurl().trim();
    }

    getEncountersByPatientUuid(patientUuid: string, cached: boolean = false,
        v: string = null): Observable<any> {
        if (!patientUuid) {
            return null;
        }
        let url = this.getUrl() + 'encounter';
        const params = new URLSearchParams();
        params.set('patient', patientUuid);
        params.set('v', this.v);

        return this.http.get(url, {
            search: params
        }).map((response: Response) => {
            return response.json().results;
        });
    }
    getEncounterByUuid(uuid: string): Observable<any> {
        if (!uuid) {
            return null;
        }
        let _customDefaultRep = 'custom:(uuid,encounterDatetime,' +
            'patient:(uuid,uuid,identifiers),form:(uuid,name),' +
            'visit:(uuid,startDatetime,stopDatetime),' +
            'location:ref,encounterType:ref,provider:ref,orders:full,' +
            'obs:(uuid,obsDatetime,concept:(uuid,uuid,name:(display)),value:ref,groupMembers))';
        let params = new URLSearchParams();
        params.set('v', _customDefaultRep);
        let url = this.getUrl() + 'encounter/' + uuid;
        return this.http.get(url, { search: params }).map((response: Response) => {
            return response.json();
        });
    }
    getEncounterTypes(v: string) {
        if (!v) {
            return null;
        }
        let url = this.getUrl() + 'encountertype';
        return this.http.get(url).map((response: Response) => {
            return response.json().encountertype;
        });
    }

    saveEncounter(payload) {
        if (!payload) {
            return null;
        }
        let url = this.getUrl() + 'encounter';
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, JSON.stringify(payload), options)
            .map((response: Response) => {
                return response.json();
            });
    }

    updateEncounter(uuid, payload) {
        if (!payload || !uuid) {
            return null;
        }
        let url = this.getUrl() + 'encounter/' + uuid;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, JSON.stringify(payload), options)
            .map((response: Response) => {
                return response.json();
            });
    }
}
