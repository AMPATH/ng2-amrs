import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClinicDashboardCacheService }
  from '../../services/clinic-dashboard-cache.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DailyScheduleBaseComponent
} from '../../../clinic-schedule-lib/daily-schedule/daily-schedule.component';
import {
    ClinicFlowCacheService
} from '../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
import { SelectDepartmentService
} from '../../../program-visit-encounter-search/program-visit-encounter-search.service';
@Component({
  selector: 'hiv-daily-schedule',
  templateUrl: '../../../clinic-schedule-lib/daily-schedule/daily-schedule.component.html'
})
export class HivDailyScheduleComponent  extends
DailyScheduleBaseComponent implements OnInit, OnDestroy {
  public routeSub: Subscription = new Subscription();
  public myDepartment = 'HIV';
  public _datePipe: DatePipe;
  public selectedDate: any;
  public paramsSub: Subscription;

  constructor(
    public clinicDashboardCacheService: ClinicDashboardCacheService,
    public router: Router,
    public route: ActivatedRoute,
    public clinicFlowCache: ClinicFlowCacheService,
    private selectDepartmentService: SelectDepartmentService) {
      super(clinicDashboardCacheService, router, route, clinicFlowCache);
      this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    this.paramsSub = this.route
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
    this.paramsSub.unsubscribe();
  }

}
