
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ClinicLabOrdersResourceService {
  constructor(protected http: Http, protected appSettingsService: AppSettingsService) { }

  getUrl(reportName, selectedDate): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}/${selectedDate}`;

  }

  getClinicLabOrders(params): Observable<any> {
    let urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set('locationUuids', params.locationUuids);
    return this.http.get(this.getUrl('clinic-lab-orders', params.dateActivated), {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json().result;
      });
  }
}
