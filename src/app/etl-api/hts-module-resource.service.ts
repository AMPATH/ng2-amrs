import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HTSModuleResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  public getHTSSummaryUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'hts-summary';
  }
  public getHTSLatestEncounterUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      'hts-latest-encounter'
    );
  }

  public getHTSSummary(patientUuid: string): Observable<any> {
    return this.http.get(this.getHTSSummaryUrl() + '/' + patientUuid);
  }
  public getHTSLatestEncounterDetails(patientUuid: string): Observable<any> {
    return this.http.get(this.getHTSLatestEncounterUrl() + '/' + patientUuid);
  }
}
