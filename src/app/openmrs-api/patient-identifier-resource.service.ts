import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { PatientIdentifier } from '../models/patient-identifier.model';
import { catchError, map } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientIdentifierResourceService {
  private v = 'custom:(uuid,identifier,identifierType';
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  private getBaseUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'patient';
  }
  public getPatientIdentifiers(patientUuid: string) {
    const url = this.getBaseUrl() + `/${patientUuid}/identifier`;
    return this.http
      .get<{
        results: PatientIdentifier[];
      }>(url)
      .pipe(
        map((res) => {
          if (res.results) {
            return res.results;
          } else {
            throw new Error(
              'An error occurred when getting patient identifiers'
            );
          }
        }),
        catchError((__) => {
          return of(null);
        })
      );
  }
}
