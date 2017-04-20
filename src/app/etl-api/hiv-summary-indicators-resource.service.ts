import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class HivSummaryIndicatorsResourceService {
    constructor(protected http: Http,
        protected appSettingsService: AppSettingsService,
        private cacheService: DataCacheService) { }

    getUrl(reportName): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
    }

    getHivSummaryIndicators(locations, startDate, endDate, gender, indicators, limit, startIndex) {
        let urlParams: URLSearchParams = new URLSearchParams();
        if (!startIndex) {
            startIndex = '0';
        }
        if (!limit) {
            limit = '300';
        }

        urlParams.set('endDate', endDate);
        urlParams.set('gender', gender);
        urlParams.set('indicators', indicators);
        urlParams.set('limit', limit);
        urlParams.set('locationUuids', locations);
        urlParams.set('startIndex', startIndex);
        let url = this.getUrl('hiv-summary-indicators');
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
