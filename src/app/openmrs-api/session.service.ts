import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers } from '@angular/http';

// TODO inject service

@Injectable()
export class SessionService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }

  getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'session';
  }

  getSession(credentials: any = null) {

    let headers = new Headers();

    if (credentials && credentials.username) {
      let base64 = btoa(credentials.username + ':' + credentials.password);

      headers.append('Authorization', 'Basic ' + base64);
    }

    let url = this.getUrl();

    return this.http.get(url, {
      headers: headers
    });
  }

  deleteSession() {

    let url = this.getUrl();

    return this.http.delete(url, {});
  }
}
