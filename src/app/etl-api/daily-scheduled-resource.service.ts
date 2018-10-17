
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
        console.log('Service:getDailyVisits', params);
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        const urlParams: HttpParams = new HttpParams()
        .set('startIndex', params.startIndex)
        .set('startDate', params.startDate)
        .set('locationUuids', params.locationUuids)
        .set('limit', params.limit);

        if (params.programType && params.programType.length > 0) {
            urlParams.append('programType', params.programType);
        }
        if (params.visitType && params.visitType.length > 0) {
            urlParams.append('visitType', params.visitType);
        }
        if (params.encounterType && params.encounterType.length > 0) {
            urlParams.append('encounterType', params.encounterType);
        }
        const url = this.getUrl('daily-visits', params.startDate);

        const request = this.http.get<any>(url, {
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
        const urlParams: HttpParams = new HttpParams()
        .set('startIndex', params.startIndex)
        .set('startDate', params.startDate)
        .set('locationUuids', params.locationUuids)
        .set('limit', params.limit);

        if (params.programType && params.programType.length > 0) {
            urlParams.append('programType', params.programType);
        }
        if (params.visitType && params.visitType.length > 0) {
            urlParams.append('visitType', params.visitType);
        }
        if (params.encounterType && params.encounterType.length > 0) {
            urlParams.append('encounterType', params.encounterType);
        }

        const url = this.getUrl('daily-appointments', params.startDate);
        const request = this.http.get<any>(url, {
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
        const urlParams: HttpParams = new HttpParams()
        .set('startIndex', params.startIndex)
        .set('startDate', params.startDate)
        .set('locationUuids', params.locationUuids)
        .set('limit', params.limit);
        if (params.programType && params.programType.length > 0) {
            urlParams.append('programType', params.programType);
        }
        if (params.visitType && params.visitType.length > 0) {
            urlParams.append('visitType', params.visitType);
        }
        if (params.encounterType && params.encounterType.length > 0) {
            urlParams.append('encounterType', params.encounterType);
        }

        const url = this.getUrl('daily-has-not-returned', params.startDate);
        const request = this.http.get<any>(url, {
            params: urlParams
        }).pipe(
            map((response) => {
                return response.result;
            }));
        return this.cacheService.cacheRequest(url, urlParams, request);
    }

}
