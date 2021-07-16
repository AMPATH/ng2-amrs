import { Injectable } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { DataCacheService } from "../shared/services/data-cache.service";
import { HttpClient, HttpParams } from "@angular/common/http";
@Injectable()
export class Moh731PatientListResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getPatientListUrl(reportName): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      `${reportName}/patient-list`
    );
  }

  public getUrlRequestParams(params): HttpParams {
    if (!params.startIndex) {
      params.startIndex = "0";
    }
    if (!params.limit) {
      params.limit = "300";
    }

    const urlParams: HttpParams = new HttpParams()
      .set("startIndex", params.startIndex)
      .set("endDate", params.endDate)
      .set("startDate", params.startDate)
      .set(
        "reportName",
        params.isLegacy ? params.reportName : "MOH-731-report-2017"
      )
      .set("indicator", params.indicator)
      .set("locationUuids", params.locationUuids)
      .set("limit", params.limit);
    return urlParams;
  }

  public getMoh731PatientListReport(params) {
    const urlParams = this.getUrlRequestParams(params);
    const url = this.getPatientListUrl("MOH-731-report");
    const request = this.http.get<any>(url, {
      params: urlParams,
    });
    console.log("MOH-731 report : ", request);
    return request;
  }
}
