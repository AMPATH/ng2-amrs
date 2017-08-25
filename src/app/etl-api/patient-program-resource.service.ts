import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { AppSettingsService } from '../app-settings';

@Injectable()
export class PatientProgramResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }

  public getPatientPrograms(patientUuid: string): Observable<any> {
    let url = this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient-program/' + patientUuid;
    return this.http.get(url).map((response: Response) => {
      return response.json();
    });
  }

  public getPatientProgramByProgUuid(patientUuid: string, programUuid: string): Observable<any> {
    let url = this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient-program/' + patientUuid + '/program/' + programUuid;
    return this.http.get(url).map((response: Response) => {
      return response.json();
    });
  }
}
