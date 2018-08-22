import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ProgramReferralResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) { }
  public getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient-referral';
  }
  public saveReferralEncounter(payload): Observable<any> {
    if (!payload) {
      return Observable.from(null);
    }

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.getUrl(), JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json();
      });
  }
}
