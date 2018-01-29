import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

// TODO inject service

@Injectable()
export class ProgramEnrollmentResourceService {

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'programenrollment';
  }

  public getProgramEnrollmentByPatientUuid(uuid: string): Observable<any> {

    let url = this.getUrl();
    let v: string = 'custom:(uuid,display,voided,dateEnrolled,dateCompleted,' +
      'location,program:(uuid),states:(uuid,startDate,endDate,state:(uuid,initial,terminal,' +
      'concept:(uuid,display))))';

    if (!uuid) {
      return null;
    }

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', v);
    params.set('patient', uuid);

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json().results;
    });
  }

  public getProgramEnrollmentStates(uuid: string): Observable<any> {

    let url = this.getUrl();
    let v: string = 'custom:(uuid,display,states:(uuid,startDate,endDate,' +
      'state:(uuid,concept:(uuid,display))))';

    if (!uuid) {
      return null;
    }

    let params: URLSearchParams = new URLSearchParams();
    url = url + '/' + uuid;
    params.set('v', v);

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json().results;
    });
  }

  public saveUpdateProgramEnrollment(payload) {
    if (!payload) {
      return null;
    }
    let url = this.getUrl();
    if (payload.uuid) {
      url = url + '/' + payload.uuid;
    }
    delete payload['uuid'];
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json();
      }).catch(this.handleError);
  }

    public updateProgramEnrollmentState(programEnrollmentUuid, payload) {
    if (!payload || !programEnrollmentUuid) {
      return null;
    }

    if (!payload.uuid) {
       return null;
    }
    let url = this.getUrl();
    url = url + '/' + programEnrollmentUuid + '/' + 'state' + '/' + payload.uuid;

    delete payload['uuid'];
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json();
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
