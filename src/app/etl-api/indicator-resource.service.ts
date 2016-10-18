
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class IndicatorResourceService {

  private baseUrl = 'https://amrsreporting.ampath.or.ke:8003/etl/'; // create ng-amr server selector
  private reportIndicators = new ReplaySubject(1);

  constructor(private http: Http) {

  }

  protected createAuthorizationHeader(): Headers {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' + 'HASH');  // TODO: do authentication
    return headers;
  }


  /**
   * @param {*} param
   * @param {boolean} [forceRefresh]
   * @returns
   *
   * @memberOf IndicatorResourceService
   */
  public getReportIndicators(param: any, forceRefresh?: boolean) {
    // If the Subject was NOT subscribed before OR if forceRefresh is requested

    let params = new URLSearchParams();
    params.set('report', param.report);

    if (!this.reportIndicators.observers.length || forceRefresh) {
      this.http.get(
        this.baseUrl + 'indicators-schema',
        {
          headers: this.createAuthorizationHeader(), // TODO create a base class which extends BaseRequestOptions --> do injection
          search: params
        }
      )
        .map((res: Response) => res.json())
        .subscribe(
          data => this.reportIndicators.next(data.result),
          error => this.reportIndicators.error(error)
        );
    }

    return this.reportIndicators;
  }
}
