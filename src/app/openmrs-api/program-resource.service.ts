
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable, Subject } from 'rxjs';

// TODO inject service

@Injectable()
export class ProgramResourceService {

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'program';
  }

  public getPrograms(): Observable<any> {

    let url = this.getUrl();
    let v: string = 'custom:(uuid,display,allWorkflows,concept:(uuid,display))';

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', v);
    return this.http.get(url, {
      search: params
    }).pipe(map((response: Response) => {
      return response.json().results;
    }));
  }

  // get proggram incompatibilities

  public getProgramsIncompatibilities() {
       return this.http.get('../patient-dashboard/programs/programs.json').pipe(
        map((response) => {
        return response.json();
      }));
  }

  public getProgramByUuid(uuid: string) {
    const url = this.getUrl() + '/' + uuid;
    return this.http.get(url).pipe(
      map((response) => {
        return response.json();
      }));
  }
}
