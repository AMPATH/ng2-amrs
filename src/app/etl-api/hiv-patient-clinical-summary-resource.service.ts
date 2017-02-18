import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';

@Injectable()
export class HivPatientClinicalSummaryResourceService {
  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  public fetchPatientSummary(patientUuid: string): Observable<any> {
    let api: string = this.appSettingsService.getEtlServer() +
      '/patient/' + patientUuid + '/hiv-patient-clinical-summary';

    let params: URLSearchParams = new URLSearchParams();

    params.set('startIndex', <string><any> 0);
    params.set('limit', <string><any> 10);

    return this.http.get(api, {search: params}).map((data) => data.json());
  }

}
