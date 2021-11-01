import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class PatientEACSessionResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getPatientLatesSessionNumber(patientUuid): Observable<any> {
    if (!patientUuid) {
      return null;
    }
    const urlParams: HttpParams = new HttpParams().set(
      'patientUuid',
      patientUuid
    );
    const url = this.getBaseUrl() + 'eac-session';
    return this.http.get(url, {
      params: urlParams
    });
  }
}
