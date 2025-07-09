import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class MedicationDeliveryResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  public getMedicationDeliveryUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      'medication-delivery-list'
    );
  }

  public getMedicationDeliveryList(
    locationUuids: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.http.get(this.getMedicationDeliveryUrl(), {
      params: new HttpParams()
        .set('locationUuids', locationUuids)
        .set('startDate', startDate)
        .set('endDate', endDate),
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }),
      observe: 'body',
      responseType: 'json'
    });
  }
}
