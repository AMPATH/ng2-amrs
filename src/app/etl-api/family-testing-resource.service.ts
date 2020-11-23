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

  public getFamilyTestingReportData(patientId: string): Observable<any> {
    return this.http
      .get(`${this.url}patient-family-history?patientUuid=${patientId}`)
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

  public getFamilyTreePatientList(locationUuid: string): Observable<any> {
    return this.http
      .get(
        `${this.url}family-history-patient-list?locationUuid=${locationUuid}`
      )
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

  public getPatientEncounters(patientUuid: string) {
    const familyTestingEncounterTypeUuid =
      '975ae894-7660-4224-b777-468c2e710a2a';
    return this.http.get(
      `${this.amrsUrl()}encounter?patient=${patientUuid}&encounterType=${familyTestingEncounterTypeUuid}`
    );
  }

  public getContactTraceHistory(contactId: number) {
    return this.http.get(
      `${this.url}contact-tracing-history?contact_id=${contactId}`
    );
  }

  public deleteContact(contactId: string) {
    return this.http.delete(`${this.url}contact?contact_id=${contactId}`);
  }
}
