import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { Observable } from 'rxjs';

@Injectable()
export class HivPatientClinicalSummaryResourceService {
  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  public fetchPatientSummary(patientUuid: string): Observable<any> {
    let api: string = this.appSettingsService.getEtlServer() +
      '/patient/' + patientUuid + '/hiv-patient-clinical-summary';

    let params: URLSearchParams = new URLSearchParams();

    params.set('startIndex', 0 as any as string);
    params.set('limit', 10 as any as string);

    return this.http.get(api, {search: params}).map((data) => data.json());
  }

}
