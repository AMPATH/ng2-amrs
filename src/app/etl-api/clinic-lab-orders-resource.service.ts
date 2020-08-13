
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ClinicLabOrdersResourceService {
  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService) { }

  public getUrl(reportName): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `${reportName}`;

  }

  public getClinicLabOrders(params): Observable<any> {
    const url = this.getUrl('clinic-lab-orders');
    const urlParams: HttpParams = new HttpParams()
      .set('locationUuids', params.locationUuids)
      .set('endDate', params.endDate)
      .set('startDate', params.startDate)
      .set('limit', params.limit)
      .set('offset', params.offset);
    return this.http.get<any>(url, {
      params: urlParams
    }).pipe(
      map((response) => {
        return response.result;
      }));
    // return this.dataCache.cacheRequest(url, urlParams, request);
  }
  public getLabOrdersByPatientUuid(patientUuid): Observable<any> {
    const url = this.getUrls();
    const urlParams: HttpParams = new HttpParams()
      .set('patientUuid', patientUuid);
    return this.http.get<any>(url, {
      params: urlParams
    }).pipe(
      map((response) => {
        return response.result;
      }));
    // return this.dataCache.cacheRequest(url, urlParams, request);
  }

  public getUrls(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `lab-orders-by-patient`;
  }
}
