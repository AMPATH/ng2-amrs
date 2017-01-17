import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class PatientRelationshipTypeResourceService {


  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'relationshiptype';
  }

  public getPatientRelationshipTypes(): Observable<any> {

    let url = this.getUrl();
    let v: string = 'full';
    let params: URLSearchParams = new URLSearchParams();

    params.set('v', v);
    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json().results;
    });
  }
}
