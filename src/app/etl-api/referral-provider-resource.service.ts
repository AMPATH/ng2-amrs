
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
  public getReferralProviders(startDate, endDate, locations, programs, workFlowStates,
                              provider, startIndex, limit): Observable<any> {
    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();
    if (!startIndex) {
      startIndex = 0;
    }
    if (!limit) {
      limit = 300;
    }

    params.set('providerUuids', provider.toString());
    params.set('stateUuids', workFlowStates.toString());
    params.set('locationUuids', locations.toString());
    params.set('programUuids', programs.toString());
    params.set('startDate', startDate);
    params.set('endDate', endDate);
    params.set('startIndex', startIndex.toString());
    params.set('limit', limit.toString());

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }
}
