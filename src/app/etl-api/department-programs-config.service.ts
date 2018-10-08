
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class DepartmentProgramsConfigService {
  constructor(protected http: HttpClient,
              protected appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) {
  }

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getDartmentProgramsConfig(): Observable<any> {

    let url = this.getBaseUrl() + 'departments-programs-config';
    let request = this.http.get(url);

    return this.cacheService.cacheRequest(url, '' , request);

  }

}
