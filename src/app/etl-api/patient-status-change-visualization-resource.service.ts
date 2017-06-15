import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class PatientStatusVisualizationResourceService {
    constructor(private http: Http, protected appSettingsService: AppSettingsService,
     private cacheService: DataCacheService) {
    }

    public getAggregates(options: {
        startIndex?: string, limit?: string,
        startDate: string, endDate: string, locationUuids: string,
        analysis: string
    }): Observable<any> {
          console.log('====', options);
        let api: string = this.appSettingsService.getEtlServer() +
            '/patient-status-change-tracking';
        let params: URLSearchParams = this.getUrlRequestParams(options);
        let request =  this.http.get(api, { search: params }).map((data) => data.json());
        return this.cacheService.cacheRequest(api, params, request);

    }

    public getPatientList(options: {
        startIndex?: string, limit?: string, analysis: string,
        startDate: string, endDate: string, locationUuids: string, indicator: string
    }): Observable<any> {
        let api: string = this.appSettingsService.getEtlServer() +
            '/patient-status-change-tracking/patient-list';

        let params: URLSearchParams = this.getUrlPatientListRequestParams(options);
        let request = this.http.get(api, { search: params }).map((data) => data.json());
        return this.cacheService.cacheRequest(api, params, request);

    }

    private getUrlRequestParams(options: {
        startIndex?: string, limit?: string, analysis: string,
        startDate: string, endDate: string, locationUuids: string
    }): URLSearchParams {
        let urlParams: URLSearchParams = new URLSearchParams();
        if (!options.startIndex) {
            options.startIndex = '0';
        }
        if (!options.limit) {
            options.limit = '300';
        }
        urlParams.set('startDate', options.startDate);
        urlParams.set('analysis', options.analysis);
        urlParams.set('endDate', options.endDate);
        urlParams.set('locationUuids', options.locationUuids);
        return urlParams;
    }

    private getUrlPatientListRequestParams(options: {
        startIndex?: string, limit?: string, analysis: string,
        startDate: string, endDate: string, locationUuids: string,
        indicator: string
    }): URLSearchParams {
        let urlParams: URLSearchParams = new URLSearchParams();
        if (!options.startIndex) {
            options.startIndex = '0';
        }
        if (!options.limit) {
            options.limit = '300';
        }
        urlParams.set('startDate', options.startDate);
        urlParams.set('endDate', options.endDate);
        urlParams.set('locationUuids', options.locationUuids);
        urlParams.set('indicator', options.indicator);
        urlParams.set('startIndex', options.startIndex);
        urlParams.set('analysis', options.analysis);
        urlParams.set('limit', options.limit);
        return urlParams;
    }
}
