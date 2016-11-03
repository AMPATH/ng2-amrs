import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class LocationResourceService {
  private locations = new ReplaySubject(1);

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
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
        this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location',
        {
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
