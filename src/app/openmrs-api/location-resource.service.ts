import { take } from 'rxjs/operators';

import { map, filter } from 'rxjs/operators';
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
  private amrsSiteAttributeTypeUuid = 'a147d88e-3bc5-4807-8194-d7885f4058b1';

  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

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
      this.http
        .get<any>(
          this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location',
          {
            params: params
          }
        )
        .pipe(take(1))
        .subscribe(
          (data) => this.locations.next(data.results),
          (error) => this.locations.error(error)
        );
    }

    return this.locations;
  }
  public getAmpathLocations() {
    return this.http.get('./assets/locations/ampath_facilities.json');
  }
  public getLocationByUuid(
    uuid: string,
    cached: boolean = false,
    v: string = null
  ): Observable<any> {
    let url =
      this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location';
    url += '/' + uuid;

    const params: HttpParams = new HttpParams().set(
      'v',
      v && v.length > 0 ? v : this.v
    );
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

  public searchLocation(
    searchText: string,
    cached: boolean = false,
    v: string = null
  ): Observable<any> {
    const url =
      this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location';
    const params: HttpParams = new HttpParams()
      .set('q', searchText)
      .set('v', v && v.length > 0 ? v : this.v);

    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.results;
        })
      );
  }
  public getAmrsLocations(): Observable<any> {
    const url =
      this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location';
    const params = new HttpParams().set('v', 'full');
    const request = this.http.get(url, { params: params }).pipe(
      map((results: any) => {
        return results.results;
      }),
      map((results: any) => {
        const sites = results.filter((result: any) => {
          if (result.attributes.length > 0) {
            const attributes = result.attributes;
            const isAmrsSite = attributes.some((att: any) => {
              return (
                att.attributeType.uuid === this.amrsSiteAttributeTypeUuid &&
                att.value === true &&
                att.voided === false
              );
            });
            if (isAmrsSite) {
              return result;
            }
          }
        });
        return sites;
      })
    );

    return this.cacheService.cacheRequest(url, {}, request);
  }

  public getNonAmrsLocations(): Observable<any> {
    const url =
      this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location';
    const params = new HttpParams().set('v', 'full');
    const request = this.http.get(url, { params: params }).pipe(
      map((results: any) => {
        return results.results;
      }),
      map((results: any) => {
        const sites = results.filter((result: any) => {
          if (result.attributes.length === 0) {
            return result;
          } else {
            const attributes = result.attributes;
            const isNonAmrsSite = attributes.some((att: any) => {
              return (
                att.attributeType.uuid === this.amrsSiteAttributeTypeUuid &&
                att.value === false &&
                att.voided === false
              );
            });
            if (isNonAmrsSite) {
              return result;
            }
          }
        });
        return sites;
      })
    );

    return this.cacheService.cacheRequest(url, {}, request);
  }
}
