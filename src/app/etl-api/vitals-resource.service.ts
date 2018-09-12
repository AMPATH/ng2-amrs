
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';

@Injectable()
export class VitalsResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) { }
  public getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient';
  }
  public getVitals(patientUuid: string, startIndex: number, limit: number): Observable<any> {
    let url = this.getUrl();
    url += '/' + patientUuid + '/vitals';
    let params: URLSearchParams = new URLSearchParams();

    params.set('startIndex', startIndex.toString());
    params.set('limit', limit.toString());

    return this.http.get(url, {
      search: params
    }).pipe(map((response: Response) => {
      return response.json().result;
    }));
  }
}
