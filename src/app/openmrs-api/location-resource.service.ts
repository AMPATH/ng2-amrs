
import {take} from 'rxjs/operators';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as locationIds from '../shared/locations/location_data.json';
@Injectable()
export class LocationResourceService {
  private locations = new ReplaySubject(1);
  private v = 'full';

  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) {
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

    const params = new HttpParams().set('v', 'full');

    if (!this.locations.observers.length || forceRefresh) {
      this.http.get<any>(
        this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location',
        {
          params: params
        }
      ).pipe(take(1)).subscribe(
        (data) => this.locations.next(data.results),
        (error) => this.locations.error(error)
        );
    }

    return this.locations;
  }
  public getAmpathLocations() {
    return this.http.get('./assets/locations/ampath_facilities.json');
  }
  public getLocationByUuid(uuid: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location';
    url += '/' + uuid;

    const params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);
    const request = this.http.get(url, { params: params });
    return this.cacheService.cacheRequest(url, params, request);
  }

  public getLocationIdByUuid(uuid: string): any {
    const _location = locationIds.locations.filter((location) => {
      return location.uuid === uuid;
    });
    if (_location.length > 0) {
      return _location[0].id;
    }
    return null;
  }

  public searchLocation(searchText: string, cached: boolean = false, v: string = null):
  Observable<any> {

    const url = this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location';
    const params: HttpParams = new HttpParams()
    .set('q', searchText)
    .set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get<any>(url, {
      params: params
    }).pipe(
      map((response) => {
        return response.results;
      }));
  }

}
