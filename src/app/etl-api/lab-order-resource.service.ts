
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { AppSettingsService } from '../app-settings';

@Injectable()
export class LabOrderResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }

  public postOrderToEid(location, payload: any) {

    let url = this.appSettingsService.getEtlRestbaseurl().trim() + 'eid/order/';
    url = url + location;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json();
      });
  }
}
