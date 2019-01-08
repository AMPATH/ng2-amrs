
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class OrderResourceService {

  public v: string = 'custom:(display,uuid,orderNumber,accessionNumber,' +
  'orderReason,orderReasonNonCoded,urgency,action,' +
  'commentToFulfiller,dateActivated,instructions,orderer:default,' +
  'encounter:full,patient:full,concept:ref)';

  constructor(protected http: HttpClient,
              protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'order';
  }

  public searchOrdersById(orderId: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = this.getUrl();
    url += '/' + orderId;
    const params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      params: params
    }).pipe(map((response) => {
      return this._excludeVoidedOrder(response);
    }));
  }

  public getOrdersByPatientUuid(patientUuid: string, cached: boolean = false, v: string = null):
  Observable<any> {

    const url = this.getUrl();
    const params: HttpParams = new HttpParams()
    .set('patient', patientUuid)
    .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params: params
    });
  }
  public getOrderByUuid(uuid: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;
    // console.log('url', url)

    const params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params: params
    }).pipe(map((response) => {
      return response;
    }));
  }

  private _excludeVoidedOrder(order) {
    if (!order) {
      return null;
    }
    if (order.voided === false) {
      return order;
    } else {
      return { orderVoided: true };
    }

  }

}
