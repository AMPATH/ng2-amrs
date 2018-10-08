
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LabOrderResourceService {

  constructor(private http: HttpClient, private appSettingsService: AppSettingsService) {
  }

  public postOrderToEid(location, payload: any) {

    let url = this.appSettingsService.getEtlRestbaseurl().trim() + 'eid/order/';
    url = url + location;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), {headers});
  }
}
