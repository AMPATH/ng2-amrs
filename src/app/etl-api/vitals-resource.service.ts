
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class VitalsResourceService {

  constructor(private http: HttpClient, private appSettingsService: AppSettingsService) { }
  public getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient';
  }
  public getVitals(patientUuid: string, startIndex: number, limit: number): Observable<any> {
    let url = this.getUrl();
    url += '/' + patientUuid + '/vitals';
    const params: HttpParams = new HttpParams()
    .set('startIndex', startIndex.toString())
    .set('limit', limit.toString());

    return this.http.get<any>(url, {
      params: params
    }).pipe(map((response) => {
      return response.result;
    }));
  }
}
