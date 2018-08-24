import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';
@Injectable()
export class OncolgyMonthlySummaryIndicatorsResourceService {
    constructor(protected http: Http, protected appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) { }

    public getUrl(params: any): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
          + params.type;

    }

    public getPatientListUrl(params): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
            + params.type + '-patient-list';
    }

    public getUrlRequestParams(params): URLSearchParams {
        let urlParams: URLSearchParams = new URLSearchParams();

        if (params.indicators && params.indicators !== '') {
            urlParams.set('indicators', params.indicators);
        }
        if (params.endDate && params.endDate !== '') {
            urlParams.set('endDate', params.endDate);
        }
        if (params.startDate && params.startDate !== '') {
            urlParams.set('startDate', params.startDate);
        }
        if (params.gender && params.gender.length > 0) {
            urlParams.set('genders', params.gender);
        }
        if (params.startAge && params.startAge !== '') {
            urlParams.set('startAge', params.startAge);
        }
        if (params.endAge && params.endAge !== '') {
            urlParams.set('endAge', params.endAge);
        }
        if (params.locationUuids && params.locationUuids !== '') {
            urlParams.set('locationUuids', params.locationUuids);
        }

        return urlParams;
    }

    public getOncologySummaryMonthlyIndicatorsReport(params) {
        let urlParams = this.getUrlRequestParams(params);
        let url = this.getUrl(params);
        let request =  this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json();
            });

        return this.cacheService.cacheRequest(url, urlParams, request);

    }

    public getOncologySummaryMonthlyIndicatorsPatientList(params) {
        let urlParams = this.getUrlRequestParams(params);
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '1000';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('limit', params.limit);
        let url = this.getPatientListUrl(params);
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json();
            });

        return this.cacheService.cacheRequest(url, urlParams, request);
    }
}
