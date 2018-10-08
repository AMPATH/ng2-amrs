
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable()
export class PatientStatusVisualizationResourceService {
    constructor(private http: HttpClient, protected appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) {
    }

    public getAggregates(options: {
        startIndex?: string, limit?: string,
        startDate: string, endDate: string, locationUuids: string,
        analysis: string
    }): Observable<any> {
          const api: string = this.appSettingsService.getEtlServer() +
            '/patient-status-change-tracking';
          const params: HttpParams = this.getUrlRequestParams(options);
          const request =  this.http.get(api, { params: params });
          return this.cacheService.cacheRequest(api, params, request);

    }

    public getPatientList(options: {
        startIndex?: string, limit?: string, analysis: string,
        startDate: string, endDate: string, locationUuids: string, indicator: string
    }): Observable<any> {
        const api: string = this.appSettingsService.getEtlServer() +
            '/patient-status-change-tracking/patient-list';

        const params: HttpParams = this.getUrlPatientListRequestParams(options);
        const request = this.http.get(api, { params: params });
        return this.cacheService.cacheRequest(api, params, request);

    }

    private getUrlRequestParams(options: {
        startIndex?: string, limit?: string, analysis: string,
        startDate: string, endDate: string, locationUuids: string
    }): HttpParams {
        if (!options.startIndex) {
            options.startIndex = '0';
        }
        if (!options.limit) {
            options.limit = '300';
        }
        const urlParams: HttpParams = new HttpParams()
        .set('startDate', options.startDate)
        .set('analysis', options.analysis)
        .set('endDate', options.endDate)
        .set('locationUuids', options.locationUuids);
        return urlParams;
    }

    private getUrlPatientListRequestParams(options: {
        startIndex?: string, limit?: string, analysis: string,
        startDate: string, endDate: string, locationUuids: string,
        indicator: string
    }): HttpParams {
        if (!options.startIndex) {
            options.startIndex = '0';
        }
        if (!options.limit) {
            options.limit = '300';
        }
        const urlParams: HttpParams = new HttpParams()
        .set('startDate', options.startDate)
        .set('endDate', options.endDate)
        .set('locationUuids', options.locationUuids)
        .set('indicator', options.indicator)
        .set('startIndex', options.startIndex)
        .set('analysis', options.analysis)
        .set('limit', options.limit);
        return urlParams;
    }
}
