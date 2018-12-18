
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

// TODO inject service

@Injectable()
export class PatientIdentifierTypeResService {

  public v = 'full';

  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'patientidentifiertype';
  }

  public getPatientIdentifierTypes(v: string = null): Observable<any> {

    const url = this.getUrl();
    const params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get<any>(url, {
      params: params
    }).pipe(
      map((response) => {
        return response.results;
      }));
  }

}
