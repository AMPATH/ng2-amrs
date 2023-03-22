import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class PatientCreationResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return (
      this.appSettingsService.getOpenmrsServer().trim() +
      '/module/idgen/generateIdentifier.form?source='
    );
  }

  public url(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'patient';
  }

  public getResourceUrl(): string {
    return (
      this.appSettingsService.getOpenmrsRestbaseurl().trim() +
      'patientidentifiertype'
    );
  }

  public getPatientIdentifierTypes() {
    const url = this.getResourceUrl();
    return this.http.get(url).pipe(
      map((results: any) => {
        return results.results;
      })
    );
  }

  public generatePatientIdentifier(source) {
    const getUrl = this.getUrl() + source;
    return this.http.get(getUrl);
  }

  public generateIdentifier(user) {
    const url =
      this.appSettingsService.getAmrsIdentifierRestbaseurl().trim() +
      '/generateidentifier';
    return this.http.post(url, user);
  }

  public generateUPI(patientUuid, countryCode = 'KE') {
    const url = `https://staging.ampath.or.ke/registry/api/identifier?patientUuid=${patientUuid}&countryCode=${countryCode}`;
    return this.http.get(url);
  }

  public searchRegistry(idType, id, countryCode = 'KE') {
    const url = `https://staging.ampath.or.ke/registry/api/uno?uno=${id}&idType=${idType}&countryCode=${countryCode}`;
    return this.http.get(url);
  }
  public updateRegistry(patientUuid) {
    const url = `https://staging.ampath.or.ke/registry/api/identifier?patientUuid=${patientUuid}`;
    return this.http.put(url, '');
  }
  public updateAttribute(payload, patientUuid, attributeUuid) {
    const url =
      this.appSettingsService.getOpenmrsRestbaseurl().trim() +
      'person/' +
      patientUuid +
      '/attribute/' +
      attributeUuid;
    console.log('url' + url);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers });
  }
  public savePatient(payload) {
    const url = this.url();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers });
  }

  public updateExistingPatient(payload, uuid) {
    const url =
      this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'person/' + uuid;
    console.log('url' + url);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers });
  }

  public updatePatientContact(patientUuid: string, obsGroupUuid: string) {
    const url = this.appSettingsService.getEtlRestbaseurl().trim();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(
      `${url}update-contact`,
      { uuid: patientUuid, obs_group_id: obsGroupUuid },
      { headers }
    );
  }
}
