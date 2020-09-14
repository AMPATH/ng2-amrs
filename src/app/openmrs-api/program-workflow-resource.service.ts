import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

// TODO inject service

@Injectable()
export class ProgramWorkFlowResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'program';
  }

  public getProgramWorkFlows(uuid): Observable<any> {
    if (!uuid) {
      return null;
    }

    const url = this.getUrl() + '/' + uuid;
    const v: string =
      'custom:(uuid,display,allWorkflows:(uuid,retired,concept:(uuid,display)' +
      ',states:(uuid,initial,terminal,concept:(uuid,display))))';

    const params: HttpParams = new HttpParams().set('v', v);
    return this.http.get(url, {
      params: params
    });
  }
}
