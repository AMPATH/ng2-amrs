import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ErrorLogResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}
  /**
   * @param {*} param
   * @param {object} [payload]
   * @returns
   *
   * @memberOf ErrorLogResourceService
   */
  public postFormError(payload): any {
    if (!payload) {
      return null;
    }
    const url =
      this.appSettingsService.getEtlRestbaseurl().trim() + 'forms/error';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers });
  }
}
