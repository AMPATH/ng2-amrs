
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UserCohortResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) { }
  public getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'user-cohorts';
  }
  public getUserCohorts(userUuid: string): Observable<any> {
    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();
    params.set('userUuid', userUuid);

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }
}
