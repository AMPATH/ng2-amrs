
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class DailyScheduleResourceService {
    constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) { }

    public getUrl(reportName, selectedDate): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}/${selectedDate}`;
    }

    public getDailyVisits(params) {
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        let urlParams: HttpParams = new HttpParams()
        .set('startIndex', params.startIndex)
        .set('startDate', params.startDate)
        .set('locationUuids', params.locationUuids)
        .set('programVisitEncounter', params.programVisitEncounter)
        .set('limit', params.limit);
        let url = this.getUrl('daily-visits', params.startDate);
        let request = this.http.get<any>(url, {
            params: urlParams
        }).pipe(
            map((response) => {
                return response.result;
            }));
        return this.cacheService.cacheRequest(url, urlParams, request);
    }

    public getDailyAppointments(params) {
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        let urlParams: HttpParams = new HttpParams()
        .set('startIndex', params.startIndex)
        .set('startDate', params.startDate)
        .set('locationUuids', params.locationUuids)
        .set('programVisitEncounter', params.programVisitEncounter)
        .set('limit', params.limit);

        let url = this.getUrl('daily-appointments', params.startDate);
        let request = this.http.get<any>(url, {
            params: urlParams
        }).pipe(
            map((response) => {
                return response.result;
            }));
        return this.cacheService.cacheRequest(url, urlParams, request);
    }

    public getDailyHasNotReturned(params) {
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        let urlParams: HttpParams = new HttpParams()
        .set('startIndex', params.startIndex)
        .set('startDate', params.startDate)
        .set('locationUuids', params.locationUuids)
        .set('programVisitEncounter', params.programVisitEncounter)
        .set('limit', params.limit);

        let url = this.getUrl('daily-has-not-returned', params.startDate);
        let request = this.http.get<any>(url, {
            params: urlParams
        }).pipe(
            map((response) => {
                return response.result;
            }));
        return this.cacheService.cacheRequest(url, urlParams, request);
    }

}
