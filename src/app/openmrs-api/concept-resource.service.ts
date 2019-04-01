
import {take} from 'rxjs/operators';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ConceptResourceService {

  public v = 'custom:(uuid,name,conceptClass,answers,setMembers)';

  constructor(protected http: HttpClient,
              protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'concept';
  }

  public searchConcept(searchText: string, cached: boolean = false, v: string = null):
  Observable<any> {

    const url = this.getUrl();
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

  public getConceptByUuid(uuid: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;
    const params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params: params
    });
  }
  public getConceptByConceptClassesUuid(searchText, conceptClassesUuidArray) {
    let filteredConceptResults = [];
    const response = this.searchConcept(searchText);
    response.pipe(take(1)).subscribe(
      (concepts) => {
        console.log(concepts, 'tamutamu');
        filteredConceptResults =
          this.filterResultsByConceptClassesUuid(concepts, conceptClassesUuidArray);
      },
      (error) => {

      }
    );
    return filteredConceptResults;
  }
  public filterResultsByConceptClassesUuid(results, conceptClassesUuidArray) {
    const res = _.filter(results, (result: any) => {
      return _.find(conceptClassesUuidArray, (uuid) => {
        return result.conceptClass.uuid === uuid;
      });
    });
    return res;
  }
}
