import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Helpers } from '../../../utils/helpers';
import { CdmSummaryResourceService } from 'src/app/etl-api/cdm-summary-resource.service';

@Injectable({ providedIn: 'root' })
export class CdmSummaryService {
  public cdmSummaryLatest: BehaviorSubject<any> = new BehaviorSubject(null);
  private limit = 20;

  constructor(private cdmSummaryResourceService: CdmSummaryResourceService) {}

  public getCdmSummary(
    patientUuid: string,
    startIndex: number,
    limit: number,
    includeNonClinicalEncounter?: boolean
  ): Observable<any> {
    const cdmSummary: BehaviorSubject<any> = new BehaviorSubject(null);

    this.cdmSummaryResourceService
      .getCdmSummary(
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
            cdmSummary.next(data);
          }
          this.cdmSummaryLatest.next(data);
        },
        (error) => {
          cdmSummary.error(error);
          console.error(error);
        }
      );

    return cdmSummary;
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
