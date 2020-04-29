
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class CaseManagementResourceService {
    constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService,
                private cacheService: DataCacheService) { }

    public getUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim()
          + 'case-management';

    }


    public getUrlRequestParams(params): HttpParams {
        const urlParams: HttpParams = new HttpParams();

        return urlParams;
    }

    public getCaseManagers(params) {
    }

/*
Fetch case management patient list
*/
    public getCaseManagementList(params) {

    }
}
