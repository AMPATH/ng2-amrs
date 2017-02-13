import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class MonthlyScheduleResourceService {
    constructor(protected http: Http, protected appSettingsService: AppSettingsService) { }
    getMonthlySchedule(params) {
        let urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('endDate', params.endDate);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        return this.http.get(this.getUrl(), {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().results;
            });
    }
    getUrl(): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'get-monthly-schedule';
    }
}
