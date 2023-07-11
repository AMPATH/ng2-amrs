import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class PreAppointmentOutreachResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  private getUrl(reportName: string): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
  }

  public getWeeklyPredictionsPatientList(params: any) {
    let urlParams: HttpParams = new HttpParams()
      .set('locationUuids', params.locationUuids)
      .set('yearWeek', params.yearWeek);

    if (params.processOutcome !== -1) {
      urlParams = urlParams.set('processOutcome', params.processOutcome);
    }

    const url = this.getUrl('ml-weekly-predictions');
    const request = this.http
      .get<any>(url, {
        params: urlParams
      })
      .pipe(
        map((response: any) => {
          return response.result;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
