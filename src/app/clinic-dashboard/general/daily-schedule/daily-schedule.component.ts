import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from 'primeng/primeng';
import { DailyScheduleBaseComponent
} from '../../../clinic-schedule-lib/daily-schedule/daily-schedule.component';
import { ClinicDashboardCacheService }
  from '../../services/clinic-dashboard-cache.service';
import { DatePipe } from '@angular/common';
import * as Moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import {
    ClinicFlowCacheService
} from '../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
import { SelectDepartmentService
} from '../../../program-visit-encounter-search/program-visit-encounter-search.service';
@Component({
  selector: 'gen-daily-schedule',
  templateUrl: '../../../clinic-schedule-lib/daily-schedule/daily-schedule.component.html'
})
export class GeneralDailyScheduleComponent extends
DailyScheduleBaseComponent implements OnInit, OnDestroy {

  public routeSub: Subscription = new Subscription();
  public myDepartment = '';
  public _datePipe: DatePipe;
  public selectedDate: any;

  constructor(
    public clinicDashboardCacheService: ClinicDashboardCacheService,
    public router: Router,
    public route: ActivatedRoute,
    public clinicFlowCache: ClinicFlowCacheService) {
      super(clinicDashboardCacheService, router, route, clinicFlowCache);
      this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
   this.routeSub =  this.route.parent.parent.params.subscribe((params) => {
      this.clinicDashboardCacheService.setCurrentClinic(params['location_uuid']);
    });
    if (this.clinicFlowCache.lastClinicFlowSelectedDate) {
      this.selectedDate = this.clinicFlowCache.lastClinicFlowSelectedDate;
    } else {
      this.selectedDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.clinicFlowCache.setSelectedDate(this.selectedDate);
    }
  }

  public ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
