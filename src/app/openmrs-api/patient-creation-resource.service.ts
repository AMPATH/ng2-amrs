
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class PatientCreationResourceService {

  private idgenUrl = 'https://ngx.ampath.or.ke/amrs-id-generator';

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {
    return this.appSettingsService.getOpenmrsServer().trim() +
    '/module/idgen/generateIdentifier.form?source=';
  }

  public url(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'patient';
  }

  public getResourceUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'patientidentifiertype';
  }

  public getPatientIdentifierTypes() {
      const url = this.getResourceUrl();
      return this.http.get(url).pipe(map((results) => {
          return results.json().results;
      }));
  }

  public generatePatientIdentifier(source) {

      const getUrl = this.getUrl() + source;

      return this.http.get(getUrl).pipe(map((res) => {
        return res.json();
      }));

  }

  public generateIdentifier(user) {
    let url = this.idgenUrl + '/generateidentifier';
    return this.http.post(url, user).pipe(map((res) => {
        return res.json();
    }));

}

  public savePatient(payload) {
    let url = this.url();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, JSON.stringify(payload), options).pipe(
    map((response: Response) => {
      return response.json();
    }));
  }

}
