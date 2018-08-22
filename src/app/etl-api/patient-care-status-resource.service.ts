import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class PatientCareStatusResourceService {
    constructor(private http: Http, private appSettingsService: AppSettingsService) { }

    public getMonthlyPatientCareStatus(options: {
        startDate: string, endDate: string, patient_uuid: string
    }): Observable<any> {
        let api: string = this.appSettingsService.getEtlServer() +
            '/patient/' + options.patient_uuid + '/monthly-care-status';
        let params: URLSearchParams = this.getUrlRequestParams(options);
        return this.http.get(api, { search: params }).map((data) => data.json());
    }

    public getDailyPatientCareStatus(options: {
        patient_uuid: string, referenceDate: string
    }): Observable<any> {
        let api: string = this.appSettingsService.getEtlServer() +
            '/patient/' + options.patient_uuid + '/daily-care-status';
        let urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('referenceDate', options.referenceDate);
        return this.http.get(api, { search: urlParams }).map((data) => data.json());
    }

    private getUrlRequestParams(options: {
        startDate: string, endDate: string, patient_uuid: string
    }): URLSearchParams {
        let urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('startDate', options.startDate);
        urlParams.set('endDate', options.endDate);
        return urlParams;
    }
}
