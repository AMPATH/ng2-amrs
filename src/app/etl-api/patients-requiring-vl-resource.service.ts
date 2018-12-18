
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable()
export class PatientsRequiringVLResourceService {

    constructor(private _http: HttpClient, private appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) {
    }

    public geturl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim();
    }

    public getPatientList(startDate: string, endDate: string, locationUuids: string,
                          startIndex?: string, limit?: string): Observable<any> {
        const api: string = this.geturl() + 'patients-requiring-viral-load-order';
        if (!startIndex) {
            startIndex = '0';
        }
        if (!limit) {
            limit = '100000';
        }

        const urlParams: HttpParams = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate)
        .set('locationUuids', locationUuids)
        .set('startIndex', startIndex)
        .set('limit', limit);

        const request = this._http.get(api, { params: urlParams });
        return this.cacheService.cacheRequest(api, urlParams, request);

    }

}
