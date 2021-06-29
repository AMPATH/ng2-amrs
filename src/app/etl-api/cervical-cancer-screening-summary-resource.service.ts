import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class CervicalCancerScreeningSummaResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getCervicalCancerScreeningSummary(
    patientUuid: string
  ): Observable<any> {
    let url = this.getUrl();
    url += 'patient-cervical-cancer-screening-summary';

    const params: HttpParams = new HttpParams().set(
      'uuid',
      patientUuid as string
    );

    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.result;
        })
      );
  }
}
