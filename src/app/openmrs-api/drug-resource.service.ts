import { Injectable } from '@angular/core';


// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';
import { AppSettingsService } from '../app-settings/app-settings.service';

import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable()
export class DrugResourceService {

  v = 'custom:(uuid,name,concept,dosageForm,strength)';

  constructor(protected http: HttpClient,
    protected appSettingsService: AppSettingsService) {
  }

  getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'drug';
  }

  searchDrug(searchText: string, cached: boolean = false, v: string = null):
  Observable<any> {

    const url = this.getUrl();
   const params: HttpParams = new HttpParams()
    .set('q', searchText)
    .set('v', (v && v.length > 0) ? v : this.v);
    console.log(url);
    return this.http.get(url, {
      params: params
    }).pipe(
      map((response: any) => {
        console.log('drug results', response);
        return response.results;
      }));
  }
  searchAllDrugs( cached: boolean = false, v: string = null):
  Observable<any> {

    const url = this.getUrl();
   const params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);
    console.log(url);
    return this.http.get(url, {
      params: params
    }).pipe(
      map((response: any) => {
        console.log('drug results', response);
        return response.results;
      }));
  }
  public searchDrugyId(orderId: string, cached: boolean = false, v: string = null):
  Observable<any> {

  let url = this.getUrl();
  url += '/' + orderId;
  const params: HttpParams = new HttpParams()
  .set('v', (v && v.length > 0) ? v : this.v);

  return this.http.get(url, {
    params: params
  }).pipe(map((response) => {
    return this._excludeVoidedDrug(response);
  }));
}
public getDrugByUuid(uuid: string, cached: boolean = false, v: string = null): Observable<any> {

  let url = this.getUrl();
  url += '/' + uuid;
  this.v = 'full';
  // console.log('url', url)

  const params: HttpParams = new HttpParams()
  .set('v', (v && v.length > 0) ? v : this.v);
  return this.http.get(url, {
    params: params
  }).pipe(map((response) => {
    return response;
  }));
}
private _excludeVoidedDrug(order) {
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
