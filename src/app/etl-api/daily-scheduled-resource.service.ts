import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { Observable } from 'rxjs/Observable';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class DailyScheduleResourceService {
    constructor(protected http: Http, protected appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) { }

    public getUrl(reportName, selectedDate): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}/${selectedDate}`;
    }

    public getDailyVisits(params) {
        let urlParams: URLSearchParams = new URLSearchParams();
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        let url = this.getUrl('daily-visits', params.startDate);
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });
        return this.cacheService.cacheRequest(url, urlParams, request);
    }

    public getDailyAppointments(params) {
        let urlParams: URLSearchParams = new URLSearchParams();

        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }

        urlParams.set('startIndex', params.startIndex);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);

        let url = this.getUrl('daily-appointments', params.startDate);
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });
        return this.cacheService.cacheRequest(url, urlParams, request);
    }

    public getDailyHasNotReturned(params) {
        let urlParams: URLSearchParams = new URLSearchParams();
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);

        urlParams.set('limit', params.limit);

        let url = this.getUrl('daily-has-not-returned', params.startDate);
        let request = this.http.get(url, {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });
        return this.cacheService.cacheRequest(url, urlParams, request);
    }

}
