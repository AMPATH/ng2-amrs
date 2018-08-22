
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class MOTDNotificationService {

  constructor(private _http: Http, private appSettingsService: AppSettingsService) {
  }

  public geturl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getMotdNotification(): Observable<any> {

    let url = this.geturl();
    let url2 = url + 'motdNotifications';
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this._http.get(url2, options).pipe(map((res) => res.json()));

  }

}
