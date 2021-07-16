import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { Observable } from "rxjs";
import { DataCacheService } from "../shared/services/data-cache.service";

@Injectable()
export class HivDifferentiatedCareResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public geturl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getPatientList(
    startDate: string,
    endDate: string,
    locationUuids: string,
    indicators: string,
    startIndex,
    limit
  ): Observable<any> {
    const api: string =
      this.geturl() + "differentiated-care-program/patient-list";

    const urlParams: HttpParams = new HttpParams()
      .set("startDate", startDate)
      .set("endDate", endDate)
      .set("locationUuids", locationUuids)
      .set("indicators", indicators)
      .set("startIndex", startIndex)
      .set("limit", limit);

    const request = this.http.get(api, { params: urlParams });
    return this.cacheService.cacheRequest(api, urlParams, request);
  }
}
