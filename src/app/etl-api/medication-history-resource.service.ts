
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class MedicationHistoryResourceService {

  constructor(private http: HttpClient, private appSettingsService: AppSettingsService) { }

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient';
  }

  public getReport( report: string, patientUuid: string) {

    const api = this.appSettingsService.getEtlServer() +  '/patient/'
    + patientUuid + '/medical-history-report' ;

    if (!report) {
      report = 'medical-history-report';
    }

    const params: HttpParams = new HttpParams();

    return this.http.get<any>(api, { params: params });
  }

  public getCdmMedicationHistory(patientUuid) {
    let url = this.getUrl();
    url += '/' + patientUuid + '/medication-change';

    const params: HttpParams = new HttpParams();

    return this.http.get<any>(url, {
      params: params
    }).pipe(map((response: any) => {
        return response.result;
    }));

  }
}
