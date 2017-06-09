import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Message } from 'primeng/primeng';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { DatePipe } from '@angular/common';
import * as Moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import { ClinicFlowCacheService } from '../../clinic-flow/clinic-flow-cache.service';
@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleComponent implements OnInit {

  errors: any[] = [];
  selectedDate: any;
  selectedLocation: any;
  loadingData: boolean = true;
  @Output() selectedSchedule = new EventEmitter();
  private msgs: Message[] = [];
  private reportFilter: any = { ageRange: [40, 70] };
  private dataToBind: any = {
    ageRange: [0, 15],
    selectedGender: 'M,F',
    selectedLocations: ['cb31d052-b668-4321-80ad-c0aaa571f87b'],
    startDate: new Date('10/05/2016'),
    endDate: new Date('10/11/2016'),
    selectedIndicators: ['on_arvs', 'on_arvs_first_line']
  };
  private activeLinkIndex = 0;
  private tabLinks = [
    { label: 'Appointments', link: 'daily-appointments' },
    { label: 'Visits', link: 'daily-visits' },
    { label: 'Clinic Flow', link: 'clinic-flow' },
    { label: 'Has not returned', link: 'daily-not-returned' },
  ];
  private _datePipe: DatePipe;
  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
    private router: Router, private route: ActivatedRoute,
    private clinicFlowCache: ClinicFlowCacheService) {
    this._datePipe = new DatePipe('en-US');

  }
  ngOnInit() {
    this.setActiveTab();
    this.updateCurrentDate();
    this.clinicDashboardCacheService.getIsLoading().subscribe((value) => {
      this.loadingData = value;
    });

    this.clinicFlowCache.getIsLoading().subscribe((value) => {
      this.loadingData = value;
    });
    this.clinicDashboardCacheService.getCurrentClinic()
      .subscribe((location) => {
        this.selectedLocation = location;
        this.clinicFlowCache.setSelectedLocation(location);
      });
    if (this.clinicFlowCache.lastClinicFlowSelectedDate) {
      this.selectedDate = this.clinicFlowCache.lastClinicFlowSelectedDate;
    }
  }

  setActiveTab() {
    if (this.router.url) {
      let path = this.router.url;
      let n = this.router.url.indexOf('?');
      path = this.router.url.substring(0, n !== -1 ? n : path.length);
      path = path.substr(this.router.url.lastIndexOf('/') + 1);
      this.activeLinkIndex = this.tabLinks.findIndex(x => x.link === path);

    }
  }

  updateCurrentDate() {
    if (this.route && this.route.queryParams) {
      this.route.queryParams.subscribe((params) => {
        if (params['date']) {
          this.selectedDate = params['date'];
          let m = Moment(this.selectedDate);
          this.clinicDashboardCacheService.setDailyTabCurrentDate(this.selectedDate);
        } else {
          this.selectedDate = this._datePipe.transform(
            new Date(), 'yyyy-MM-dd');
        }
      });
    }

  }

  getSelectedDate(date) {
    let m = Moment(this.selectedDate).format('yyyy-MM-dd');
    this.selectedDate = date;
    this.clinicDashboardCacheService.setDailyTabCurrentDate(date);
    this.clinicFlowCache.setSelectedDate(date);
  }

  public onGenerateReport(event: any) {
    console.log(event, this.reportFilter);
    this.msgs = [];
    this.msgs.push({
      severity: 'info',
      summary: 'Success',
      detail: 'You have invoked generateRpt Fx from  parent cmpnt'
    });
  }

  public navigateDay(value) {

    if (value) {
      let m = Moment(new Date(this.selectedDate));
      let revisedDate = m.add(value, 'd');

      this.selectedDate = this._datePipe.transform(
        revisedDate, 'yyyy-MM-dd');
      this.clinicDashboardCacheService.setDailyTabCurrentDate(this.selectedDate);
      this.clinicFlowCache.setSelectedDate(this.selectedDate);
    }
  }
  private get diagnostic() {
    return JSON.stringify(this.reportFilter);
  }

  private get getDataToBind() {
    return JSON.stringify(this.dataToBind);
  }

  getDate(dateObject: any) {
    return dateObject.year + '-' + dateObject.month + '-' + dateObject.day;
  }


}
