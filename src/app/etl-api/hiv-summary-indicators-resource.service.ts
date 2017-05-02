import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
@Injectable()
export class HivSummaryIndicatorsResourceService {
    constructor(protected http: Http, protected appSettingsService: AppSettingsService,
        private cacheService: DataCacheService) { }

    getUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + `hiv-summary-indicators`;
    }

    getPatientListUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
            + `hiv-summary-indicators/patient-list`;
    }

    getUrlRequestParams(params): URLSearchParams {
        let urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('endDate', params.endDate);
        urlParams.set('gender', params.gender);
        urlParams.set('startDate', params.startDate);
        urlParams.set('indicator', params.indicator || params.indicators);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('startAge', params.startAge);
        urlParams.set('endAge', params.endAge);

        return urlParams;
    }

    getHivSummaryIndicatorsReport(params) {
        let urlParams = this.getUrlRequestParams(params);
        let url = this.getUrl();
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json();
            });

        return this.cacheService.cacheRequest(url, urlParams, request);

    }

    getHivSummaryIndicatorsPatientList(params) {
        let urlParams = this.getUrlRequestParams(params);
        let url = this.getPatientListUrl();
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
