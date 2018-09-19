
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class ConceptResourceService {

  public v: string = 'custom:(uuid,name,conceptClass,answers)';

  constructor(protected http: Http,
              protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'concept';
  }

  public searchConcept(searchText: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = this.getUrl();
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

  public getConceptByUuid(uuid: string, cached: boolean = false, v: string = null):
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
  public getConceptByConceptClassesUuid(searchText, conceptClassesUuidArray) {
    let filteredConceptResults = [];
    let response = this.searchConcept(searchText);
    response.take(1).subscribe(
      (concepts) => {
        filteredConceptResults =
          this.filterResultsByConceptClassesUuid(concepts, conceptClassesUuidArray);
      },
      (error) => {

      }
    );
    return filteredConceptResults;
  }
  public filterResultsByConceptClassesUuid(results, conceptClassesUuidArray) {
    let res = _.filter(results, (result: any) => {
      return _.find(conceptClassesUuidArray, (uuid) => {
        return result.conceptClass.uuid === uuid;
      });
    });
    return res;
  }
}
