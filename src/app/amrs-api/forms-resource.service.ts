import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class FormsResourceService {
  private forms = new ReplaySubject(1);

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }

  /**
   *
   *
   * @param {boolean} [forceRefresh]
   * @returns
   *
   * @memberOf AmrsDataService
   */
  public getForms(forceRefresh?: boolean) {
    // If the Subject was NOT subscribed before OR if forceRefresh is requested

    let params = new URLSearchParams();
    params.set('v', 'custom:(uuid,name,encounterType:(uuid,name),version,published,retired,retiredReason,resources:(uuid,name,dataType,valueReference))');
    params.set('q', 'POC');

    if (!this.forms.observers.length || forceRefresh) {
      this.http.get(
        this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'form',
        {
          search: params
        }
      )
        .map((res: Response) => res.json())
        .subscribe(
          data => this.forms.next(data.results),
          error => this.forms.error(error)
        );
    }

    return this.forms;
  }

}
