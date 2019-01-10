
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class HivPatientClinicalSummaryResourceService {
  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService) {
  }

  public fetchPatientSummary(patientUuid: string): Observable<any> {
    const api: string = this.appSettingsService.getEtlServer() +
      '/patient/' + patientUuid + '/hiv-patient-clinical-summary';

    const params: HttpParams = new HttpParams()
    .set('startIndex', 0 as any as string)
    .set('limit', 10 as any as string);

    return this.http.get(api, {params: params});
  }

}
