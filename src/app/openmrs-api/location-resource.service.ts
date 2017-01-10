import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class LocationResourceService {
  private locations = new ReplaySubject(1);
  private v: string = 'full';

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
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
    params.set('v', 'full');

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

  getLocationByUuid(uuid: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location';
    url += '/' + uuid;

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }

  searchLocation(searchText: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location';
    let params: URLSearchParams = new URLSearchParams();

    params.set('q', searchText);

    params.set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      search: params
    })
      .map((response: Response) => {
        return response.json().results;
      });
  }

}
