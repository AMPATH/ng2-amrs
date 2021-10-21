import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { DataCacheService } from "../shared/services/data-cache.service";
import { HttpClient, HttpParams } from "@angular/common/http";
@Injectable()
export class DefaulterListResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getUrl(reportName: string): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
  }

  public getDefaulterList(params: any) {
    const urlParams: HttpParams = new HttpParams()
      .set('defaulterPeriod', params.minDefaultPeriod)
      .set('maxDefaultPeriod', params.maxDefaultPeriod)
      .set('locationUuids', params.locationUuids);
    const url = this.getUrl('defaulter-list');
    const request = this.http
      .get<any>(url, {
        params: urlParams,
      })
      .pipe(
        map((response: any) => {
          return response.result;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
