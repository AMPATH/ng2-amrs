import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { DataCacheService } from "../shared/services/data-cache.service";
import { CacheService } from "ionic-cache";
import { HttpClient, HttpParams } from "@angular/common/http";
@Injectable()
export class MonthlyScheduleResourceService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    protected dataCache: DataCacheService,
    protected cacheService: CacheService
  ) {}

  public getMonthlySchedule(params) {
    const url = this.getUrl();

    const urlParamsObj: any = {};
    urlParamsObj["startDate"] = params.startDate;
    urlParamsObj["endDate"] = params.endDate;
    urlParamsObj["locationUuids"] = params.locationUuids;
    urlParamsObj["limit"] = params.limit;

    if (params.department && params.department.length > 0) {
      if (params.department === "HIV") {
        urlParamsObj["department"] = params.department;
      }
    }
    if (params.programType && params.programType.length > 0) {
      urlParamsObj["programType"] = params.programType;
    }
    if (params.visitType && params.visitType.length > 0) {
      urlParamsObj["visitType"] = params.visitType;
    }
    if (params.encounterType && params.encounterType.length > 0) {
      urlParamsObj["encounterType"] = params.encounterType;
    }
    urlParamsObj["groupBy"] =
      "groupByPerson,groupByAttendedDate,groupByRtcDate";

    const urlParams: HttpParams = new HttpParams({ fromObject: urlParamsObj });

    const request = this.http
      .get<any>(url, {
        params: urlParams,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );

    return this.dataCache.cacheRequest(url, urlParams, request);
  }

  public getUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() +
      "get-monthly-schedule"
    );
  }
}
