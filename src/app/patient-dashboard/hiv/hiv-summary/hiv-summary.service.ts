import { take } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";

import { HivSummaryResourceService } from "../../../etl-api/hiv-summary-resource.service";
import { Helpers } from "../../../utils/helpers";

@Injectable()
export class HivSummaryService {
  public hivSummaryLatest: BehaviorSubject<any> = new BehaviorSubject(null);
  private limit = 20;

  constructor(private hivSummaryResourceService: HivSummaryResourceService) {}

  public getHivSummary(
    patientUuid: string,
    startIndex: number,
    limit: number,
    includeNonClinicalEncounter?: boolean
  ): Observable<any> {
    const hivSummary: BehaviorSubject<any> = new BehaviorSubject(null);

    this.hivSummaryResourceService
      .getHivSummary(
        patientUuid,
        startIndex,
        this.limit,
        includeNonClinicalEncounter
      )
      .pipe(take(1))
      .subscribe(
        (data) => {
          if (data) {
            // tslint:disable-next-line:prefer-for-of
            for (let r = 0; r < data.length; r++) {
              const isPendingViralLoad = this.determineIfVlIsPending(data);
              const isPendingCD4 = this.determineIfCD4IsPending(data);
              data[r]["isPendingViralLoad"] = isPendingViralLoad;
              data[r]["isPendingCD4"] = isPendingViralLoad;

              data[r].encounter_datetime = new Date(
                data[r].encounter_datetime
              ).setHours(0, 0, 0, 0);
              data[r].prev_rtc_date = new Date(data[r].prev_rtc_date).setHours(
                0,
                0,
                0,
                0
              );
            }
            hivSummary.next(data);
          }
          this.hivSummaryLatest.next(data);
        },
        (error) => {
          hivSummary.error(error);
          console.error(error);
        }
      );

    return hivSummary;
  }

  public determineIfVlIsPending(hivSummary: any) {
    const overDueDays = !Helpers.isNullOrUndefined(hivSummary.vl_order_date)
      ? this.dateDiffInDays(new Date(hivSummary.vl_order_date), new Date())
      : 0;
    if (overDueDays > 0) {
      if (!Helpers.isNullOrUndefined(hivSummary.vl_1_date)) {
        if (!Helpers.isNullOrUndefined(hivSummary.vl_order_date)) {
          return {
            status: hivSummary.vl_order_date > hivSummary.vl_1_date,
            days: overDueDays,
          };
        }
      } else {
        return {
          status: true,
          days: overDueDays,
        };
      }
    } else {
      return {
        status: false,
        days: overDueDays,
      };
    }
  }

  public determineIfCD4IsPending(hivSummary: any) {
    const overDueDays = !Helpers.isNullOrUndefined(hivSummary.cd4_order_date)
      ? this.dateDiffInDays(new Date(hivSummary.cd4_order_date), new Date())
      : 0;
    if (overDueDays > 0) {
      if (!Helpers.isNullOrUndefined(hivSummary.cd4_1_date)) {
        if (!Helpers.isNullOrUndefined(hivSummary.cd4_order_date)) {
          return {
            status: hivSummary.cd4_order_date > hivSummary.cd4_1_date,
            days: overDueDays,
          };
        }
      } else {
        return {
          status: true,
          days: overDueDays,
        };
      }
    } else {
      return {
        status: false,
        days: overDueDays,
      };
    }
  }

  public dateDiffInDays(a: any, b: any) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // a and b are Date objects
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
}
