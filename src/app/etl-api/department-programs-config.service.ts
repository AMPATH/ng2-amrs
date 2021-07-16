import { Injectable } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DataCacheService } from "../shared/services/data-cache.service";
import { HttpClient, HttpParams } from "@angular/common/http";
@Injectable()
export class DepartmentProgramsConfigService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getDartmentProgramsConfig(): Observable<any> {
    const url = this.getBaseUrl() + "departments-programs-config";
    const request = this.http.get(url);

    return this.cacheService.cacheRequest(url, "", request);
  }

  public getDepartmentPrograms(department): Observable<any> {
    const url = this.getBaseUrl() + "department-programs";
    const urlParams: HttpParams = new HttpParams().set(
      "department",
      department
    );
    urlParams.set("department", department);

    const request = this.http
      .get<any>(url, {
        params: urlParams,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
