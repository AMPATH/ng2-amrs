import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// TODO inject service

@Injectable()
export class SessionService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'session';
  }

  public getSession(credentials: any = null) {
    let headers = new HttpHeaders();

    if (credentials && credentials.username) {
      const base64 = btoa(credentials.username + ':' + credentials.password);
      headers = headers.append('Authorization', 'Basic ' + base64);
    }

    const url = this.getUrl();
    return this.http.get(url, { headers: headers });
  }

  public deleteSession() {
    const url = this.getUrl();
    return this.http.delete(url, {});
  }
}
