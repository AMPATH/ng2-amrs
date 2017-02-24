import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable, Subject, ReplaySubject } from 'rxjs/Rx';
import * as _ from 'lodash';


@Injectable()
export class ConceptResourceService {

  v: string = 'custom:(uuid,name,conceptClass,answers)';

  constructor(protected http: Http,
    protected appSettingsService: AppSettingsService) {
  }

  getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'concept';
  }

  searchConcept(searchText: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.getUrl();
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

  getConceptByUuid(uuid: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;
    console.log('url', url);
    let params: URLSearchParams = new URLSearchParams();

    params.set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }
  getConceptByConceptClassesUuid(searchText, conceptClassesUuidArray) {
    let filteredConceptResults = [];
    let response = this.searchConcept(searchText);
    response.subscribe(
      (concepts) => {
        filteredConceptResults =
          this.filterResultsByConceptClassesUuid(concepts, conceptClassesUuidArray);
      },
      (error) => {

      }
    );
    return filteredConceptResults;
  }
  filterResultsByConceptClassesUuid(results, conceptClassesUuidArray) {
    let res = _.filter(results, (result: any) => {
      return _.find(conceptClassesUuidArray, (uuid) => {
        return result.conceptClass.uuid === uuid;
      });
    });
    return res;
  }
}

