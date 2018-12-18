import { Component, OnInit, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { Message, Schedule } from 'primeng/primeng';
import { ClinicDashboardCacheService } from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { DatePipe } from '@angular/common';
import * as Moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import { ClinicFlowCacheService } from '../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleBaseComponent implements OnInit, OnDestroy {

  public errors: any[] = [];
  private rlaSafe = false;
  public selectedDate = Moment().format('MMM  D , YYYY ');
  public viewDate = '';
  public changeDate;
  public selectedLocation: any;
  public loadingData  = true;
  public filterSet = false;
  @Output() public selectedSchedule = new EventEmitter();
  public msgs: Message[] = [];
  public calendarType  = 'daily';
  public reportFilter: any = { ageRange: [40, 70] };
  public dataToBind: any = {
    ageRange: [0, 15],
    selectedGender: 'M,F',
    selectedLocations: ['cb31d052-b668-4321-80ad-c0aaa571f87b'],
    startDate: new Date('10/05/2016'),
    endDate: new Date('10/11/2016'),
    selectedIndicators: ['on_arvs', 'on_arvs_first_line']
  };
  public activeLinkIndex = 0;
  public tabLinks = [
    { label: 'Appointments', link: 'daily-appointments' },
    { label: 'Visits', link: 'daily-visits' },
    { label: 'Clinic Flow', link: 'clinic-flow' },
    { label: 'Has not returned', link: 'daily-not-returned' },
  ];
  public _datePipe: DatePipe;
  private subs: Subscription[] = [];
  constructor(public clinicDashboardCacheService: ClinicDashboardCacheService,
              public router: Router,
              public route: ActivatedRoute,
              public clinicFlowCache: ClinicFlowCacheService) {
    this._datePipe = new DatePipe('en-US');

  }
  public ngOnInit() {
    this.setActiveTab();
    const sub = this.clinicDashboardCacheService.getCurrentClinic();
    // this.updateCurrentDate();
    this.clinicDashboardCacheService.getCurrentClinic()
      .subscribe((location) => {
        this.selectedLocation = location;
        this.clinicFlowCache.setSelectedLocation(location);
      });

    // this.subs.push(sub);

    if (this.clinicFlowCache.lastClinicFlowSelectedDate) {
      this.selectedDate = Moment(this.clinicFlowCache.lastClinicFlowSelectedDate).format('MMM  D , YYYY ');
    }
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
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

  public updateCurrentDate() {
    if (this.route && this.route.queryParams) {
    }

  }

  public getSelectedDate(date) {
    const m = Moment(this.selectedDate).format('yyyy-MM-dd');
    this.selectedDate = Moment(date).format('MMM  D , YYYY ');
    this.changeDate = new Date(this.selectedDate);
    this.clinicDashboardCacheService.setDailyTabCurrentDate(date);
    this.clinicFlowCache.setSelectedDate(date);
  }

  public onGenerateReport(event: any) {
    this.msgs = [];
    this.msgs.push({
      severity: 'info',
      summary: 'Success',
      detail: 'You have invoked generateRpt Fx from  parent cmpnt'
    });
  }

  public navigateDay(value) {

    if (value) {
      const m = Moment(new Date(this.selectedDate));
      const revisedDate = m.add(value, 'd');

      this.selectedDate = this._datePipe.transform(
        revisedDate, 'yyyy-MM-dd');
      this.changeDate = new Date(this.selectedDate);
      this.clinicDashboardCacheService.setDailyTabCurrentDate(this.selectedDate);
      this.clinicFlowCache.setSelectedDate(this.selectedDate);
    }
  }
  public get diagnostic() {
    return JSON.stringify(this.reportFilter);
  }

  public get getDataToBind() {
    return JSON.stringify(this.dataToBind);
  }

  public getDate(dateObject: any) {
    return dateObject.year + '-' + dateObject.month + '-' + dateObject.day;
  }

  public filterSelected($event) {
      this.filterSet = true;
      // this.selectedDate = this._datePipe.transform( this.selectedDate, 'yyyy-MM-dd');
      this.selectedDate = Moment($event.startDate).format('MMM  D , YYYY ');
      this.changeDate = new Date(this.selectedDate);
  }
  public navigate($event, link) {
    const queryParams = this.route.snapshot.queryParams;
    this.router.navigate(['./' + link], {
      queryParams : queryParams,
      relativeTo: this.route
    });
    setTimeout(( ) => {
      this.setActiveTab();
    }, 100);
  }

}
