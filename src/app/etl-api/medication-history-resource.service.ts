
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';

import { AppSettingsService } from '../app-settings';

@Injectable()
export class MedicationHistoryResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) { }

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient';
  }

  public getReport( report: string, patientUuid: string) {

    let api = this.appSettingsService.getEtlServer() +  '/patient/'
    + patientUuid + '/medical-history-report' ;

    if (!report) {
      report = 'medical-history-report';
    }

    let params: URLSearchParams = new URLSearchParams();

    return this.http.get(api, { search: params }).map((response: Response) => {
      return response.json();
    });
  }

  public getCdmMedicationHistory(patientUuid) {
    let url = this.getUrl();
    url += '/' + patientUuid + '/medication-change';

    let params: URLSearchParams = new URLSearchParams();

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
        return response.json().result;
    });

  }
}
