import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class PatientCreationResourceService {
  private idgenUrl = 'https://ngx.ampath.or.ke/amrs-id-generator';

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
    const url = this.idgenUrl + '/generateidentifier';
    return this.http.post(url, user);
  }

  public savePatient(payload) {
    const url = this.url();
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
