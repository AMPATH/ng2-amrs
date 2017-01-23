

import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

import { AppSettingsService } from '../app-settings/app-settings.service';


@Injectable()
export class PatientReminderResourceService {
  indicators: string = 'needs_vl_coded,overdue_vl_lab_order,' +
    'months_since_last_vl_date,new_viral_load_present,' +
    'ordered_vl_has_error,is_on_inh_treatment';
  report: string = 'clinical-reminder-report';

  referenceDate: Date= new Date();
  limit: number  = 1;
  startIndex: number = 0;


  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }

  getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'get-report-by-report-name';
  }

  getPatientLevelReminders(indicators: string, limit: number, patientUuid: string,
                           referenceDate: string, report: string,
                           startIndex: number): Observable<any> {
    console.log('this.referenceDate', this.referenceDate.toISOString());

    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();
    params.set('indicators', (indicators && indicators.length > 0) ? indicators : this.indicators);
    params.set('limit', this.limit.toString());
    params.set('patientUuid', patientUuid);
    params.set('referenceDate', this.referenceDate.toISOString());
    params.set('report', this.report);
    params.set('startIndex', this.startIndex.toString());
    return this.http.get(url, {
      search: params
    })
      .map((response: Response) => {
        return response.json().result;
      });
  }
}
