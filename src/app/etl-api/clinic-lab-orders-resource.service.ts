
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';

@Injectable()
export class ClinicLabOrdersResourceService {
  constructor(protected http: Http, protected appSettingsService: AppSettingsService) { }

  public getUrl(reportName): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}`;

  }

  public getClinicLabOrders(params): Observable<any> {
    let url = this.getUrl('clinic-lab-orders');
    let urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set('locationUuids', params.locationUuids);
    urlParams.set('endDate', params.endDate);
    urlParams.set('startDate', params.startDate);
    return  this.http.get(url , {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json().result;
      });
   // return this.dataCache.cacheRequest(url, urlParams, request);
  }
  public getLabOrdersByPatientUuid(patientUuid): Observable<any> {
    let url = this.getUrls();
    let urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set('patientUuid', patientUuid);
    return this.http.get(url , {
      search: urlParams
    })
      .map((response: Response) => {
        return response.json().result;
      });
     // return this.dataCache.cacheRequest(url, urlParams, request);
  }

  public getUrls(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `lab-orders-by-patient`;
  }
}
