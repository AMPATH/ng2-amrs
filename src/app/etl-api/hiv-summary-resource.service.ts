
import {map} from 'rxjs/operators';
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

    let params: HttpParams = new HttpParams();

    if (includeNonClinicalEncounter !== undefined) {
      params = params.set('includeNonClinicalEncounter', includeNonClinicalEncounter.toString());
    }
    params.set('startIndex', startIndex.toString())
          .set('limit', limit.toString());

    return this.http.get<any>(url, {
      params: params
    }).pipe(
      map((response) => {
        return response.result;
      }));
  }
}
