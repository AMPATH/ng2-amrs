
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs/Observable';
import { DataCacheService } from '../shared/services/data-cache.service';


@Injectable()
export class ClinicLabOrdersResourceService {
  constructor(protected http: Http, protected appSettingsService: AppSettingsService,
              protected dataCache: DataCacheService) { }

  getUrl(reportName, selectedDate): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}/${selectedDate}`;

  }

  getClinicLabOrders(params): Observable<any> {
    let url = this.getUrl('clinic-lab-orders', params.dateActivated);
    let urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set('locationUuids', params.locationUuids);
    let request =  this.http.get(url , {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json().result;
      });
    return this.dataCache.cacheRequest(url, urlParams, request);
  }
}
