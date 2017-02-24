import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class DailyScheduleResourceService {
    constructor(protected http: Http, protected appSettingsService: AppSettingsService) { }

    getUrl(reportName, selectedDate): string {
        return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}/${selectedDate}`;
    }

    getDailyVisits(params) {
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
        return this.http.get(this.getUrl('daily-visits', params.startDate), {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });
    }

    getDailyAppointments(params) {
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
        return this.http.get(this.getUrl('daily-appointments', params.startDate), {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });
    }

    getDailyHasNotReturned(params) {
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
        return this.http.get(this.getUrl('daily-has-not-returned', params.startDate), {
            search: urlParams
        })
            .map((response: Response) => {
                return response.json().result;
            });
    }

}
