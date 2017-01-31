
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class ErrorLogResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }
  /**
   * @param {*} param
   * @param {object} [payload]
   * @returns
   *
   * @memberOf ErrorLogResourceService
   */
  public postFormError(payload): any {
    if (!payload) {
      return null;
    }
    let url = this.appSettingsService.getEtlRestbaseurl().trim() + 'forms/error';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json();
      });
  }
}
