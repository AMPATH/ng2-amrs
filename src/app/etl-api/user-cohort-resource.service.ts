import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class UserCohortResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}
  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'user-cohorts';
  }
  public getUserCohorts(userUuid: string): Observable<any> {
    const url = this.getUrl();
    const params: HttpParams = new HttpParams().set('userUuid', userUuid);
    return this.http.get(url, {
      params: params
    });
  }
}
