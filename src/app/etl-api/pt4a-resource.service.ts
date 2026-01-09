import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class Pt4aService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  private getUrl(name: string): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + name;
  }

  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }
  public getPeerPatients(params: any) {
    const urlParams: HttpParams = new HttpParams().set('uuid', params.uuid);

    const url = this.getUrl('pt4a');
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getPt4aPatients(params: any) {
    const urlParams: HttpParams = new HttpParams().set(
      'creator',
      params.creator
    );

    const url = this.getUrl('pt4a');
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
