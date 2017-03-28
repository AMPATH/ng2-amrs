import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache/ionic-cache';
@Injectable()
export class MonthlyScheduleResourceService {
    constructor(protected http: Http,
                protected appSettingsService: AppSettingsService,
                protected dataCache: DataCacheService, protected cacheService: CacheService) { }
    getMonthlySchedule(params) {

        let url = this.getUrl();
        let urlParams: URLSearchParams = new URLSearchParams();

        urlParams.set('endDate', params.endDate);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        urlParams.set('groupBy', 'groupByPerson,groupByAttendedDate,groupByRtcDate');
        let request = this.http.get(url, {
            search: urlParams
        })
        .map((response: Response) => {
            return response.json().results;
        });

        return this.dataCache.cacheRequest(url, urlParams, request);
    }
    getUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'get-monthly-schedule';
    }
}
