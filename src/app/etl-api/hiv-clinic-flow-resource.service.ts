import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import { AppSettingsService } from '../app-settings';

import { DataCacheService } from '../shared/services/data-cache.service';
import { ClinicFlowResource } from './clinic-flow-resource-interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class HivClinicFlowResourceService implements ClinicFlowResource {
  public cache;
  public result = new BehaviorSubject(null);
  private requestUrl = '';

  constructor(protected http: Http,
              protected appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) {
  }

  public getUrl(reportName): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
  }

  public getClinicFlow(dateStarted, locations) {
    let urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set('dateStarted', dateStarted);
    urlParams.set('locationUuids', locations);
    let url = this.getUrl('patient-flow-data');
    let request = this.http.get(url, {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json();
      });
    let key = url + '?' + urlParams.toString();
    /** This is a workaround to avoid multiple calls to server by the respective
     * clinic flow components
     */
    if (key !== this.requestUrl) {
      // clear cache after 1 minute
      let refreshCacheTime = 1 * 60 * 1000;
      this.requestUrl = key;
      this.cache = this.cacheService.cacheSingleRequest(url, urlParams, request, refreshCacheTime);
    }
    return this.cache;
  }

}
