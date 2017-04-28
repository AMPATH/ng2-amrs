import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

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

    getGroupPatientLabResults(patientUuId, groupname,
    params: { startIndex: string, limit: string }) {
        let test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
        let labResults = [
            {
                chest_xray : 'Chest Xray',
                creatinine : 'Creatinine',
                lab_errors : 'Lab Errors',
                person_id : 1218,
                testDatetime : '01-03-2016',
                test_datetime : '2016-02-29T21:00:00.000Z',
                tests_ordered : 'Viral Load',
                uuid : '5b71b2e2-1359-11df-a1f1-0026b9348838',
                groupname: 'cancer_group'
            },
            {
                ast : 'AST',
                cd4_count : 'CD4 Count',
                cd4_error : 'CD4 Error',
                cd4_percent : 'CD4 Percent',
                encounter_id : 325852653,
                encounter_type : 99999,
                lab_errors : 'Lab Errors',
                person_id : 1218,
                testDatetime : '01-03-2016',
                test_datetime : '2016-02-29T21:00:00.000Z',
                uuid : '5b71b2e2-1359-11df-a1f1-0026b9348838',
                groupname: 'oncology_group'
            },
            {
                ast : 'AST',
                cd4_count : 'Count',
                cd4_error : 'Error',
                cd4_percent : 'Percent',
                encounter_id : 325852653,
                encounter_type : 99999,
                lab_errors : 'Lab',
                person_id : 1218,
                testDatetime : '01-03-2016',
                test_datetime : '2016-02-29T21:00:00.000Z',
                uuid : '5b71b2e2-1359-11df-a1f1-0026b9348838',
                groupname: 'hiv_group'
            },
            {
                chest_xray : 'Chest Xray',
                creatinine : 'Creatinine',
                lab_errors : 'Lab Errors',
                person_id : 1218,
                testDatetime : '01-03-2016',
                test_datetime : '2016-02-29T21:00:00.000Z',
                tests_ordered : 'Viral Load',
                uuid : '5b71b2e2-1359-11df-a1f1-0026b9348838',
                groupname: 'cancer_group'
            },
            {
                ast : 'AST',
                cd4_count : 'CD4 Count',
                cd4_error : 'CD4 Error',
                cd4_percent : 'CD4 Percent',
                encounter_id : 325852653,
                encounter_type : 99999,
                lab_errors : 'Lab Errors',
                person_id : 1218,
                testDatetime : '01-03-2016',
                test_datetime : '2016-02-29T21:00:00.000Z',
                uuid : '5b71b2e2-1359-11df-a1f1-0026b9348838',
                groupname: 'oncology_group'
            },
            {
                ast : 'AST',
                cd4_count : 'Count',
                cd4_error : 'Error',
                cd4_percent : 'Percent',
                encounter_id : 325852653,
                encounter_type : 99999,
                lab_errors : 'Lab',
                person_id : 1218,
                testDatetime : '01-03-2016',
                test_datetime : '2016-02-29T21:00:00.000Z',
                uuid : '5b71b2e2-1359-11df-a1f1-0026b9348838',
                groupname: 'hiv_group'
            }
        ];
        let groupLabResults = [];

        labResults.forEach((value) => {
            if (value.groupname === groupname) {
                groupLabResults.push(value);
            }
        });
        test.next(groupLabResults);
      return test.asObservable();
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
