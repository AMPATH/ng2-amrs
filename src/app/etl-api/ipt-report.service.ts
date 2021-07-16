import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import * as Moment from "moment";
import { AppSettingsService } from "../app-settings/app-settings.service";

@Injectable({
  providedIn: "root",
})
export class IptReportService {
  public get url(): string {
    return this.appSettingService.getEtlRestbaseurl().trim();
  }

  constructor(
    public http: HttpClient,
    public appSettingService: AppSettingsService
  ) {}

  public getIptReportData(params: {
    locationUuids: string;
    endDate: Date;
  }): Observable<IptReportResponse> {
    return this.http
      .get(
        `${this.url}tb-preventive-monthly-summary?locationUuids=${
          params.locationUuids
        }&endDate=${Moment(params.endDate).format("YYYY-MM-DD")}`
      )
      .pipe(
        catchError((err: any) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText,
          };
          return Observable.of(errorObj);
        }),
        map((response: any) => {
          return response;
        })
      );
  }

  public getIptReportPatientList(params: {
    locationUuids: string;
    endDate: Date;
    indicators: string;
  }): Observable<IptReportResponse> {
    return this.http
      .get(
        `${this.url}tb-preventive-monthly-summary-patient-list?indicators=${
          params.indicators
        }&locationUuids=${params.locationUuids}&endDate=${Moment(
          params.endDate
        ).format("YYYY-MM-DD")}`
      )
      .pipe(
        map((response: any) => response),
        catchError((err: Error) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText,
          };
          return Observable.of(errorObj);
        })
      );
  }
}

interface IptReportResponse {
  indicatorDefinitions: Array<any>;
  queriesAndSchemas: Array<any>;
  result: Array<any>;
  sectionDefinitions: Array<any>;
  error?: any | null;
}
