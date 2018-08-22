
import {map} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class MedicationHistoryResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) { }

  public getReport( report: string, patientUuid: string) {

    let api = this.appSettingsService.getEtlServer() +  '/patient/'
    + patientUuid + '/medical-history-report' ;

    if (!report) {
      report = 'medical-history-report';
    }

    let params: URLSearchParams = new URLSearchParams();

    return this.http.get(api, { search: params }).pipe(map((response: Response) => {
      return response.json();
    }));
  }
}
