import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class CdmSummaryResourceService {

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) { }

  public getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient';
  }

  public getCdmSummary(patientUuid: string, startIndex: number, limit: number,
                       includeNonClinicalEncounter?: boolean): Observable<any> {
    let url = this.getUrl();
    url += '/' + patientUuid + '/cdm-summary';

    let params: URLSearchParams = new URLSearchParams();

    if (includeNonClinicalEncounter !== undefined) {
      params.set('includeNonClinicalEncounter', includeNonClinicalEncounter.toString());
    }
    params.set('startIndex', startIndex.toString());
    params.set('limit', limit.toString());

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
        return response.json().result;
    });
  }
}
