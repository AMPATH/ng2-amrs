import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class OrderResourceService {
  public v: string = 'custom:(display,uuid,orderNumber,orderType,' +
    'orderReason,orderReasonNonCoded,urgency,action,' +
    'commentToFulfiller,dateStopped,dateActivated,instructions,orderer:default,' +
    'encounter:full,patient:full,concept:ref)';

  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService) { }

  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'order';
  }

  public searchOrdersById(orderId: string, cached: boolean = false, v: string = null): Observable<any> {
    let url = this.getUrl();
    url += '/' + orderId;
    const params: HttpParams = new HttpParams()
      .set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      params: params
    }).pipe(map((response) => {
      return this.excludeVoidedOrder(response);
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

    const params: HttpParams = new HttpParams()
      .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params: params
    }).pipe(map((response) => {
      return response;
    }));
  }

  private excludeVoidedOrder(order): any {
    if (!order) {
      return null;
    }
    if (order.voided === false) {
      return order;
    } else {
      return { orderVoided: true };
    }
  }

  public getAllOrdersByPatientUuuid(patientUuid: string, careSettingUuid: string,
    cached: boolean = false, v: string = null): Observable<any> {
    const url = this.getUrl();

    const params: HttpParams = new HttpParams()
      .set('patient', patientUuid)
      .set('careSetting', careSettingUuid)
      .set('status', 'any')
      .set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      params: params
    }).map((response) => {
      return response;
    });
  }

  public saveProcedureOrder(payload): Observable<any>  {
    const url = this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'order';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers })
      .map((response: Response) => {
        return response;
      });
  }
}
