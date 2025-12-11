import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientTypeService {
  public get url(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) {}

  public setPatientStatus(params: any): Observable<any> {
    let status: string;
    if (params.value === 'Study') {
      status = 'a89a898a-1350-11df-a1f1-0026b9348838';
    } else {
      status = '520825cf-d045-4bbf-a7f5-a7018f14dd76';
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      person: params.patient,
      concept: '5671130b-fb49-4e31-86b3-9e0df8919908',
      obsDatetime: this.getCurrentDateFormatted(),
      value: status
    };
    return this.http.post(`${this.url}obs`, body, { headers }).pipe(
      catchError((err: any) => {
        const error: any = err;
        const errorObj = {
          error: error.status,
          message: error.statusText
        };
        return Observable.of(errorObj);
      }),
      map((response: Response) => {
        return response;
      })
    );
  }

  public getCurrentDateFormatted(): string {
    const date = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const padMs = (n: number) => n.toString().padStart(3, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());
    const ms = padMs(date.getMilliseconds());

    // Timezone offset in minutes
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);

    const timezone = `${sign}${offsetHours}${offsetMinutes}`;

    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}${timezone}`;
  }
}
