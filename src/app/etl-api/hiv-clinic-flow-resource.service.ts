import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { ClinicFlowResource } from './clinic-flow-resource-interface';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class HivClinicFlowResourceService implements ClinicFlowResource {
  public cache;
  public result = new BehaviorSubject(null);
  private requestUrl = '';

  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getUrl(reportName): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
  }

  public getClinicFlow(dateStarted, locations) {
    const urlParams: HttpParams = new HttpParams()
      .set('dateStarted', dateStarted)
      .set('locationUuids', locations);
    const url = this.getUrl('patient-flow-data');
    const request = this.http.get(url, {
      params: urlParams
    });
    const key = url + '?' + urlParams.toString();
    /** This is a workaround to avoid multiple calls to server by the respective
     * clinic flow components
     */
    if (key !== this.requestUrl) {
      // clear cache after 1 minute
      const refreshCacheTime = 1 * 60 * 1000;
      this.requestUrl = key;
      this.cache = this.cacheService.cacheSingleRequest(
        url,
        urlParams,
        request,
        refreshCacheTime
      );
    }
    return this.cache;
  }
}
