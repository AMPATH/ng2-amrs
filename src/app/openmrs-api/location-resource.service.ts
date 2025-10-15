import { map, take, filter, expand, reduce } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, of } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as locationIds from '../shared/locations/location_data.json';
import {
  AmrsLocationResponse,
  LocationResponseLink
} from '../interfaces/location.interface';
@Injectable()
export class LocationResourceService {
  private locations = new ReplaySubject(1);
  private v = 'full';

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
    if (!this.locations.observers.length || forceRefresh) {
      this.getAllLocations()
        .pipe(take(1))
        .subscribe(
          (data) => this.locations.next(data.results),
          (error) => this.locations.error(error)
        );
    }

    return this.locations;
  }

  public getAllLocations() {
    let startIndex = 0;
    return this.fetchLocations(startIndex).pipe(
      expand((res) => {
        if (this.hasNextPage(res.links)) {
          startIndex += 500;
          return this.fetchLocations(startIndex);
        } else {
          return of();
        }
      }),
      map((res) => res.results),
      reduce((acc, results) => acc.concat(results), []),
      map((allData) => ({ results: allData }))
    );
  }

  private hasNextPage(links: LocationResponseLink[]): boolean {
    if (!links) {
      return false;
    }
    return links.some((l) => {
      return l.rel === 'next';
    });
  }

  private fetchLocations(startIndex: number) {
    return this.http.get<AmrsLocationResponse>(
      this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'location',
      {
        params: {
          startIndex: String(startIndex),
          v: 'full'
        }
      }
    );
  }

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getMflCodes(): Observable<any> {
    const url = this.getUrl() + 'mflcodes';
    return this.http.get<any>(url, {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public getFacilityMapping(): Observable<any> {
    const url = this.getUrl() + 'parentlocations';
    return this.http.get<any>(url);
  }

  public getChildMapping(location_id): Observable<any> {
    const url = this.getUrl() + `childlocations?parentId=${location_id}`;
    return this.http.get<any>(url);
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

  public getCountries() {
    return this.http.get('./assets/locations/countries.json');
  }

  public getSiblingAmrsLocations(locationUuid: string): Observable<any> {
    return this.getLocationByUuid(locationUuid, true, 'full').pipe(
      filter((locations: any) => {
        /* select only parent locations locations */
        if (
          locations.parentLocation !== null &&
          locations.parentLocation.childLocations &&
          !locations.parentLocation.retired
        ) {
          return locations.parentLocation.childLocations;
        } else {
          return [];
        }
      }),
      map((filteredLocation: any) => {
        /* extract child locations from parent locations */
        if (filteredLocation.parentLocation) {
          return filteredLocation.parentLocation.childLocations;
        } else {
          return [];
        }
      })
    );
  }
}
