import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class LabsResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}
  public getNewPatientLabResults(params: {
    startDate: string;
    endDate: string;
    patientUuId: string;
    refresh?: boolean;
  }) {
    let urlParams: HttpParams = new HttpParams()
      .set('startDate', params.startDate)
      .set('endDate', params.endDate)
      .set('patientUuId', params.patientUuId);

    if (params.refresh) {
      urlParams = urlParams.set('mode', 'batch');
    }
    return this.http
      .get(this.getUrl(), { params: urlParams })
      .pipe(map(this.parseNewLabResults), catchError(this.handleError));
  }

  public getHistoricalPatientLabResults(
    patientUuId,
    params: { startIndex: string; limit: string }
  ) {
    if (!patientUuId) {
      return null;
    }
    if (!params.startIndex) {
      params.startIndex = '0';
    }
    if (!params.limit) {
      params.limit = '20';
    }
    const urlParams: HttpParams = new HttpParams()
      .set('startIndex', params.startIndex)
      .set('limit', params.limit);
    return this.http
      .get(
        this.appSettingsService.getEtlRestbaseurl().trim() +
          `patient/${patientUuId}/data`,
        { params: urlParams }
      )
      .pipe(map(this.parseHistoricalLabResults), catchError(this.handleError));
  }

  private getUrl() {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() + 'patient-lab-orders'
    );
  }

  private parseHistoricalLabResults(res) {
    const body = res;
    return body.result;
  }
  private parseNewLabResults(res) {
    const body = res;

    if (body.errors) {
      return body;
    }
    return body;
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
