import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { AppSettingsService } from '../app-settings/app-settings.service';


@Injectable()
export class PatientProgramResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }

  getPatientPrograms(patientUuid: string): Observable<any> {
    let url = this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient-program/' + patientUuid;
    return this.http.get(url).map((response: Response) => {
      return response.json();
    });
  }

  getPatientProgramByProgUuid(patientUuid: string, programUuid: string): Observable<any> {
    let url = this.appSettingsService.getEtlRestbaseurl().trim()
      + 'patient-program/' + patientUuid + '/program/' + programUuid;
    return this.http.get(url).map((response: Response) => {
      return response.json();
    });
  }
}
