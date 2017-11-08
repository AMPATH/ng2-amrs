
import { Injectable } from '@angular/core';

@Injectable()
export class PatientListService {

  constructor() {
  }

  //
  public  getextraHivListColumns() {
    return [
      {
        headerName: 'Phone Number',
        field: 'phone_number',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Last VL Result',
        field: 'vl_1',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Last VL Date',
        field: 'vl_1_date',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'RTC Date',
        field: 'rtc_date',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      }
    ];
  }

}
