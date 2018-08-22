import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

// TODO inject service

@Injectable()
export class ProgramWorkFlowResourceService {

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'program';
  }

  public getProgramWorkFlows(uuid): Observable<any> {

    if (!uuid) {
      return null;
    }

    let url = this.getUrl() + '/' + uuid;
    let v: string = 'custom:(uuid,display,allWorkflows:(uuid,retired,concept:(uuid,display)' +
      ',states:(uuid,initial,terminal,concept:(uuid,display))))';

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', v);
    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }

}
