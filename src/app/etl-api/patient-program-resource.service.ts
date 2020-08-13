
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { concat, Observable, of, throwError } from 'rxjs';
import { flatMap, retryWhen, take } from 'rxjs/operators';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class PatientProgramResourceService {

  constructor(private http: HttpClient, private appSettingsService: AppSettingsService) {
  }

  public getAllProgramVisitConfigs(ttl?: number): Observable<any> {
    let url = this.appSettingsService.getEtlRestbaseurl().trim();
    url += 'program-visit-configs';
    return this.http.get(url);
  }

  public getPatientProgramVisitConfigs(patientUuid: string): Observable<any> {
    let url = this.appSettingsService.getEtlRestbaseurl().trim();
    url += 'patient-program-config?patientUuid=' + patientUuid;
    return this.http.get(url).pipe(retryWhen((error) => {
      return error.pipe(flatMap((err: any) => {
          if (err.status  === 403) {
            return of(err.status);
          }
          return throwError({error: 'No retry'});
        }), take(2));
    }));
  }
  /**
   *
   *
   * @param {string} patientUuid patient uuid
   * @param {string} programUuid program uuid
   * @param {any} enrollmentUuid patient program enrollment uuid
   * @param {string} locationUuid the intended location where one wants to start the visits
   * @returns {Observable<any>} returns a programs configrations opbject that contains the visit
   * that can be started in that location
   * @memberof PatientProgramResourceService
   */
  public getPatientProgramVisitTypes(
    patientUuid: string, programUuid: string,
    enrollmentUuid, locationUuid: string): Observable<any> {
    const url = this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient/' + patientUuid + '/program/' + programUuid +
      '/enrollment/' + enrollmentUuid;
    const params: HttpParams = new HttpParams()
    .set('intendedLocationUuid', (locationUuid && locationUuid.length > 0)
      ? locationUuid : locationUuid);
    return this.http.get(url, { params: params });
  }
}
