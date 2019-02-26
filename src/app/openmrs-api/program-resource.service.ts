
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';

// TODO inject service

@Injectable()
export class ProgramResourceService {

  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'program';
  }

  public getPrograms(): Observable<any> {

    const url = this.getUrl();
    const v = 'custom:(uuid,display,allWorkflows,concept:(uuid,display))';

    const params: HttpParams = new HttpParams()
    .set('v', v);
    return this.http.get<any>(url, {
      params: params
    }).pipe(map((response) => {
      return this.processPrograms(response.results);
    }));
  }

  // get proggram incompatibilities

  public getProgramsIncompatibilities() {
       return this.http.get('../patient-dashboard/programs/programs.json');
  }

  public getProgramByUuid(uuid: string) {
    const url = this.getUrl() + '/' + uuid;
    return this.http.get(url);
  }

  private processPrograms(data) {
    const arr = [];
    if (data.length > 0) {
      data.forEach((d) => {
        if (d.uuid === 'c4246ff0-b081-460c-bcc5-b0678012659e') {
          d.display = 'VIREMIA PROGRAM';
          arr.push(d);
        } else {
          arr.push(d);
        }
      });
    }

    return arr;
  }
}
