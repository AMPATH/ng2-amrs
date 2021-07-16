import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import { AppSettingsService } from "../app-settings/app-settings.service";

import { PatientsRequiringVLResourceService } from "./patients-requiring-vl-resource.service";

@Injectable()
export class PatientsRequiringVLResourceServiceMock extends PatientsRequiringVLResourceService {
  public params = {
    startDate: "2017-07-01",
    locationUuids: "08fec056-1352-11df-a1f1-0026b9348838",
    endDate: "2017-07-31",
    startIndex: "0",
    limit: "100000",
  };
  constructor() {
    super(null, null, null);
  }

  public getPatientList(params): Observable<any> {
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
      size: 300,
      result: [
        {
          person_id: 800302,
          encounter_id: 7027747,
          location_id: 13,
          location_uuid: "08fec056-1352-11df-a1f1-0026b9348838",
          patient_uuid: "f8c900f2-99fa-4fb6-8347-33701a9ae322",
          gender: "M",
          birthdate: "1983-12-31T21:00:00.000Z",
          age: 33,
          has_pending_vl_test: 0,
          current_vl: 82,
          current_vl_date: "29-07-2016",
          days_since_last_order: null,
          last_vl_order_date: null,
          cur_regimen_arv_start_date: "18-01-2016",
          cur_arv_line: 1,
          cur_arv_meds: "6964",
          arv_first_regimen: "6964",
          person_name: "mathew kipyegon koech",
          identifiers: "056362671-2, 15204-34763",
        },
        {
          person_id: 814536,
          encounter_id: 7026891,
          location_id: 13,
          location_uuid: "08fec056-1352-11df-a1f1-0026b9348838",
          patient_uuid: "3176b41c-5692-45fb-a81f-26dab3467a9f",
          gender: "F",
          birthdate: "1968-06-21T21:00:00.000Z",
          age: 49,
          has_pending_vl_test: 0,
          current_vl: 5683,
          current_vl_date: "15-03-2017",
          days_since_last_order: null,
          last_vl_order_date: null,
          cur_regimen_arv_start_date: "15-03-2017",
          cur_arv_line: 1,
          cur_arv_meds: "6964",
          arv_first_regimen: "6964",
          person_name: "jane kigen chepkonga",
          identifiers: "654106214-4, 15204-35527",
        },
      ],
    };
  }
}
