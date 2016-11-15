import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

// TODO inject service

@Injectable()
export class PatientResourceService {

  v: string = 'custom:(uuid,display,' +
    'identifiers:(identifier,uuid,identifierType:(uuid,name)),' +
    'person:(uuid,display,gender,birthdate,dead,age,deathDate,' +
    'causeOfDeath,preferredName:(uuid,preferred,givenName,middleName,familyName),'
    + 'attributes,preferredAddress:(uuid,preferred,address1,address2,cityVillage,' +
    'stateProvince,country,postalCode,countyDistrict,address3,address4,address5,address6)))';

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'patient';
  }

  searchPatient(searchText: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();

    params.set('q', searchText);

    params.set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      search: params
    })
      .map((response: Response) => {
        return response.json().results;
      });
  }

  getPatientByUuid(uuid: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }
}
