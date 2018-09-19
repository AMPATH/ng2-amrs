
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { ReplaySubject, Observable } from 'rxjs';

import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class FormsResourceService {
  private forms = new ReplaySubject(1);

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }

  /**
   *
   *
   * @param {boolean} [forceRefresh]
   * @returns
   *
   * @memberOf AmrsDataService
   */
  public getForms(forceRefresh?: boolean) {
    // If the Subject was NOT subscribed before OR if forceRefresh is requested

    let params = new URLSearchParams();
    params.set('v', 'custom:(uuid,name,encounterType:(uuid,name),version,' +
      'published,retired,resources:(uuid,name,dataType,valueReference))');
    params.set('q', 'POC');

    if (!this.forms.observers.length || forceRefresh) {
      this.http.get(
        this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'form',
        {
          search: params
        }
      ).pipe(
        map((res: Response) => res.json()))
        .take(1).subscribe(
          (data) => this.forms.next(data.results),
          (error) => this.forms.error(error)
        );
    }

    return this.forms;
  }

  public getFormClobDataByUuid(uuid: string, v: string = null): Observable<any> {

    let url = this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'clobdata';
    url += '/' + uuid;

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', (v && v.length > 0) ? v : 'full');

    return this.http.get(url, {
      search: params
    }).pipe(map((response: Response) => {
      return response.json();
    }));
  }

  public getFormMetaDataByUuid(uuid: string, v: string = null): Observable<any> {

    let url = this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'form';
    url += '/' + uuid;

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', (v && v.length > 0) ? v : 'full');

    return this.http.get(url, {
      search: params
    }).pipe(map((response: Response) => {
      return response.json();
    }));
  }

}
