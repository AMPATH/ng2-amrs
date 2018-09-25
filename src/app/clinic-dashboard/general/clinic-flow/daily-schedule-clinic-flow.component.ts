
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ClinicFlowCacheService
} from '../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'daily-schedule-clinic-flow-component',
  templateUrl: './daily-schedule-clinic-flow.component.html'
})

export class DailyScheduleClinicFlowComponent implements OnInit, OnDestroy {
  public selectedDate: any;
  private _datePipe: DatePipe;
  private subs: Subscription[] = [];
  constructor(
    private clinicFlowCache: ClinicFlowCacheService,
    private clinicDashboardCacheService: ClinicDashboardCacheService) {
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    if (this.clinicFlowCache.lastClinicFlowSelectedDate) {
      this.selectedDate = this.clinicFlowCache.lastClinicFlowSelectedDate;
    } else {
      this.selectedDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.clinicFlowCache.setSelectedDate(this.selectedDate);
    }
    const routeSub = this.clinicDashboardCacheService.getCurrentClinic().subscribe((clinic) => {
      this.clinicFlowCache.setSelectedLocation(clinic);
    });

    this.subs.push(routeSub);
  }

  public ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
