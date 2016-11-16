import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { HivSummaryResourceService } from '../../etl-api/hiv-summary-resource.service';
import { Helpers } from '../../utils/helpers';

@Injectable()
export class HivSummaryService {

  public hivSummary: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private hivSummaryResourceService: HivSummaryResourceService) { }

  getHivSummary(patientUuid: string,
    startIndex: string, limit: string,
    includeNonClinicalEncounter?: boolean): BehaviorSubject<any> {

    this.hivSummaryResourceService.getHivSummary(patientUuid,
      startIndex, limit, includeNonClinicalEncounter).subscribe((data) => {

      let hivSummary = data;

      for (let r = 0; r < hivSummary.length; r++) {
        let isPendingViralLoad = this.determineIfVlIsPending(hivSummary);
        let isPendingCD4 = this.determineIfCD4IsPending(hivSummary);
        hivSummary[r]['isPendingViralLoad'] = isPendingViralLoad;
        hivSummary[r]['isPendingCD4'] = isPendingViralLoad;
      }
      this.hivSummary.next(hivSummary);

    }, (error) => {
      console.error(error);
    });

    return this.hivSummary;
  }

  determineIfVlIsPending(hivSummary: any) {
    let overDueDays = !Helpers.isNullOrUndefined(hivSummary.vl_order_date) ?
      this.dateDiffInDays(new Date(hivSummary.vl_order_date), new Date()) : 0;
    if (overDueDays > 0) {
      if (!Helpers.isNullOrUndefined(hivSummary.vl_1_date)) {
        if (!Helpers.isNullOrUndefined(hivSummary.vl_order_date)) {
          return {
            status: hivSummary.vl_order_date > hivSummary.vl_1_date,
            days: overDueDays
          };
        }
      } else {
        return {
          status: true,
          days: overDueDays
        };
      }
    } else {
      return {
        status: false,
        days: overDueDays
      };
    }
  }

  determineIfCD4IsPending(hivSummary: any) {
    let overDueDays = !Helpers.isNullOrUndefined(hivSummary.cd4_order_date) ?
      this.dateDiffInDays(new Date(hivSummary.cd4_order_date), new Date()) : 0;
    if (overDueDays > 0) {
      if (!Helpers.isNullOrUndefined(hivSummary.cd4_1_date)) {
        if (!Helpers.isNullOrUndefined(hivSummary.cd4_order_date)) {
          return {
            status: hivSummary.cd4_order_date > hivSummary.cd4_1_date,
            days: overDueDays
          };
        }
      } else {
        return {
          status: true,
          days: overDueDays
        };
      }

    } else {
      return {
        status: false,
        days: overDueDays
      };
    }
  }

  dateDiffInDays(a: any, b: any) {
    let _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // a and b are Date objects
    // Discard the time and time-zone information.
    let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
}

