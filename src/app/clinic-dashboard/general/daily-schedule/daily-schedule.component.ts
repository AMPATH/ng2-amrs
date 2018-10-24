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
  public paramsSub: Subscription;
  public selectedDate: any;
  public activeLinkIndex = 0;
  public tabLinks = [
    { label: 'Appointments', link: 'daily-appointments' },
    { label: 'Visits', link: 'daily-visits' },
    { label: 'Clinic Flow', link: 'clinic-flow' },
    { label: 'Has not returned', link: 'daily-not-returned' },
  ];

  constructor(
    public clinicDashboardCacheService: ClinicDashboardCacheService,
    public router: Router,
    public route: ActivatedRoute,
    private selectDepartmentService: SelectDepartmentService,
    public clinicFlowCache: ClinicFlowCacheService) {
      super(clinicDashboardCacheService, router, route, clinicFlowCache);
      this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    this.setActiveTab();
    this.paramsSub = this.route
    .queryParams
    .subscribe((params) => {
       if (params.startDate) {
        this.selectedDate = Moment(params.startDate).format('MMM  D , YYYY ');
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
      this.selectedDate = Moment().format('MMM  D , YYYY ');
      this.clinicFlowCache.setSelectedDate(this.selectedDate);
    }
  }

  public ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  public setActiveTab() {
    if (this.router.url) {
      let path = this.router.url;
      const n = this.router.url.indexOf('?');
      path = this.router.url.substring(0, n !== -1 ? n : path.length);
      path = path.substr(this.router.url.lastIndexOf('/') + 1);
      this.activeLinkIndex = this.tabLinks.findIndex((x) => x.link === path);

    }
  }

}
