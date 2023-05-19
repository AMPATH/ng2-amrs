import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

// TODO inject service

@Injectable()
export class PatientIdentifierTypeResService {
  public v = 'full';

  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return (
      this.appSettingsService.getOpenmrsRestbaseurl().trim() +
      'patientidentifiertype'
    );
  }

  public getPatientIdentifierTypes(v: string = null): Observable<any> {
    const url = this.getUrl();
    const params: HttpParams = new HttpParams().set(
      'v',
      v && v.length > 0 ? v : this.v
    );

    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.results;
        })
      );
  }

  public patientVerificationIdentifierTypeFormat() {
    return [
      {
        label: 'National ID Number',
        format: null,
        checkdigit: null,
        val: '58a47054-1359-11df-a1f1-0026b9348838'
      },
      {
        label: 'Birth Certificate Entry Number',
        format: '',
        checkdigit: 0,
        val: '7924e13b-131a-4da8-8efa-e294184a1b0d'
      },
      {
        label: 'Passport Number',
        format: '',
        checkdigit: 0,
        val: 'ced014a1-068a-4a13-b6b3-17412f754af2'
      }
    ];
  }
}
