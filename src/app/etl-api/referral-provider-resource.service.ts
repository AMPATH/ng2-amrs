
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ReferralProviderResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) { }
  public getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'referral-patient-list';
  }
  public getReferralProviders(locationUuid: string, providerUuids: string, stateUuids: string,
                              startIndex, limit): Observable<any> {
    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();
    if (!startIndex) {
      startIndex = 0;
    }
    if (!limit) {
      limit = 300;
    }
    params.set('providerUuids', providerUuids.toString());
    params.set('stateUuids', stateUuids.toString());
    params.set('locationUuids', locationUuid.toString());
    params.set('startDate', '2010-12-27T15:15:36+03:00');
    params.set('startIndex', startIndex.toString());
    params.set('endDate', '2019-12-27T15:15:36+03:00');
    params.set('limit', limit.toString());

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }
}
