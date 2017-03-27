

import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { DatePipe } from '@angular/common';


@Injectable()
export class PatientReminderResourceService {
  indicators: string = 'needs_vl_coded,overdue_vl_lab_order,' +
  'months_since_last_vl_date,new_viral_load_present,' +
  'ordered_vl_has_error,is_on_inh_treatment';
  report: string = 'clinical-reminder-report';

  referenceDate: string;
  limit: number = 1;
  startIndex: number = 0;
  private _datePipe: DatePipe;

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
    this._datePipe = new DatePipe('en-US');
    this.referenceDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'get-report-by-report-name';
  }

  getPatientLevelReminders(patientUuid: string): Observable<any> {
    console.log('this.referenceDate', this.referenceDate);

    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();
    params.set('indicators', (this.indicators && this.indicators.length > 0) ?
      this.indicators : this.indicators);
    params.set('limit', this.limit.toString());
    params.set('patientUuid', patientUuid);
    params.set('referenceDate', this.referenceDate);
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
