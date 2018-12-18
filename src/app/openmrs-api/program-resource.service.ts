
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

    let url = this.getUrl();
    let v: string = 'custom:(uuid,display,allWorkflows,concept:(uuid,display))';

    let params: HttpParams = new HttpParams()
    .set('v', v);
    return this.http.get<any>(url, {
      params: params
    }).pipe(map((response) => {
      return response.results;
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
}
