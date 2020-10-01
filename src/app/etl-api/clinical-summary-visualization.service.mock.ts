import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ClinicalSummaryVisualizationResourceService } from './clinical-summary-visualization-resource.service';

@Injectable()
export class ClinicalVisualizationResourceServiceMock extends ClinicalSummaryVisualizationResourceService {
  public reportParams = {
    startDate: '2017-03-01',
    locationUuids: '08fec056-1352-11df-a1f1-0026b9348838',
    endDate: '2017-04-27',
    gender: 'M,F',
    indicators: '',
    groupBy: '',
    order: '',
    limit: '',
    startIndex: ''
  };
  constructor() {
    super(null, null, null);
  }

  public getHivComparativeOverviewReport(reportParams): Observable<any> {
    const subj = new Subject<any>();
    const that = this;
    setTimeout(() => {
      subj.next(that.getTestData());
    }, 100);

    return subj.asObservable();
  }

  public getTestData() {
    return {
      startIndex: 0,
      size: 1,
      result: [
        {
          reporting_date: '2016-07-30T21:00:00.000Z',
          location_uuid: '08feae7c-1352-11df-a1f1-0026b9348838',
          location_id: 1,
          reporting_month: '07/2016',
          currently_in_care_total: 3289,
          on_art_total: 3170,
          not_on_art_total: 119,
          patients_requiring_vl: 2828,
          tested_appropriately: 2506,
          not_tested_appropriately: 322,
          due_for_annual_vl: 86,
          pending_vl_orders: 0,
          missing_vl_order: 322,
          perc_tested_appropriately: 88.6139,
          virally_suppressed: 2236,
          not_virally_suppressed: 270,
          perc_virally_suppressed: 89.2259
        },
        {
          reporting_date: '2016-08-30T21:00:00.000Z',
          location_uuid: '08feae7c-1352-11df-a1f1-0026b9348838',
          location_id: 1,
          reporting_month: '08/2016',
          currently_in_care_total: 3289,
          on_art_total: 3170,
          not_on_art_total: 119,
          patients_requiring_vl: 2828,
          tested_appropriately: 2506,
          not_tested_appropriately: 322,
          due_for_annual_vl: 86,
          pending_vl_orders: 0,
          missing_vl_order: 322,
          perc_tested_appropriately: 88.6139,
          virally_suppressed: 2236,
          not_virally_suppressed: 270,
          perc_virally_suppressed: 89.2259
        },
        {
          reporting_date: '2016-09-30T21:00:00.000Z',
          location_uuid: '08feae7c-1352-11df-a1f1-0026b9348838',
          location_id: 1,
          reporting_month: '09/2016',
          currently_in_care_total: 3289,
          on_art_total: 3170,
          not_on_art_total: 119,
          patients_requiring_vl: 2828,
          tested_appropriately: 2506,
          not_tested_appropriately: 322,
          due_for_annual_vl: 86,
          pending_vl_orders: 0,
          missing_vl_order: 322,
          perc_tested_appropriately: 88.6139,
          virally_suppressed: 2236,
          not_virally_suppressed: 270,
          perc_virally_suppressed: 89.2259
        }
      ]
    };
  }
}
