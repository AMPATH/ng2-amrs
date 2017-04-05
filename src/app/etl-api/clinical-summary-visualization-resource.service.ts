import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import * as _ from 'lodash';
import { DataCacheService } from '../shared/services/data-cache.service';
@Injectable()
export class ClinicalSummaryVisualizationResourceService {
    constructor(protected http: Http, protected appSettingsService: AppSettingsService,
        private cacheService: DataCacheService) { }

    getUrl(reportName): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}`;
    }

    getPatientListUrl(reportName): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}/patient-list`;
    }

    getUrlRequestParams(params): URLSearchParams {
        let urlParams: URLSearchParams = new URLSearchParams();
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('endDate', params.endDate);
        urlParams.set('gender', params.gender);
        urlParams.set('startDate', params.startDate);
        urlParams.set('groupBy', params.groupBy);
        urlParams.set('indicator', params.indicator || params.indicators);
        urlParams.set('order', params.order);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        return urlParams;
    }

    getHivComparativeOverviewReport(params) {
        let urlParams = this.getUrlRequestParams(params);
        let url = this.getUrl('clinical-hiv-comparative-overview');
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });

        return this.cacheService.cacheRequest(url, urlParams, request);

    }

    getReportOverviewPatientList(reportName: string, params: any) {
      let urlParams = this.getUrlRequestParams(params);
      let url = this.getPatientListUrl(reportName);
      let request = this.http.get(url, {
        search: urlParams
      })
        .map((response: Response) => {
          return response.json().result;
        });

      return this.cacheService.cacheRequest(url, urlParams, request);
    }

    getHivComparativeOverviewPatientList(params) {
        let urlParams = this.getUrlRequestParams(params);
        let url = this.getPatientListUrl('clinical-hiv-comparative-overview');
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });

        this.cacheService.cacheRequest(url, urlParams, request);
        return request;
    }

    getArtOverviewReport(params) {
        let urlParams = this.getUrlRequestParams(params);
        let url = this.getUrl('clinical-art-overview');
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });

        return this.cacheService.cacheRequest(url, urlParams, request);
    }

    getArtOverviewReportPatientList(params) {
        let urlParams = this.getUrlRequestParams(params);
        let url = this.getPatientListUrl('clinical-art-overview');
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });

        return this.cacheService.cacheRequest(url, urlParams, request);
    }

    getPatientCareStatusReport(params) {
        let urlParams = this.getUrlRequestParams(params);
        let url = this.getUrl('clinical-patient-care-status-overview');
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json();
            });

        return this.cacheService.cacheRequest(url, urlParams, request);
    }

    getPatientCareStatusReportList(params) {
        let urlParams = this.getUrlRequestParams(params);
        let url = this.getPatientListUrl('clinical-patient-care-status-overview');
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });

      return this.cacheService.cacheRequest(url, urlParams, request);
    }

}
