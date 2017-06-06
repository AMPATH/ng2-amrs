import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class LabsResourceService {

    constructor(private http: Http, private appSettingsService: AppSettingsService) { }
    getNewPatientLabResults(params: { startDate: string, endDate: string, patientUuId: string }) {
        let urlParams: URLSearchParams = new URLSearchParams();

        urlParams.set('startDate', params.startDate);
        urlParams.set('endDate', params.endDate);
        urlParams.set('patientUuId', params.patientUuId);
        return this.http.get(this.getUrl(),
            { search: urlParams }).map(this.parseNewLabResults)
            .catch(this.handleError);
    }

    getHistoricalPatientLabResults(patientUuId, params: { startIndex: string, limit: string }) {
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
            { search: urlParams }).map(this.parseHistoricalLabResults)
            .catch(this.handleError);
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
        return Observable.throw(error.message
            ? error.message
            : error.status
                ? `${error.status} - ${error.statusText}`
                : 'Server Error');
    }
}
