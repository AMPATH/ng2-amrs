import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FacilityResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  getMflCodes(): Observable<any> {
    const url = this.getUrl() + 'mflcodes';
    return this.http.get<any>(url);
  }

  getFacilityMapping(): Observable<any> {
    const url = this.getUrl() + 'parentlocations';
    return this.http.get<any>(url);
  }

  getChildMapping(location_id): Observable<any> {
    const url = this.getUrl() + `childlocations?parentId=${location_id}`;
    return this.http.get<any>(url);
  }
}
