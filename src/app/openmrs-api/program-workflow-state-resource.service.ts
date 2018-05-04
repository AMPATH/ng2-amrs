import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

// TODO inject service

@Injectable()
export class ProgramWorkFlowStateResourceService {

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'workflow';
  }

  public getProgramWorkFlowState(workFlowUuid): Observable<any> {

    if (!workFlowUuid) {
      return null;
    }

    let url = this.getUrl() + '/' + workFlowUuid + '/' + 'state';
    let v: string = 'custom:(uuid,initial,terminal,concept:(uuid,retired,display))';

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', v);
    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json().results;
    }).catch(this.handleError);
  }

private handleError(error: any) {
    return Observable.throw(error.message
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : 'Server Error');
  }

}
