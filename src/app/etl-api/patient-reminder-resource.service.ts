import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PatientReminderResourceService {
  public referenceDate: string;
  private _datePipe: DatePipe;

  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {
    this._datePipe = new DatePipe('en-US');
    this.referenceDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  public getUrl(patientUuid: string): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      'patient/' +
      patientUuid +
      '/hiv-clinical-reminder'
    );
  }

  public getPatientLevelReminders(patientUuid: string): Observable<any> {
    const url = this.getUrl(patientUuid) + '/' + this.referenceDate;
    return this.http.get<any>(url).pipe(
      map((response) => {
        return response.result;
      })
    );
  }
}
