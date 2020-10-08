import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class CdmSummaryResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient';
  }

  public getCdmSummary(
    patientUuid: string,
    startIndex: number,
    limit: number,
    includeNonClinicalEncounter?: boolean
  ): Observable<any> {
    let url = this.getUrl();
    url += '/' + patientUuid + '/cdm-summary';

    let params: HttpParams = new HttpParams()
      .set('limit', limit.toString())
      .set('startIndex', startIndex.toString());

    if (includeNonClinicalEncounter !== undefined) {
      params = params.set(
        'includeNonClinicalEncounter',
        includeNonClinicalEncounter.toString()
      );
    }

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
}
