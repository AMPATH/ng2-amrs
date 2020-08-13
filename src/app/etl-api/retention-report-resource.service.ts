
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class RetentionReportResourceService {
    constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) { }

    public getUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
          + 'retention-summary-report';

    }

    public getPatientListUrl(): string {
        return this.getUrl() + '/patient-list';
    }
    public getIndicatorUrl(): string {
        return this.getUrl() + '/indicator-definitions';
    }

    public getUrlRequestParams(params): HttpParams {
        let urlParams: HttpParams = new HttpParams();

        if (params.indicators && params.indicators !== '') {
            urlParams = urlParams.set('indicators', params.indicators);
        }
        if (params.endDate && params.endDate !== '') {
            urlParams = urlParams.set('endDate', params.endDate);
        }
        if (params.startDate && params.startDate !== '') {
            urlParams = urlParams.set('startDate', params.startDate);
        }
        if (params.gender && params.gender.length > 0) {
            urlParams = urlParams.set('genders', params.gender);
        }
        if (params.period && params.period.length > 0) {
            urlParams = urlParams.set('period', params.period);
        }
        if (params.startAge && params.startAge !== '') {
           urlParams =  urlParams.set('startAge', params.startAge);
        }
        if (params.endAge && params.endAge !== '') {
            urlParams = urlParams.set('endAge', params.endAge);
        }
        if (params.locationUuids && params.locationUuids !== '') {
           urlParams = urlParams.set('locationUuids', params.locationUuids);
        }
        if (params.report && params.report !== '') {
            urlParams = urlParams.set('report', params.report);
         }

        return urlParams;
    }

    public getRetentionIndicatorDefinitions() {

        const url = this.getIndicatorUrl();
        const request =  this.http.get(url);

        return this.cacheService.cacheRequest(url, {} , request);

    }

    public getRetentionReport(params) {
        const urlParams = this.getUrlRequestParams(params);
        const url = this.getUrl();
        const request =  this.http.get(url, {
            params: urlParams
        });

        return this.cacheService.cacheRequest(url, urlParams, request);

    }

    public getRetentionReportPatientList(params) {
        const urlParams = this.getUrlRequestParams(params);
        const url = this.getPatientListUrl();
        const request = this.http.get(url, {
            params: urlParams
        });

        return this.cacheService.cacheRequest(url, urlParams, request);
    }
}
