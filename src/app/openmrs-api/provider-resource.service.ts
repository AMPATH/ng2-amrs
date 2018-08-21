
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable, Subject , ReplaySubject } from 'rxjs';
import { PersonResourceService } from './person-resource.service';
import * as _ from 'lodash';

@Injectable()
export class ProviderResourceService {

  public v: string = 'full';

  constructor(protected http: Http,
              protected appSettingsService: AppSettingsService,
              protected personService: PersonResourceService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'provider';
  }

  public searchProvider(searchText: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = this.getUrl() ;
    let params: URLSearchParams = new URLSearchParams();

    params.set('q', searchText);

    params.set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      search: params
    }).pipe(
      map((response: Response) => {
        return response.json().results;
      }));
  }

  public getProviderByUuid(uuid: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      search: params
    }).pipe(map((response: Response) => {
      return response.json();
    }));
  }
  public getProviderByPersonUuid(uuid) {
    let providerResults = new ReplaySubject(1);
    this.personService.getPersonByUuid(uuid, false).subscribe(
      (result) => {
        if (result) {
          let response = this.searchProvider(result.display);

          response.subscribe(
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
                let msg = 'Error processing request: No provider with given person uuid found';
                providerResults.error(msg);
              }

            },
            (error) => {
              let msg = 'Error processing request: No person with given uuid found';
              providerResults.error(msg);
            }
          );

        }

      },
      (error) => {
        providerResults.error(error);
      }
    );
    return providerResults;
    }
}
