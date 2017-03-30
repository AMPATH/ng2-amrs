import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable, Subject , ReplaySubject } from 'rxjs/Rx';


@Injectable()
export class OrderResourceService {

  v: string = 'custom:(display,uuid,orderNumber,accessionNumber,' +
    'orderReason,orderReasonNonCoded,urgency,action,' +
    'commentToFulfiller,dateActivated,instructions,orderer:default,' +
    'encounter:full,patient:default,concept:ref)';

  constructor(protected http: Http,
              protected appSettingsService: AppSettingsService) {
  }

  getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'order';
  }

  searchOrdersById(orderId: string, cached: boolean = false,
                    v: string = null): Observable<any> {

    let url = this.getUrl() ;
    url += '/' + orderId;
    let params: URLSearchParams = new URLSearchParams();
    params.set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }

  getOrdersByPatientUuid(patientUuid: string, cached: boolean = false,
                         v: string = null): Observable<any> {

    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();
    params.set('patient', patientUuid);

    params.set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }
  getOrderByUuid(uuid: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;
    // console.log('url', url)

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }

}

