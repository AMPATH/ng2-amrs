import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FamilyTestingService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public amrsUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  public getFamilyTestingReportData(params: any): Observable<any> {
    const urlParams = this.getUrlRequestParams(params);

    return this.http
      .get(`${this.url}patient-family-history`, {
        params: urlParams
      })
      .pipe(
        catchError((err: any) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText
          };
          return Observable.of(errorObj);
        }),
        map((response: any) => {
          return response;
        })
      );
  }

  public getUrlRequestParams(params): HttpParams {
    let urlParams: HttpParams = new HttpParams();

    if (params.locationUuids && params.locationUuids !== '') {
      urlParams = urlParams.set('locationUuids', params.locationUuids);
    }

    if (params.isEligible && params.isEligible !== '') {
      urlParams = urlParams.set('eligible', params.isEligible);
    }

    if (params.start_date && params.start_date !== '') {
      urlParams = urlParams.set('start_date', params.start_date);
    }

    if (params.end_date && params.end_date !== '') {
      urlParams = urlParams.set('end_date', params.end_date);
    }

    if (params.programType && params.programType !== '') {
      urlParams = urlParams.set('programType', params.programType);
    }

    if (params.childStatus && params.childStatus !== '') {
      urlParams = urlParams.set('child_status', params.childStatus);
    }
    if (params.elicitedClients && params.elicitedClients !== '') {
      urlParams = urlParams.set('elicited_clients', params.elicitedClients);
    }
    if (params.patientUuid && params.patientUuid !== '') {
      urlParams = urlParams.set('patientUuid', params.patientUuid);
    }
    urlParams = urlParams.set('startIndex', params.startIndex);

    return urlParams;
  }

  public getFamilyTreePatientList(params): Observable<any> {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.url + 'family-history-patient-list';

    return this.http
      .get(url, {
        params: urlParams
      })
      .pipe(
        catchError((err: any) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText
          };
          return Observable.of(errorObj);
        }),
        map((response: any) => {
          return response;
        })
      );
  }

  public savePatientContactTrace(payload) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${this.url}contact-tracing`,
      JSON.stringify(payload),
      { headers }
    );
  }

  public updatePatientContactTrace(payload) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${this.url}contact-tracing?trace_id=${payload.id}`,
      JSON.stringify(payload),
      { headers }
    );
  }

  public updatePatientContactType(traceId: string, payload) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${this.url}contact-tracing?trace_id=${traceId}`,
      JSON.stringify(payload),
      { headers }
    );
  }

  public getPatientEncounters(
    patientUuid: string,
    isFamilyTestingEncounter: boolean
  ) {
    const familyTestingEncounterTypeUuid = isFamilyTestingEncounter
      ? '3fbc8512-b37b-4bc2-a0f4-8d0ac7955127'
      : '5a58f6f5-f5a6-47eb-a644-626abd83f83b';
    return this.http.get(
      `${this.amrsUrl()}encounter?patient=${patientUuid}&encounterType=${familyTestingEncounterTypeUuid}`
    );
  }

  public getContactTraceHistory(contactId: number): Observable<any> {
    return this.http.get(
      `${this.url}contact-tracing-history?contact_id=${contactId}`
    );
  }

  public deleteContact(contactId: string) {
    return this.http.delete(`${this.url}contact?contact_id=${contactId}`);
  }
}
