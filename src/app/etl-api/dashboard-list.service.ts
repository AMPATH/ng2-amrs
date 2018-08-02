import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { Observable } from 'rxjs/Observable';
import { DataCacheService } from '../shared/services/data-cache.service';
@Injectable()
export class DashboardListService {
  constructor(protected http: Http,
              protected appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) {
  }

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public fetchDashboards(): Observable<any> {

    let url = this.getBaseUrl() + 'kibana-dashboards';
    return this.http.get(url)
      .map((response: Response) => {
        return response.json();
      });

    // return this.cacheService.cacheRequest(url, '' , request);

  }

}
