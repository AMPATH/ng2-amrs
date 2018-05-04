import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Program } from '../models/program.model';

@Injectable()
export class PatientProgramResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }

  public getAllProgramVisitConfigs(ttl?: number): Observable<any> {
    let url = this.appSettingsService.getEtlRestbaseurl().trim();
    url += 'program-visit-configs';
    return this.http.get(url).map((response: Response) => {
      return response.json();
    });
  }

  public getPatientProgramVisitConfigs(patientUuid: string): Observable<any> {
    let url = this.appSettingsService.getEtlRestbaseurl().trim();
    url += 'patient-program-config?patientUuid=' + patientUuid;
    return this.http.get(url).map((response: Response) => {
      return response.json();
    });
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
    let url = this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient/' + patientUuid + '/program/' + programUuid +
      '/enrollment/' + enrollmentUuid;
    let params: URLSearchParams = new URLSearchParams();
    params.set('intendedLocationUuid', (locationUuid && locationUuid.length > 0)
      ? locationUuid : locationUuid);
    return this.http.get(url, { search: params }).map((response: Response) => {
      return response.json();
    });
  }
}
