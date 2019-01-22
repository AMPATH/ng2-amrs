
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class HivSummaryResourceService {

  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService) { }

  public getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient';
  }

  public getHivSummary(patientUuid: string, startIndex: number, limit: number,
    includeNonClinicalEncounter?: boolean): Observable<any> {
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

    const params: HttpParams = new HttpParams()
      .set('startIndex', startIndex as any as string)
      .set('limit', limit as any as string)
      .set('includeNonClinicalEncounter', includeNonClinicalEncounter as any as string);

    return this.http.get<any>(url, {
      params: params
    }).pipe(
      map((response) => {
        return response.result;
      }));
  }
}
