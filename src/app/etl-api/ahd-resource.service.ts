import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Moment from 'moment';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AhdResourceService {
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }
  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) {}
  public getAhdMonthlyReport(params: any): Observable<any> {
    // tslint:disable-next-line: max-line-length

    const stardDate = this.getDates(params.month).currentMonthFirstDate;
    return this.http
      .get(
        `${this.url}ahd-monthly-summary?endDate=${params.month}&startDate=${stardDate}&locationUuids=${params.locationUuids}&isAggregated=${params.isAggregated}`
      )
      .pipe(
        catchError((err: any) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText
          };
          return Observable.of(errorObj);
        }),
        map((response: Response) => {
          return response;
        })
      );
  }
  public getDates(currentEndDate) {
    // Convert the currentEndDate string to a Date object
    const currentDate = new Date(currentEndDate);

    // Get the current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate the previous month's last date
    const previousMonthLastDate = new Date(
      currentYear,
      currentMonth,
      0
    ).getDate();

    // Calculate the current month's end date
    const currentMonthEndDate = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

    // Calculate the current month's first date
    const currentMonthFirstDate = new Date(currentYear, currentMonth, 1);

    // Format the dates as strings in the "YYYY-MM-DD" format
    const previousMonthLastDateString =
      currentYear +
      '-' +
      currentMonth.toString().padStart(2, '0') +
      '-' +
      previousMonthLastDate.toString().padStart(2, '0');

    const currentMonthEndDateString = currentEndDate;
    const currentMonthFirstDateString =
      currentMonthFirstDate.getFullYear() +
      '-' +
      (currentMonthFirstDate.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      currentMonthFirstDate.getDate().toString().padStart(2, '0');

    // Return the formatted dates
    return {
      currentMonthFirstDate: currentMonthFirstDateString
    };
  }

  public getAhdPatientList(params: any, locationUuid: string): Observable<any> {
    // tslint:disable-next-line: max-line-length
    const stardDate = this.getDates(params.month).currentMonthFirstDate;

    return this.http
      .get(
        `${this.url}ahd-monthly-summary-patient-list?indicators=${params.indicators}&startDate=${stardDate}&endDate=${params.month}&locationUuids=${params.locationUuids}`
      )
      .pipe(
        catchError((err: any) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText
          };
          return Observable.of(errorObj);
        }),
        map((response: Response) => {
          return response;
        })
      );
  }
}
