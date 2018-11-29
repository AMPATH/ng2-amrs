
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class HivMonthlySummaryIndicatorsResourceService {
    constructor(private http: HttpClient, private appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) { }

    public getUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
          + `hiv-summary-monthly-indicators`;

    }

    public getPatientListUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
            + `hiv-summary-monthly-indicators/patient-list`;
    }

    public getUrlRequestParams(params): HttpParams {
        let urlParams: HttpParams = new HttpParams();
        if (params.indicators) {
            urlParams = urlParams.set('indicators', params.indicators);
        }

        if (params.indicator) {
            urlParams = urlParams.set('indicator', params.indicator);
        }

        urlParams.set('endDate', params.endDate)
        .set('gender', params.gender)
        .set('startDate', params.startDate)
        .set('locationUuids', params.locationUuids)
        .set('startAge', params.startAge)
        .set('endAge', params.endAge);

        return urlParams;
    }

    public getHivSummaryMonthlyIndicatorsReport(params) {
        const urlParams = this.getUrlRequestParams(params);
        const url = this.getUrl();
        const request = this.http.get(url, {
            params: urlParams
        });

        return this.cacheService.cacheRequest(url, urlParams, request);

    }

    public getHivSummaryMonthlyIndicatorsPatientList(params) {
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        const urlParams = this.getUrlRequestParams(params)
        .set('startIndex', params.startIndex)
        .set('limit', params.limit);
        const url = this.getPatientListUrl();
        const request = this.http.get(url, {
            params: urlParams
        }).pipe(
            map((response: any) => {
                return response.result;
            }));

        this.cacheService.cacheRequest(url, urlParams, request);
        return request;
    }
}
