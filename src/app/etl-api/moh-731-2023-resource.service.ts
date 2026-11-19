import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppSettingsService } from '../app-settings/app-settings.service';
import * as Moment from 'moment';

/**
 * MOH 731 (Ver. July 2023).
 *
 * Reads the same ETL endpoints as the O3 (3.x) MOH 731 report, so both show the
 * same figures. `exactLocations` keeps this report's own location filter: the
 * chosen locations are reported as they are, rather than widened to their
 * whole facility as the O3 report does for its session location.
 */
@Injectable({
  providedIn: 'root'
})
export class Moh7312023ResourceService {
  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) {}

  /** The O3 report routes sit at the ETL server root, beside its /etl routes. */
  private get rootUrl(): string {
    return this.appSettingsService
      .getEtlRestbaseurl()
      .trim()
      .replace(/etl\/?$/, '');
  }

  /**
   * The form for the selected locations: one combined sheet when aggregated,
   * otherwise one sheet per location (the O3 endpoint always aggregates what it
   * is given, so each location is asked for on its own).
   *
   * Returned in the `{ sections }` shape the report view folds together.
   */
  public getReport(params: any, sections?: string[]): Observable<any> {
    const uuids: string[] = String(params.locationUuids || '')
      .split(',')
      .map((uuid) => uuid.trim())
      .filter((uuid) => !!uuid);
    const perLocation = !params.isAggregated && uuids.length > 1;
    const requests = perLocation ? uuids : [uuids.join(',')];

    return forkJoin(
      requests.map((locationUuids) =>
        this.getMonthlySummary(params, locationUuids).pipe(
          map((response: any) => {
            const row = Object.assign(
              {},
              ...((response && response.result) || [])
            );
            delete row.location;
            delete row.location_id;
            delete row.location_uuid;
            if (!params.isAggregated) {
              row.location_uuid = locationUuids;
            }
            return { row, isReleased: !!(response && response.isReleased) };
          })
        )
      )
    ).pipe(
      map((parts: Array<any>) => ({
        sections: { all: { result: parts.map((part) => part.row) } },
        // released only when the server says the month is final
        isReleased: parts.length > 0 && parts.every((part) => part.isReleased)
      })),
      catchError((err: any) => {
        return observableOf({
          error: err.status,
          message: err.statusText
        });
      })
    );
  }

  private getMonthlySummary(params: any, locationUuids: string) {
    const urlParams: HttpParams = new HttpParams()
      .set('startDate', Moment(params.startDate).format('YYYY-MM-DD'))
      .set('endDate', Moment(params.endDate).format('YYYY-MM-DD'))
      .set('locationUuids', locationUuids)
      .set('exactLocations', 'true');
    return this.http.get<any>(this.rootUrl + 'moh-731-monthly-summary', {
      params: urlParams
    });
  }

  /**
   * One page of the patients behind an indicator. The caller walks the pages
   * until one comes back short, so a large list arrives whole without asking
   * the server for it in a single request.
   */
  public getPatientList(
    params: any,
    indicator: string,
    startIndex: number,
    limit: number
  ): Observable<any> {
    // Only what has a value is sent: an empty parameter is not the same as an
    // absent one to the server's validation, and most indicators are not
    // filtered by sex at all.
    // Normalised here as well as by the caller: the query filters on an exact
    // date, so anything else reaching it silently matches nothing.
    let urlParams: HttpParams = new HttpParams()
      .set('startDate', Moment(params.startDate).format('YYYY-MM-DD'))
      .set('endDate', Moment(params.endDate).format('YYYY-MM-DD'))
      .set('isAggregated', 'true')
      .set('exactLocations', 'true')
      .set('indicator', indicator)
      .set('startIndex', String(startIndex))
      .set('limit', String(limit));

    if (params.locationUuids) {
      urlParams = urlParams.set('locationUuids', params.locationUuids);
    }
    if (params.indicatorGender) {
      urlParams = urlParams.set('gender', params.indicatorGender);
    }

    return this.http
      .get<any>(this.rootUrl + 'moh-731-monthly-summary-patient-list', {
        params: urlParams
      })
      .pipe(
        map((response: any) => this.toPatientListColumns(response)),
        catchError((err: any) => {
          // The server's own message is kept: a bare status tells the user
          // nothing about which indicator or parameter it objected to.
          return observableOf({
            error: err.status,
            message:
              (err.error && (err.error.message || err.error.error)) ||
              err.statusText ||
              'Request failed'
          });
        })
      );
  }

  /**
   * The O3 linelist names its columns differently from this report's patient
   * list grid, so each row also carries the grid's names for the same values.
   */
  private toPatientListColumns(response: any): any {
    const rows =
      (response && response.results && response.results.results) || [];
    const day = (value: any) =>
      value ? Moment(value).format('YYYY-MM-DD') : value;
    rows.forEach((row: any) => {
      row.person_name = row.person_name || row.full_name;
      row.identifiers =
        row.identifiers ||
        [row.amrs_number, row.ccc_number, row.nupi]
          .filter((id: any) => !!id)
          .join(', ');
      row.upi_number = row.upi_number || row.nupi;
      row.cur_meds = row.cur_meds || row.cur_arv_meds;
      row.latest_rtc_date = row.latest_rtc_date || day(row.rtc_date);
      row.last_appointment = row.last_appointment || day(row.last_visit_date);
      row.enrollment_date = day(row.enrollment_date);
      row.arv_first_regimen_start_date = day(row.arv_first_regimen_start_date);
    });
    return response;
  }
}
