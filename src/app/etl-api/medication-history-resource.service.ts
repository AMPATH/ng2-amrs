
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';


@Injectable()
export class MedicationHistoryResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) { }

  getReport( report: string, patientUuid: string) {

    let api = this.appSettingsService.getEtlServer() + '/get-report-by-report-name' ;

    if (!report) {
      report = 'medical-history-report';
    }
    // report: 'medical-history-report'

    let params: URLSearchParams = new URLSearchParams();

    params.set('report', report);
    params.set('patientUuid', patientUuid);
    return this.http.get(api, { search: params }).map((response: Response) => {
      return response.json();
    });
  }
}
