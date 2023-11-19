import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CohortOtzModuleResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}
  public getUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-modules'
    );
  }

  public getCohortOtzModule(cohortUuid: string): Observable<any> {
    return this.http.get(this.getUrl() + '/' + cohortUuid);
  }
}
