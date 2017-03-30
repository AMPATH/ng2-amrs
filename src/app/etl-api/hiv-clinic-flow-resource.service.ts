import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs/Observable';
import { DataCacheService } from '../shared/services/data-cache.service';
import { ClinicFlowResource } from './clinic-flow-resource-interface';

@Injectable()
export class HivClinicFlowResourceService implements ClinicFlowResource {
    constructor(protected http: Http,
        protected appSettingsService: AppSettingsService,
        private cacheService: DataCacheService) { }

    getUrl(reportName): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
    }

    getClinicFlow(dateStarted, locations) {
        let urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('dateStarted', dateStarted);
        urlParams.set('locationUuids', locations);
        let url = this.getUrl('patient-flow-data');
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json();
            });
        // clear cache after 1 minute
        let refreshCacheTime = 1 * 60 * 1000;
        return this.cacheService.cacheSingleRequest(url, urlParams, request, refreshCacheTime);

    }



}
