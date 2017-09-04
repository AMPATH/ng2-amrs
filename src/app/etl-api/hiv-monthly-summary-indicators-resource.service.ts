import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';
@Injectable()
export class HivMonthlySummaryIndicatorsResourceService {
    constructor(protected http: Http, protected appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) { }

    public getUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
         + `hiv-monthly-summary-indicators`;
    }

    public getPatientListUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
            + `hiv-monthly-summary-indicators/patient-list`;
    }

    public getUrlRequestParams(params): URLSearchParams {
        let urlParams: URLSearchParams = new URLSearchParams();

        if (params.indicators) {
            urlParams.set('indicators', params.indicators);
        }

        if (params.indicator) {
            urlParams.set('indicator', params.indicator);
        }

        urlParams.set('endDate', params.endDate);
        urlParams.set('gender', params.gender);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('startAge', params.startAge);
        urlParams.set('endAge', params.endAge);

        return urlParams;
    }

    public getHivSummaryMonthlyIndicatorsReport(params) {
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

    public getHivSummaryMonthlyIndicatorsPatientList(params) {
        let urlParams = this.getUrlRequestParams(params);
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('limit', params.limit);
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
