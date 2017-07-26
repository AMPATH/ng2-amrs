
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ClinicFlowCacheService
} from '../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';

@Component({
  selector: 'daily-schedule-clinic-flow-component',
  templateUrl: './daily-schedule-clinic-flow.component.html'
})

export class DailyScheduleClinicFlowComponent {
  public selectedDate: any;
  private _datePipe: DatePipe;
  constructor(private clinicFlowCache: ClinicFlowCacheService) {
    this._datePipe = new DatePipe('en-US');
  }

  ngOnInit() {
    if (this.clinicFlowCache.lastClinicFlowSelectedDate) {
      this.selectedDate = this.clinicFlowCache.lastClinicFlowSelectedDate;
    } else {
      this.selectedDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.clinicFlowCache.setSelectedDate(this.selectedDate);
    }
  }
}
