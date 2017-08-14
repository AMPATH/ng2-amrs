
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { DatePipe } from '@angular/common';

@Injectable()
export class PatientReminderResourceService {
  referenceDate: string;
  private _datePipe: DatePipe;

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
    this._datePipe = new DatePipe('en-US');
    this.referenceDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getUrl(patientUuid: string): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient/' + patientUuid +
    '/hiv-clinical-reminder';
  }

  getPatientLevelReminders(patientUuid: string): Observable<any> {
    let url = this.getUrl(patientUuid)  + '/' + this.referenceDate;
    return this.http.get(url).map((response: Response) => {
        return response.json().result;
    });
  }
}
