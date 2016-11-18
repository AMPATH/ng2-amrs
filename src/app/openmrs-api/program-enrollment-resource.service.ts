import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
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
    let v: string = 'custom:(uuid,display,dateEnrolled,dateCompleted,program:(uuid))';

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
}
