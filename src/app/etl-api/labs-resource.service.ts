
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class LabsResourceService {

    constructor(private http: Http, private appSettingsService: AppSettingsService) { }
    public getNewPatientLabResults(params: { startDate: string, endDate: string,
      patientUuId: string }) {
        let urlParams: URLSearchParams = new URLSearchParams();

        urlParams.set('startDate', params.startDate);
        urlParams.set('endDate', params.endDate);
        urlParams.set('patientUuId', params.patientUuId);
        return this.http.get(this.getUrl(),
            { search: urlParams }).pipe(map(this.parseNewLabResults),
            catchError(this.handleError),);
    }

    public getHistoricalPatientLabResults(patientUuId,
                                          params: { startIndex: string, limit: string }) {
        if (!patientUuId) {
            return null;
        }
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '20';
        }
        let urlParams: URLSearchParams = new URLSearchParams();

        urlParams.set('startIndex', params.startIndex);
        urlParams.set('limit', params.limit);
        return this.http.get(this.appSettingsService.getEtlRestbaseurl().trim()
            + `patient/${patientUuId}/data`,
            { search: urlParams }).pipe(map(this.parseHistoricalLabResults),
            catchError(this.handleError),);
    }

    private getUrl() {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient-lab-orders';
    }

    private parseHistoricalLabResults(res) {
        const body = res.json();
        return body.result;
    }
    private parseNewLabResults(res) {
        const body = res.json();

        if (body.errors) {
            return body;
        }
        return body.updatedObs;
    }
    private handleError(error: any) {
        return observableThrowError(error.message
            ? error.message
            : error.status
                ? `${error.status} - ${error.statusText}`
                : 'Server Error');
    }
}
