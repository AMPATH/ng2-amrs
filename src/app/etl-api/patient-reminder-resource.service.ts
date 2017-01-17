

import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

import { AppSettingsService } from '../app-settings/app-settings.service';


@Injectable()
export class PatientReminderResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }

  getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'get-report-by-report-name';
  }

  getPatientLevelReminders(indicators: string, limit: number, patientUuid: string,
                           referenceDate: string, report: string,
                           startIndex: number): Observable<any> {

    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();
    params.set('indicators', indicators);
    params.set('limit', limit.toString());
    params.set('patientUuid', patientUuid);
    params.set('referenceDate', referenceDate);
    params.set('report', report);
    params.set('startIndex', startIndex.toString());
    return this.http.get(url, {
      search: params
    })
      .map((response: Response) => {
        return response.json().result;
      });
  }
}
