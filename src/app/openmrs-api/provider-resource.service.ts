import { take } from 'rxjs/operators';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, ReplaySubject } from 'rxjs';
import { PersonResourceService } from './person-resource.service';
import * as _ from 'lodash';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable()
export class ProviderResourceService {
  public v = 'full';

  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    protected personService: PersonResourceService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'provider';
  }

  public searchProvider(
    searchText: string,
    cached: boolean = false,
    v: string = null
  ): Observable<any> {
    if (this.isEmpty(searchText)) {
      return Observable.of([]);
    }
    const url = this.getUrl();
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

  public getProviderByUuid(
    uuid: string,
    cached: boolean = false,
    v: string = null
  ): Observable<any> {
    if (this.isEmpty(uuid)) {
      return Observable.of(undefined);
    }

    let url = this.getUrl();
    url += '/' + uuid;

    const params: HttpParams = new HttpParams().set(
      'v',
      v && v.length > 0 ? v : this.v
    );
    return this.http.get(url, {
      params: params
    });
  }
  public getProviderByPersonUuid(uuid: string, v?: string): ReplaySubject<any> {
    const providerResults = new ReplaySubject(1);

    if (this.isEmpty(uuid)) {
      providerResults.next(null);
    } else {
      this.personService
        .getPersonByUuid(uuid, false)
        .pipe(take(1))
        .subscribe(
          (result) => {
            if (result) {
              const response = this.searchProvider(result.display, false, v);

              response.pipe(take(1)).subscribe(
                (providers) => {
                  let foundProvider;
                  _.each(providers, (provider: any) => {
                    if (provider.person && provider.person.uuid === uuid) {
                      foundProvider = provider;
                    }
                  });
                  if (foundProvider) {
                    if (foundProvider.display === '') {
                      foundProvider.display = foundProvider.person.display;
                    }
                    providerResults.next(foundProvider);
                  } else {
                    const msg =
                      'Error processing request: No provider with given person uuid found';
                    providerResults.error(msg);
                  }
                },
                (error) => {
                  const msg =
                    'Error processing request: No person with given uuid found';
                  providerResults.error(msg);
                }
              );
            }
          },
          (error) => {
            providerResults.error(error);
          }
        );
    }
    return providerResults;
  }

  private isEmpty(str: string) {
    return (
      _.isUndefined(str) ||
      _.isNull(str) ||
      str.trim().length === 0 ||
      str === 'null' ||
      str === 'undefined'
    );
  }
}
