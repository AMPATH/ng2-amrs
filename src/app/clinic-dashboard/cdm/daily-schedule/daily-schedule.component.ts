import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DailyScheduleBaseComponent
} from '../../../clinic-schedule-lib/daily-schedule/daily-schedule.component';
import { SelectDepartmentService } from './../../../shared/services/select-department.service';
import {
  ClinicFlowCacheService
} from '../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
@Component({
  selector: 'cdm-daily-schedule',
  templateUrl: '../../../clinic-schedule-lib/daily-schedule/daily-schedule.component.html'
})
export class CdmDailyScheduleComponent extends
DailyScheduleBaseComponent implements OnInit, OnDestroy {
  public myDepartment = 'CDM';
  public routeSub: Subscription;
  public paramsSub: Subscription;
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
    public selectDepartmentService: SelectDepartmentService,
    public clinicFlowCache: ClinicFlowCacheService) {
    super(clinicDashboardCacheService, router, route, clinicFlowCache);
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    console.log('cdm schedule loaded');
    this.setActiveTab();
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
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
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
