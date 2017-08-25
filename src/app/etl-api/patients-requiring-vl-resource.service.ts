import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class PatientsRequiringVLResourceService {

    constructor(private _http: Http, private appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) {
    }

    public geturl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim();
    }

    public getPatientList(startDate: string, endDate: string, locationUuids: string,
                          startIndex?: string, limit?: string): Observable<any> {
        let api: string = this.geturl() + 'patients-requiring-viral-load-order';

        let urlParams: URLSearchParams = new URLSearchParams();
        if (!startIndex) {
            startIndex = '0';
        }
        if (!limit) {
            limit = '100000';
        }
        urlParams.set('startDate', startDate);
        urlParams.set('endDate', endDate);
        urlParams.set('locationUuids', locationUuids);
        urlParams.set('startIndex', startIndex);
        urlParams.set('limit', limit);

        let request = this._http.get(api, { search: urlParams }).map((data) => data.json());
        return this.cacheService.cacheRequest(api, urlParams, request);

    }

}
