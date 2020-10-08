import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class MOTDNotificationService {
  constructor(
    private _http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  public geturl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getMotdNotification(): Observable<any> {
    const url = this.geturl();
    const url2 = url + 'motdNotifications';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.get(url2, { headers });
  }
}
