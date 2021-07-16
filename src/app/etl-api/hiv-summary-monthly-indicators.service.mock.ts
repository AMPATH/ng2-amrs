import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HivMonthlySummaryIndicatorsResourceService } from "./hiv-monthly-summary-indicators-resource.service";

@Injectable()
export class HivMonthlyIndicatorsResServiceMock extends HivMonthlySummaryIndicatorsResourceService {
  public reportParams = {
    startDate: "2017-03-01",
    locationUuids: "08fec056-1352-11df-a1f1-0026b9348838",
    endDate: "2017-04-27",
    gender: "M,F",
    indicators: "on_arvs",
    startAge: 0,
    endAge: 110,
  };
  constructor() {
    super(null, null, null);
  }

  public getHivSummaryMonthlyIndicatorsReport(reportParams): Observable<any> {
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
          location: "MTRH Module 1",
          location_uuid: "08feae7c-1352-11df-a1f1-0026b9348838",
          location_id: 1,
          encounter_datetime: "2017-04-12T09:35:13.000Z",
          month: "2017-04-12T09:35:13.000Z",
          patients: 1084,
          on_arvs: 1081,
          on_arvs_first_line: 856,
          on_arvs_second_line: 225,
          on_arvs_third_line: 0,
        },
        {
          location: "MTRH Module 2",
          location_uuid: "08feae7c-1352-11df-a1f1-0026b9348838",
          location_id: 1,
          encounter_datetime: "2017-04-12T09:35:13.000Z",
          month: "2017-04-12T09:35:13.000Z",
          patients: 1084,
          on_arvs: 1081,
          on_arvs_first_line: 856,
          on_arvs_second_line: 225,
          on_arvs_third_line: 0,
        },
      ],
    };
  }
}
