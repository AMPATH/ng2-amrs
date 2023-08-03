import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Moment from 'moment';
import { PatientService } from '../patient-dashboard/services/patient.service';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';

@Injectable()
export class HivSummaryResourceService {
  public months: string;
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient';
  }

  public getHivSummary(
    patientUuid: string,
    startIndex: number,
    limit: number,
    includeNonClinicalEncounter?: boolean,
    dob?: any
  ): Observable<any> {
    let url = this.getUrl();
    url += '/' + patientUuid + '/hiv-summary';

    if (!startIndex) {
      startIndex = 0;
    }
    if (!limit) {
      limit = 10;
    }
    if (includeNonClinicalEncounter !== undefined) {
      includeNonClinicalEncounter = false;
    }
    this.months = Moment().diff(Moment(dob), 'months').toString();

    const params: HttpParams = new HttpParams()
      .set('startIndex', (startIndex as any) as string)
      .set('limit', (limit as any) as string)
      .set(
        'includeNonClinicalEncounter',
        (includeNonClinicalEncounter as any) as string
      )
      .set('age', (this.months as any) as string);

    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.result;
        })
      );
  }

  public getHivNegativesPatientSummary(p): Observable<any> {
    let url = this.getUrl();
    url += '/' + p.patientUuid + '/patient-summary';
    if (!p.program) {
      return;
    }

    if (!p.startIndex) {
      p.startIndex = 0;
    }
    if (!p.limit) {
      p.limit = 10;
    }
    if (p.includeNonClinicalEncounter !== undefined) {
      p.includeNonClinicalEncounter = false;
    }

    const params: HttpParams = new HttpParams()
      .set('startIndex', (p.startIndex as any) as string)
      .set('limit', (p.limit as any) as string)
      .set('program', (p.program as any) as string)
      .set(
        'includeNonClinicalEncounter',
        (p.includeNonClinicalEncounter as any) as string
      );

    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
