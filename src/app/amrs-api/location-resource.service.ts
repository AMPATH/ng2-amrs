
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LocationResourceService {

  private baseUrl = '-'; // create ng-amr server selector
  private locations = new ReplaySubject(1);

  constructor(private http: Http) {

  }

  protected createAuthorizationHeader(): Headers {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' + 'HASH');  // TODO: do authentication
    return headers;
  }

  /**
   *
   *
   * @param {boolean} [forceRefresh]
   * @returns
   *
   * @memberOf AmrsDataService
   */
  public getLocations(forceRefresh?: boolean) {
    // If the Subject was NOT subscribed before OR if forceRefresh is requested

    let params = new URLSearchParams();
    params.set('v', 'default');

    if (!this.locations.observers.length || forceRefresh) {
      this.http.get(
        this.baseUrl + 'location',
        {
          headers: this.createAuthorizationHeader(), // TODO create a base class which extends BaseRequestOptions --> do injection
          search: params
        }
      )
        .map((res: Response) => res.json())
        .subscribe(
          data => this.locations.next(data.results),
          error => this.locations.error(error)
        );
    }

    return this.locations;
  }

}
