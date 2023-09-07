import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class HivPatientClinicalSummaryResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public fetchPatientSummary(
    patientUuid: string,
    isHEIActive?: any
  ): Observable<any> {
    const api: string =
      this.appSettingsService.getEtlServer() +
      '/patient/' +
      patientUuid +
      '/hiv-patient-clinical-summary';

    const params: HttpParams = new HttpParams()
      .set('startIndex', '0')
      .set('limit', '20')
      .set('isHEIActive', isHEIActive ? isHEIActive.toSting() : '');

    return this.http.get(api, { params: params });
  }
}
