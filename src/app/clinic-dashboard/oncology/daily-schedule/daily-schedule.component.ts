import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ClinicDashboardCacheService }
  from '../../services/clinic-dashboard-cache.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DailyScheduleBaseComponent
} from '../../../clinic-schedule-lib/daily-schedule/daily-schedule.component';
import { SelectDepartmentService
} from '../../../program-visit-encounter-search/program-visit-encounter-search.service';
import {
  ClinicFlowCacheService
} from '../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
@Component({
  selector: 'onc-daily-schedule',
  templateUrl: '../../../clinic-schedule-lib/daily-schedule/daily-schedule.component.html'
})
export class OncDailyScheduleComponent extends
DailyScheduleBaseComponent implements OnInit, OnDestroy {

  public routeSub: Subscription = new Subscription();
  public myDepartment = 'ONCOLOGY';

  constructor(
    public clinicDashboardCacheService: ClinicDashboardCacheService,
    public router: Router,
    public route: ActivatedRoute,
    public selectDepartmentService: SelectDepartmentService,
    public clinicFlowCache: ClinicFlowCacheService) {
    super(clinicDashboardCacheService, router, route, clinicFlowCache);
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    this.route
    .queryParams
    .subscribe((params) => {
       if (params.startDate) {
        this.selectedDate = params.startDate;
        this.clinicFlowCache.setSelectedDate(this.selectedDate);
       }
    });
    this.selectDepartmentService.setDepartment(this.myDepartment);
    this.routeSub = this.route.parent.parent.params.subscribe((params) => {
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
