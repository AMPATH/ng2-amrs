import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KhisAirModuleResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  private getMoh731KHisToAirUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() + 'extract-moh-731'
    );
  }

  public postMOH731ExtractedData(payload: any): Observable<any> | null {
    if (!payload) {
      return null;
    }
    return this.http.post(this.getMoh731KHisToAirUrl(), payload);
  }
}
