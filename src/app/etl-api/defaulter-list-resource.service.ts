import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs/Observable';
import { DataCacheService } from '../shared/services/data-cache.service';
@Injectable()
export class DefaulterListResourceService {
    constructor(protected http: Http,
        protected appSettingsService: AppSettingsService,
        private cacheService: DataCacheService) { }

    getUrl(reportName): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
    }

    getDefaulterList(params) {
        let urlParams: URLSearchParams = new URLSearchParams();
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('defaulterPeriod', params.defaulterPeriod);
        urlParams.set('maxDefaultPeriod', params.maxDefaultPeriod);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        let url = this.getUrl('defaulter-list');
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });
        this.cacheService.cacheRequest(url, urlParams, request);
        return request;

    }



}
