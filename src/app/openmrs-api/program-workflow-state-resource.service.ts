import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpParams, HttpClient } from '@angular/common/http';

// TODO inject service

@Injectable()
export class ProgramWorkFlowStateResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'workflow';
  }

  public getProgramWorkFlowState(workFlowUuid): Observable<any> {
    if (!workFlowUuid) {
      return null;
    }

    const url = this.getUrl() + '/' + workFlowUuid + '/' + 'state';
    const v = 'custom:(uuid,initial,terminal,concept:(uuid,retired,display))';

    const params: HttpParams = new HttpParams().set('v', v);
    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.results;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    return observableThrowError(
      error.message
        ? error.message
        : error.status
        ? `${error.status} - ${error.statusText}`
        : 'Server Error'
    );
  }
}
